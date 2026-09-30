import { useReducedMotion } from 'framer-motion';
import useShaderCanvas from './useShaderCanvas';

const FRAGMENT = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;

const vec3 DEEP  = vec3(0.000, 0.408, 0.937); // #0068EF
const vec3 AZURE = vec3(0.000, 0.447, 0.933); // #0072EE
const vec3 SKY   = vec3(0.000, 0.525, 0.906); // #0086E7
const vec3 CYAN  = vec3(0.000, 0.682, 0.867); // #00AEDD
const vec3 LOW   = vec3(0.000, 0.455, 0.890); // #0074E3
const vec3 FOAM  = vec3(0.560, 0.920, 1.000);

float aspect;

vec3 screen(vec3 a, vec3 b) { return 1.0 - (1.0 - a) * (1.0 - clamp(b, 0.0, 1.0)); }

float curve(float x, float t, float base, float tilt, float amp, float freq, float speed, float phase) {
  return base + tilt * (x - 0.5)
    + amp * sin(x * freq + t * speed + phase)
    + amp * 0.45 * sin(x * freq * 1.83 - t * speed * 0.63 + phase * 2.1)
    + amp * 0.18 * sin(x * freq * 3.1 + t * speed * 1.27 + phase * 0.7);
}

// Signed distance (in screen-height units) from an isotropic point to the curve.
float dist(vec2 q, float t, float base, float tilt, float amp, float freq, float speed, float phase) {
  float x = q.x / aspect;
  float e = 0.002;
  float c = curve(x, t, base, tilt, amp, freq, speed, phase);
  float slope = (curve(x + e, t, base, tilt, amp, freq, speed, phase)
               - curve(x - e, t, base, tilt, amp, freq, speed, phase)) / (2.0 * e) / aspect;
  return (q.y - c) / sqrt(1.0 + slope * slope);
}

vec3 ribbon(vec3 col, vec2 q, float t, float base, float tilt, float amp, float freq, float speed, float phase,
            float width, float fillA, float edgeA) {
  float d1 = dist(q, t, base, tilt, amp, freq, speed, phase);
  float d2 = dist(q, t, base - width, tilt, amp * 1.18, freq, speed, phase + 0.9);

  float aa = 1.5 / u_res.y;
  float inside = abs(smoothstep(-aa, aa, d1) - smoothstep(-aa, aa, d2));
  float shade = clamp(abs(d2) / max(abs(d1) + abs(d2), 1e-4), 0.0, 1.0);
  col = mix(col, mix(CYAN, FOAM, 0.35), inside * fillA * mix(0.25, 1.0, pow(shade, 1.2)));

  float below = (1.0 - inside) * step(d1, 0.0) * step(d2, 0.0);
  col = mix(col, DEEP * 0.88, below * exp(max(d1, d2) / 0.09) * 0.42);

  float e1 = exp(-pow(d1 / 0.0016, 2.0)) + exp(-pow(d1 / 0.012, 2.0)) * 0.22;
  float e2 = exp(-pow(d2 / 0.0014, 2.0)) + exp(-pow(d2 / 0.010, 2.0)) * 0.18;
  col = screen(col, FOAM * (e1 * edgeA + e2 * edgeA * 0.7));
  return col;
}

vec3 strands(vec3 col, vec2 q, float t, float base, float tilt, float amp, float freq, float speed, float phase,
             float spread, float alpha) {
  for (int k = 0; k < 7; k++) {
    float fk = float(k);
    float d = dist(q, t, base + fk * spread, tilt, amp * (1.0 + fk * 0.07), freq, speed, phase + fk * 0.11);
    col = screen(col, FOAM * exp(-pow(d / 0.0013, 2.0)) * alpha * (1.0 - fk * 0.1));
  }
  return col;
}

vec2 rotateAround(vec2 q, vec2 pivot, float a) {
  float s = sin(a), c = cos(a);
  q -= pivot;
  return vec2(c * q.x - s * q.y, s * q.x + c * q.y) + pivot;
}

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  aspect = u_res.x / u_res.y;
  vec2 q = vec2(uv.x * aspect, uv.y);
  float t = u_time;

  vec3 col = mix(DEEP, SKY, smoothstep(0.0, 1.0, uv.x));
  col = mix(col, AZURE, 0.35 * smoothstep(0.4, 1.0, uv.y));
  float glow = exp(-(pow(uv.x - 0.62, 2.0) / 0.16 + pow(uv.y - 0.34, 2.0) / 0.05));
  col = mix(col, CYAN, glow * 0.8);
  col = mix(col, LOW, smoothstep(0.22, 0.0, uv.y) * 0.55);

  col = ribbon(col, q, t, 0.22, 0.10, 0.07, 3.0, -0.30, 4.4, 0.10, 0.34, 0.30);
  col = ribbon(col, q, t, 0.46, -0.26, 0.12, 2.0, 0.26, 3.1, 0.22, 0.58, 0.40);
  col = ribbon(col, q, t, 0.68, -0.22, 0.10, 2.5, -0.28, 1.7, 0.08, 0.36, 0.50);
  col = ribbon(col, q, t, 0.90, -0.42, 0.09, 3.0, 0.34, 0.0, 0.12, 0.40, 0.50);

  col = strands(col, q, t, 0.70, -0.42, 0.07, 3.0, 0.34, 0.4, 0.013, 0.30);
  col = strands(col, q, t, 0.30, 0.08, 0.08, 2.3, 0.26, 3.5, 0.011, 0.18);

  vec2 r1 = rotateAround(q, vec2(aspect * 0.80, 0.50), 1.08);
  col = strands(col, r1, t, 0.50, 0.0, 0.05, 2.4, -0.24, 2.2, 0.016, 0.24);
  vec2 r2 = rotateAround(q, vec2(aspect * 0.92, 0.40), 0.86);
  col = ribbon(col, r2, t, 0.46, 0.0, 0.04, 2.0, 0.22, 5.0, 0.07, 0.22, 0.36);

  col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`;

const AnimatedProcessBackground = () => {
  const reduceMotion = useReducedMotion();
  const { canvasRef, status } = useShaderCanvas({ fragment: FRAGMENT, still: !!reduceMotion, dprCap: 1.5 });

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-gradient-to-br from-[#0068EF] via-[#0090E6] to-[#00AEDD]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full transition-opacity duration-700"
        style={{ opacity: status === 'ready' ? 1 : 0 }}
        aria-hidden="true"
      />
    </div>
  );
};

export default AnimatedProcessBackground;
