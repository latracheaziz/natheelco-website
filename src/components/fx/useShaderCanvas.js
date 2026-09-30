import { useEffect, useRef, useState } from 'react';

const VERTEX = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const compile = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

const createRenderer = (canvas, fragment, textures, dprCap) => {
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, premultipliedAlpha: false });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return null;
  }
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const locations = {};
  const loc = (name) => {
    if (!(name in locations)) locations[name] = gl.getUniformLocation(program, name);
    return locations[name];
  };

  textures.forEach(({ name, source }, unit) => {
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
    gl.uniform1i(loc(name), unit);
  });

  const draw = (time, setUniforms) => {
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, width, height);
    gl.uniform2f(loc('u_res'), width, height);
    gl.uniform1f(loc('u_time'), time);
    setUniforms?.(gl, loc, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const destroy = () => gl.getExtension('WEBGL_lose_context')?.loseContext();

  return { draw, destroy };
};

/**
 * Drives a full-screen fragment shader on a canvas. Pauses while off-screen or
 * when the tab is hidden; renders a single still frame when `still` is true.
 */
const useShaderCanvas = ({ fragment, loadTextures, setUniforms, dprCap = 1.5, still = false, stillTime = 6 }) => {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const setUniformsRef = useRef(setUniforms);
  setUniformsRef.current = setUniforms;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let renderer = null;
    let raf = 0;
    let disposed = false;
    let onScreen = true;
    let elapsed = stillTime;
    let last = 0;

    const frame = (now) => {
      raf = 0;
      if (last) elapsed += Math.min((now - last) / 1000, 0.1);
      last = now;
      renderer.draw(elapsed, setUniformsRef.current);
      if (!still && onScreen && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (renderer && !raf && !disposed) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
    });
    observer.observe(canvas);

    const onVisibility = () => { if (!document.hidden) start(); };
    const onResize = () => { if (still) start(); };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', onResize);

    Promise.resolve(loadTextures ? loadTextures() : [])
      .then((textures) => {
        if (disposed) return;
        renderer = createRenderer(canvas, fragment, textures, dprCap);
        if (!renderer) {
          setStatus('failed');
          return;
        }
        setStatus('ready');
        start();
      })
      .catch(() => !disposed && setStatus('failed'));

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      renderer?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fragment, still, dprCap]);

  return { canvasRef, status };
};

export default useShaderCanvas;
