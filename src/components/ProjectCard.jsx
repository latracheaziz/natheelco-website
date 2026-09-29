import { useState } from 'react';

const DEFAULT_COLOR = '#2E8B9C';

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

const ProjectCard = ({ project, index }) => {
  const [hovered, setHovered] = useState(false);
  const color = project.color || DEFAULT_COLOR;
  const rgb = hexToRgb(color);

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
      <div className="psc-shine" />

      {/* Top accent bar */}
      <div
        className="h-[3px] w-full transform origin-right transition-transform duration-700 ease-out"
        style={{
          background: `linear-gradient(to left, ${color}, ${color}99, #0A1628)`,
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        }}
      />

      <div className="p-8 lg:p-10 preserve-3d">
        {/* Index + Category row */}
        <div className="flex justify-between items-start mb-10">
          <span
            className="psc-category"
            style={hovered ? {
              background: `rgba(${rgb}, 0.1)`,
              color: color,
              padding: '4px 14px',
            } : undefined}
          >
            {project.category}
          </span>
          <span
            className="psc-index"
            style={hovered ? {
              color: `rgba(${rgb}, 0.3)`,
              transform: 'translateY(-4px)',
            } : undefined}
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
            } : undefined}
          >
            <span
              className={`${project.logoSize} font-bold text-center leading-tight whitespace-pre-line font-latin transition-colors duration-500`}
              style={{ color: hovered ? '#ffffff' : undefined }}
            >
              {project.logo}
            </span>
          </div>
        </div>

        {/* Text content */}
        <div className="text-center">
          <h3
            className="text-xl font-heading font-[700] text-primary mb-2 transition-colors duration-400"
            style={hovered ? { color } : undefined}
          >
            {project.nameAr}
          </h3>
          <p className="text-[13px] font-latin font-medium text-text-muted mb-1 tracking-wide">{project.nameEn}</p>
          <p className="text-text-secondary text-sm mt-4 mb-8 leading-relaxed line-clamp-2">{project.shortDesc}</p>

          <div
            className="psc-cta"
            style={hovered ? {
              background: `rgba(${rgb}, 0.1)`,
              color: color,
              padding: '8px 24px',
            } : undefined}
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
