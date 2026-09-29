import { motion } from 'framer-motion';

// Coordinates live in a 1000 x 600 plane; pins use the same space as percentages.
const roads = [
  { id: 'north', d: 'M -20 250 C 120 230, 200 210, 260 216 S 400 170, 480 156 S 700 150, 760 180 S 950 230, 1020 210', near: [3, 'hq', 5], w: 3.2 },
  { id: 'east', d: 'M 480 156 C 500 230, 560 240, 620 264 S 760 330, 800 372 S 900 480, 1020 520', near: ['hq', 2, 6], w: 3 },
  { id: 'west', d: 'M 260 216 C 300 280, 340 320, 380 348 S 500 420, 580 432 S 700 470, 760 620', near: [3, 1, 4], w: 2.8 },
  { id: 'south', d: 'M 480 156 C 450 240, 400 300, 380 348 S 300 480, 220 620', near: ['hq', 1], w: 2.4 },
  { id: 'link', d: 'M 620 264 C 600 330, 590 380, 580 432', near: [2, 4], w: 2 },
  { id: 'ring', d: 'M 410 360 A 150 90 0 1 0 710 360 A 150 90 0 1 0 410 360', near: [1, 2, 4, 6], w: 2.2 },
  { id: 'ghalia', d: 'M 800 372 C 720 420, 650 430, 580 432', near: [6, 4], w: 1.8 },
  { id: 'designs', d: 'M 1020 80 C 900 120, 820 150, 760 180', near: [5], w: 1.8 },
  { id: 'far-west', d: 'M -20 470 C 100 440, 250 400, 380 348', near: [1], w: 1.6 },
];

// Deterministic pseudo-random so the city looks the same every render.
const seeded = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const rand = seeded(42);
const cityLights = Array.from({ length: 170 }, () => {
  const a = rand() * Math.PI * 2;
  const r = Math.pow(rand(), 0.7);
  return {
    x: 56 + Math.cos(a) * r * 17,
    y: 60 + Math.sin(a) * r * 17,
    d: rand() * 3,
    s: rand() > 0.85 ? 3 : 2,
  };
});

const streets = [];
for (let i = 0; i < 14; i++) {
  const y = 290 + i * 11;
  streets.push(`M ${430 + (i % 3) * 8} ${y} L ${690 - (i % 4) * 10} ${y + 6}`);
}
for (let i = 0; i < 16; i++) {
  const x = 440 + i * 16;
  streets.push(`M ${x} ${300 + (i % 3) * 6} L ${x + 10} ${430 - (i % 4) * 8}`);
}

const MapTerrain = ({ revealed, hovered, reduce }) => {
  const draw = reduce
    ? { initial: false, animate: { pathLength: 1, opacity: 1 } }
    : {
        initial: { pathLength: 0, opacity: 0 },
        animate: revealed ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 },
      };

  return (
    <>
      <img
        src="/map/hail-terrain.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover rounded-[40px] select-none"
        draggable={false}
      />
      <div className="absolute inset-0 rounded-[40px] bg-[radial-gradient(ellipse_at_55%_55%,rgba(46,139,156,0.18),transparent_60%)]" />
      <div className="map-contours rounded-[40px]" />
      <div className="absolute inset-0 rounded-[40px] shadow-[inset_0_0_160px_60px_#060E1A]" />

      {/* City lights */}
      <div className="absolute inset-0 pointer-events-none">
        {cityLights.map((l, i) => (
          <span
            key={i}
            className="city-light"
            style={{ left: `${l.x}%`, top: `${l.y}%`, width: l.s, height: l.s, animationDelay: `${l.d}s` }}
          />
        ))}
      </div>

      <svg viewBox="0 0 1000 600" className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
        <defs>
          <filter id="road-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <radialGradient id="street-fade" cx="56%" cy="60%" r="22%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="street-mask">
            <rect width="1000" height="600" fill="url(#street-fade)" />
          </mask>
        </defs>

        {/* Minor street grid */}
        <g mask="url(#street-mask)" transform="rotate(-8 560 360)">
          {streets.map((d, i) => (
            <motion.path
              key={d}
              d={d}
              className="map-road-minor"
              strokeWidth={0.8}
              {...draw}
              transition={{ duration: 1.6, delay: 0.8 + i * 0.02, ease: 'easeOut' }}
            />
          ))}
        </g>

        {/* Glow underlay */}
        <g filter="url(#road-glow)" opacity="0.8">
          {roads.map((r, i) => {
            const lit = hovered != null && r.near.includes(hovered);
            return (
              <motion.path
                key={`g-${r.id}`}
                d={r.d}
                className="map-road-main"
                strokeWidth={r.w * (lit ? 5 : 3)}
                style={{ stroke: lit ? '#FFD27A' : '#E8B04A', transition: 'stroke-width 0.4s, stroke 0.4s' }}
                {...draw}
                transition={{ duration: 2.2, delay: 0.2 + i * 0.12, ease: [0.65, 0, 0.35, 1] }}
              />
            );
          })}
        </g>

        {/* Crisp roads */}
        {roads.map((r, i) => {
          const lit = hovered != null && r.near.includes(hovered);
          return (
            <motion.path
              key={`r-${r.id}`}
              d={r.d}
              className="map-road-main"
              strokeWidth={lit ? r.w * 1.4 : r.w * 0.7}
              style={{ stroke: lit ? '#FFF1CC' : '#F2C46B', transition: 'stroke-width 0.4s, stroke 0.4s' }}
              {...draw}
              transition={{ duration: 2.2, delay: 0.2 + i * 0.12, ease: [0.65, 0, 0.35, 1] }}
            />
          );
        })}

        {/* Travelling light pulses */}
        {!reduce && revealed && roads.slice(0, 6).map((r, i) => (
          <path
            key={`p-${r.id}`}
            d={r.d}
            pathLength="100"
            className="map-road-pulse"
            strokeWidth={r.w * 1.6}
            style={{ animationDelay: `${2.4 + i * 0.9}s`, filter: 'drop-shadow(0 0 4px #FFD27A)' }}
          />
        ))}
      </svg>
    </>
  );
};

export default MapTerrain;
