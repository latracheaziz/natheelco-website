import { useState } from 'react';

const DEFAULT_COLOR = '#2E8B9C';
const INK = [10, 22, 40];

const hexToRgbArray = (hex) => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

// Pale brand colors (e.g. peach) disappear on light photos, so text uses a version pulled toward the ink color.
const deepen = ([r, g, b], amount) =>
  `rgb(${[r, g, b].map((c, i) => Math.round(c + (INK[i] - c) * amount)).join(', ')})`;

const luminance = ([r, g, b]) => (0.299 * r + 0.587 * g + 0.114 * b) / 255;

const ProjectCard = ({ project, index }) => {
  const [hovered, setHovered] = useState(false);
  const color = project.color || DEFAULT_COLOR;
  const rgbArr = hexToRgbArray(color);
  const rgb = rgbArr.join(', ');
  const ink = deepen(rgbArr, luminance(rgbArr) > 0.6 ? 0.55 : 0.2);
  const hasCover = Boolean(project.cover);

  return (
    <div
      className="psc-card-inner"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderColor: hovered ? `rgba(${rgb}, 0.45)` : undefined,
        boxShadow: hovered
          ? `0 40px 80px -15px rgba(10,22,40,0.3), 0 0 0 1px rgba(${rgb},0.18), 0 0 60px -10px rgba(${rgb},0.4)`
          : undefined,
        transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
      }}
    >
      {hasCover && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <img
            src={project.cover}
            alt=""
            className="h-full w-full scale-110 object-cover transition-transform duration-700"
            style={{ filter: 'blur(2px) saturate(1.15)', transform: hovered ? 'scale(1.16)' : undefined }}
          />
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: `linear-gradient(to bottom, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.35) 30%, rgba(255,255,255,0.78) 58%, rgba(255,255,255,0.92) 100%)`,
              opacity: hovered ? 0.9 : 1,
            }}
          />
          <div
            className="absolute inset-0 mix-blend-multiply transition-opacity duration-500"
            style={{ background: `linear-gradient(to top, rgba(${rgb},0.22), transparent 55%)`, opacity: hovered ? 1 : 0.6 }}
          />
        </div>
      )}

      <div className="psc-shine" />

      {/* Top accent bar */}
      <div
        className="relative z-10 h-[3px] w-full transform origin-right transition-transform duration-700 ease-out"
        style={{
          background: `linear-gradient(to left, ${color}, ${color}99, #0A1628)`,
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        }}
      />

      <div
        className="relative z-10 p-8 lg:p-10 preserve-3d"
        style={hasCover ? { textShadow: '0 1px 2px rgba(255,255,255,0.85)' } : undefined}
      >
        {/* Index + Category row */}
        <div className="flex justify-between items-start mb-10">
          <span
            className="psc-category"
            style={
              hasCover
                ? {
                    background: hovered ? `rgba(${rgb}, 0.9)` : 'rgba(255,255,255,0.82)',
                    color: hovered ? (luminance(rgbArr) > 0.6 ? '#0A1628' : '#ffffff') : '#0A1628',
                    padding: '5px 14px',
                    backdropFilter: 'blur(8px)',
                    textShadow: 'none',
                    boxShadow: '0 4px 14px -6px rgba(10,22,40,0.35)',
                  }
                : hovered
                  ? { background: `rgba(${rgb}, 0.1)`, color, padding: '4px 14px' }
                  : undefined
            }
          >
            {project.category}
          </span>
          <span
            className="psc-index"
            style={
              hasCover
                ? {
                    color: hovered ? `rgba(${rgb}, 0.95)` : 'rgba(255,255,255,0.92)',
                    textShadow: '0 2px 12px rgba(10,22,40,0.45)',
                    transform: hovered ? 'translateY(-4px)' : undefined,
                  }
                : hovered
                  ? { color: `rgba(${rgb}, 0.3)`, transform: 'translateY(-4px)' }
                  : undefined
            }
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Logo circle */}
        <div className="flex justify-center mb-8 preserve-3d">
          <div
            className="psc-logo-ring"
            style={hovered ? {
              borderColor: 'transparent',
              background: `linear-gradient(135deg, ${color}, ${color}bb)`,
              transform: 'scale(1.12) translateZ(60px)',
              boxShadow: `0 15px 40px -5px rgba(${rgb},0.55), 0 0 0 6px rgba(${rgb},0.15)`,
            } : hasCover ? { boxShadow: '0 12px 30px -10px rgba(10,22,40,0.45)', borderColor: 'rgba(255,255,255,0.9)' } : undefined}
          >
            <span
              className={`${project.logoSize} font-bold text-center leading-tight whitespace-pre-line font-latin transition-colors duration-500`}
              style={{
                color: hovered ? (luminance(rgbArr) > 0.6 ? '#0A1628' : '#ffffff') : undefined,
                textShadow: 'none',
              }}
            >
              {project.logo}
            </span>
          </div>
        </div>

        {/* Text content */}
        <div className="text-center">
          <h3
            className="text-xl font-heading font-[700] text-primary mb-2 transition-colors duration-400"
            style={hovered ? { color: hasCover ? ink : color } : undefined}
          >
            {project.nameAr}
          </h3>
          <p className={`text-[13px] font-latin font-semibold mb-1 tracking-wide ${hasCover ? 'text-primary/65' : 'text-text-muted'}`}>{project.nameEn}</p>
          <p className={`text-sm mt-4 mb-8 leading-relaxed line-clamp-2 ${hasCover ? 'text-primary/80 font-medium' : 'text-text-secondary'}`}>{project.shortDesc}</p>

          <div
            className="psc-cta"
            style={
              hovered
                ? { background: `rgba(${rgb}, ${hasCover ? 0.9 : 0.1})`, color: hasCover ? (luminance(rgbArr) > 0.6 ? '#0A1628' : '#ffffff') : color, padding: '8px 24px', textShadow: 'none' }
                : hasCover
                  ? { color: '#0A1628' }
                  : undefined
            }
          >
            <span>اعرف أكثر</span>
            <svg
              className="w-4 h-4 rotate-180 transition-transform duration-400"
              style={{ transform: hovered ? 'rotate(180deg) translateX(-6px)' : 'rotate(180deg)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
