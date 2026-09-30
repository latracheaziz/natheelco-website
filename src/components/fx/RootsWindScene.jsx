import { useCallback, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import useShaderCanvas from './useShaderCanvas';

const FRAGMENT = `
precision highp float;
uniform sampler2D u_image;
uniform sampler2D u_mask;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_frac;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 s = gl_FragCoord.xy / u_res;
  s.y = 1.0 - s.y;
  vec2 uv = 0.5 + (s - 0.5) * u_frac;
  float t = u_time;

  vec3 m = texture2D(u_mask, uv).rgb;
  // Hard gates: the blurred mask fringe along the ridgeline must not move the rock.
  float sky = smoothstep(0.62, 0.9, m.r);
  float fol = smoothstep(0.55, 0.88, m.g);

  // Gusts roll across the trees in the wind direction (+x).
  float gust = 0.4 + 0.6 * smoothstep(0.25, 0.75, noise(vec2(uv.x * 1.4 - t * 0.13, t * 0.04)));

  // Palms and grass: crowns sway more than the base, leaves flutter.
  float crown = smoothstep(0.80, 0.36, uv.y);
  float sway = sin(t * 0.8 + uv.x * 7.0) * 0.55 + (noise(vec2(uv.x * 5.0 - t * 0.48, uv.y * 3.0)) - 0.5) * 1.4;
  float flutter = noise(uv * vec2(70.0, 50.0) + vec2(-t * 1.7, t * 0.9)) - 0.5;
  vec2 disp = vec2(0.0);
  disp.x += fol * gust * sway * 0.0032 * (0.35 + crown);
  disp.y += fol * gust * crown * sin(t * 1.2 + uv.x * 13.0) * 0.0008;
  disp += fol * flutter * 0.0012 * (0.5 + gust);

  vec3 col = texture2D(u_image, uv - disp).rgb;

  // Clouds drift downwind, and only where both the pixel and its source stay in sky.
  vec2 flow = vec2(1.0, -0.1) + (vec2(noise(uv * 3.0 + t * 0.06), noise(uv * 3.0 + 17.0 - t * 0.06)) - 0.5) * 0.7;
  float period = 5.0;
  float reach = 0.04;
  float p0 = fract(t / period);
  float p1 = fract(t / period + 0.5);
  vec2 o0 = flow * (p0 - 0.5) * reach;
  vec2 o1 = flow * (p1 - 0.5) * reach;
  float w0 = 1.0 - abs(2.0 * p0 - 1.0);
  vec3 flowed = mix(texture2D(u_image, uv - o1).rgb, texture2D(u_image, uv - o0).rgb, w0);
  float skyHold = sky * min(smoothstep(0.62, 0.9, texture2D(u_mask, uv - o0).r),
                             smoothstep(0.62, 0.9, texture2D(u_mask, uv - o1).r));
  col = mix(col, flowed, skyHold);

  // Thin cirrus wisps, sky only.
  vec2 wp = vec2(uv.x * 2.6 - t * 0.021, uv.y * 6.0);
  float wisp = fbm(wp + fbm(wp * 1.3 + vec2(t * 0.03, 0.0)) * 1.2);
  col = mix(col, vec3(0.93, 0.96, 1.0), smoothstep(0.5, 0.85, wisp) * 0.3 * sky);

  gl_FragColor = vec4(col, 1.0);
}
`;

const boxBlur = (channel, width, height, radius) => {
  const tmp = new Float32Array(channel.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      for (let k = -radius; k <= radius; k++) sum += channel[y * width + Math.min(width - 1, Math.max(0, x + k))];
      tmp[y * width + x] = sum / (radius * 2 + 1);
    }
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      for (let k = -radius; k <= radius; k++) sum += tmp[Math.min(height - 1, Math.max(0, y + k)) * width + x];
      channel[y * width + x] = sum / (radius * 2 + 1);
    }
  }
};

// R = sky, G = palms/grass, B = puddle. Thresholds are tuned for /roots-hero.jpeg.
const buildMask = (img) => {
  const width = 256;
  const height = Math.round((width * img.naturalHeight) / img.naturalWidth);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, width, height);
  const image = ctx.getImageData(0, 0, width, height);
  const px = image.data;
  const channels = [0, 1, 2].map(() => new Float32Array(width * height));

  for (let i = 0; i < width * height; i++) {
    const r = px[i * 4];
    const g = px[i * 4 + 1];
    const b = px[i * 4 + 2];
    const y = Math.floor(i / width) / height;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    // Sandstone is distinctly redder than the palms, so it stays out of both masks.
    const rock = r > g + 16 && r > b + 8;
    const sky = !rock && y < 0.66 && ((b > r + 25 && b >= g) || (b >= r - 5 && b > g && lum > 175));
    const foliage = !sky && !rock && y > 0.30 && y < 0.76 && g + 6 >= r && g >= b * 0.9;
    const water = 0;
    channels[0][i] = sky ? 1 : 0;
    channels[1][i] = foliage ? 1 : 0;
    channels[2][i] = water ? 1 : 0;
  }

  channels.forEach((channel) => {
    boxBlur(channel, width, height, 2);
    boxBlur(channel, width, height, 2);
  });

  for (let i = 0; i < width * height; i++) {
    px[i * 4] = channels[0][i] * 255;
    px[i * 4 + 1] = channels[1][i] * 255;
    px[i * 4 + 2] = channels[2][i] * 255;
    px[i * 4 + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
};

const loadImage = (src) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = src;
});

const EDGE_ROOM = 0.97;

const RootsWindScene = ({ src }) => {
  const reduceMotion = useReducedMotion();
  const imageAspect = useRef(4 / 3);

  const loadTextures = useCallback(async () => {
    const img = await loadImage(src);
    imageAspect.current = img.naturalWidth / img.naturalHeight;
    return [
      { name: 'u_image', source: img },
      { name: 'u_mask', source: buildMask(img) },
    ];
  }, [src]);

  const setUniforms = useCallback((gl, loc, width, height) => {
    const canvasAspect = width / height;
    const wide = canvasAspect > imageAspect.current;
    const fx = wide ? 1 : canvasAspect / imageAspect.current;
    const fy = wide ? imageAspect.current / canvasAspect : 1;
    gl.uniform2f(loc('u_frac'), fx * EDGE_ROOM, fy * EDGE_ROOM);
  }, []);

  const { canvasRef, status } = useShaderCanvas({
    fragment: FRAGMENT,
    loadTextures,
    setUniforms,
    dprCap: 1,
    still: !!reduceMotion,
  });

  return (
    <>
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: `scale(${1 / EDGE_ROOM})` }}
        fetchPriority="high"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full transition-opacity duration-700"
        style={{ opacity: status === 'ready' ? 1 : 0 }}
        aria-hidden="true"
      />
    </>
  );
};

export default RootsWindScene;
