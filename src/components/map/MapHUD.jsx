import { motion } from 'framer-motion';
import { LocateFixed, Minus, Plus, RotateCcw } from 'lucide-react';
import TiltCard from '../fx/TiltCard';
import { heroStats } from '../../data/projects';

const ease = [0.16, 1, 0.3, 1];

const filters = [
  { id: 'all', label: 'الكل' },
  { id: 'نشط', label: 'نشط' },
  { id: 'قيد التطوير', label: 'قيد التطوير' },
];

const Pill = ({ active, onClick, children, layoutId, gold = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative shrink-0 px-5 py-2 rounded-full text-[13px] font-semibold transition-colors duration-300 border ${
      active
        ? gold ? 'text-primary-deep border-transparent' : 'text-white border-transparent'
        : 'text-white/60 hover:text-white border-white/10 bg-primary-deep/60 hover:border-white/25'
    }`}
  >
    {active && (
      <motion.span
        layoutId={layoutId}
        className={`absolute inset-0 rounded-full ${
          gold
            ? 'bg-gradient-to-b from-map-gold-light to-map-gold shadow-[0_0_24px_rgba(232,176,74,0.55)]'
            : 'bg-gradient-to-b from-accent-light to-accent shadow-[0_0_24px_rgba(58,168,188,0.55)]'
        }`}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      />
    )}
    <span className="relative z-10 whitespace-nowrap">{children}</span>
  </button>
);

export const TopPills = ({ items, focusedId, onFocus }) => (
  <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 justify-start md:justify-center" dir="rtl">
    {items.map((item) => (
      <Pill
        key={item.id}
        active={focusedId === item.id}
        onClick={() => onFocus(item)}
        layoutId="map-top-pill"
        gold={item.id === 'hq'}
      >
        <span className="text-[12px] font-semibold">{item.nameAr}</span>
      </Pill>
    ))}
  </div>
);

export const FilterPills = ({ filter, setFilter }) => (
  <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 justify-center" dir="rtl">
    {filters.map((f) => (
      <Pill key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)} layoutId="map-filter-pill">
        {f.label}
      </Pill>
    ))}
  </div>
);

export const Toolbar = ({ onRecenter, onZoomIn, onZoomOut, onReset }) => {
  const tools = [
    { icon: LocateFixed, label: 'توسيط', onClick: onRecenter },
    { icon: Plus, label: 'تكبير', onClick: onZoomIn },
    { icon: Minus, label: 'تصغير', onClick: onZoomOut },
    { icon: RotateCcw, label: 'إعادة الضبط', onClick: onReset },
  ];
  return (
    <div className="glass-panel rounded-2xl p-1.5 flex flex-col gap-1">
      {tools.map(({ icon: Icon, label, onClick }) => (
        <motion.button
          key={label}
          type="button"
          onClick={onClick}
          aria-label={label}
          title={label}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-accent-glow hover:bg-white/5 transition-colors"
        >
          <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
        </motion.button>
      ))}
    </div>
  );
};

export const Compass = ({ rotZ }) => {
  return (
    <div className="glass-panel rounded-full w-[92px] h-[92px] p-1.5">
      <motion.svg viewBox="0 0 100 100" className="w-full h-full" style={{ rotate: rotZ }}>
        <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.12)" />
        <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(232,176,74,0.25)" strokeDasharray="2 4" />
        {[0, 90, 180, 270].map((a) => (
          <line key={a} x1="50" y1="8" x2="50" y2="14" stroke="rgba(255,255,255,0.4)" transform={`rotate(${a} 50 50)`} />
        ))}
        <polygon points="50,14 56,50 50,46 44,50" fill="#E8B04A" style={{ filter: 'drop-shadow(0 0 4px #E8B04A)' }} />
        <polygon points="50,86 56,50 50,54 44,50" fill="rgba(255,255,255,0.35)" />
        <circle cx="50" cy="50" r="3" fill="#FFD27A" />
        <text x="50" y="27" textAnchor="middle" fontSize="9" fontWeight="800" fill="#FFD27A">ش</text>
        <text x="50" y="80" textAnchor="middle" fontSize="8" fontWeight="700" fill="rgba(255,255,255,0.5)">ج</text>
        <text x="79" y="53" textAnchor="middle" fontSize="8" fontWeight="700" fill="rgba(255,255,255,0.5)">ق</text>
        <text x="21" y="53" textAnchor="middle" fontSize="8" fontWeight="700" fill="rgba(255,255,255,0.5)">غ</text>
      </motion.svg>
    </div>
  );
};

const toPath = (values, w, h, pad = 6, range) => {
  const [min, max] = range ?? [Math.min(...values), Math.max(...values)];
  const step = (w - pad * 2) / (values.length - 1);
  const pts = values.map((v, i) => [pad + i * step, h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2)]);
  const line = pts.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x} ${y}`;
    const [px, py] = pts[i - 1];
    const cx = (px + x) / 2;
    return `${acc} C ${cx} ${py}, ${cx} ${y}, ${x} ${y}`;
  }, '');
  return { line, area: `${line} L ${pts[pts.length - 1][0]} ${h} L ${pts[0][0]} ${h} Z`, pts };
};

const Panel = ({ title, children, delay = 0, revealed }) => (
  <motion.div
    initial={{ opacity: 0, x: -40, rotateY: 25 }}
    animate={revealed ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: -40, rotateY: 25 }}
    transition={{ duration: 1, delay, ease }}
    style={{ transformPerspective: 900 }}
  >
    <TiltCard max={10} className="glass-panel rounded-2xl p-4 text-right" dir="rtl">
      <p className="text-[11px] font-bold tracking-[0.12em] text-white/80 mb-3 flex items-center justify-between">
        {title}
        <span className="w-1.5 h-1.5 rounded-full bg-accent-glow shadow-[0_0_8px_#5FD4E6] animate-pulse" />
      </p>
      {children}
    </TiltCard>
  </motion.div>
);

export const StatusPanel = ({ projects, revealed, delay }) => {
  let a = 0;
  let d = 0;
  const active = [0];
  const dev = [0];
  projects.forEach((p) => {
    if (p.status === 'نشط') a += 1;
    else d += 1;
    active.push(a);
    dev.push(d);
  });
  const range = [0, Math.max(a, d)];
  const A = toPath(active, 200, 70, 6, range);
  const D = toPath(dev, 200, 70, 6, range);

  return (
    <Panel title="حالة المشاريع" revealed={revealed} delay={delay}>
      <svg viewBox="0 0 200 70" className="w-full h-[70px] overflow-visible">
        {[0, 1, 2].map((i) => (
          <line key={i} x1="0" x2="200" y1={10 + i * 25} y2={10 + i * 25} stroke="rgba(255,255,255,0.06)" />
        ))}
        <motion.path
          d={A.line}
          fill="none"
          stroke="#E8B04A"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: revealed ? 1 : 0 }}
          transition={{ duration: 1.8, delay: delay + 0.3, ease }}
          style={{ filter: 'drop-shadow(0 0 4px rgba(232,176,74,0.8))' }}
        />
        <motion.path
          d={D.line}
          fill="none"
          stroke="#5FD4E6"
          strokeWidth="2"
          strokeDasharray="3 3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: revealed ? 1 : 0 }}
          transition={{ duration: 1.8, delay: delay + 0.5, ease }}
        />
      </svg>
      <div className="flex items-center justify-between mt-2 text-[11px] text-white/60">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-map-gold" /> نشط <b className="font-latin text-white">{a}</b></span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-glow" /> قيد التطوير <b className="font-latin text-white">{d}</b></span>
      </div>
    </Panel>
  );
};

export const GrowthPanel = ({ revealed, delay }) => {
  const sorted = [...heroStats].sort((x, y) => parseInt(x.value.replace(/\D/g, ''), 10) - parseInt(y.value.replace(/\D/g, ''), 10));
  const values = sorted.map((s) => Math.log10(parseInt(s.value.replace(/\D/g, ''), 10) + 1));
  const { line, area, pts } = toPath(values, 200, 80);

  return (
    <Panel title="النمو" revealed={revealed} delay={delay}>
      <svg viewBox="0 0 200 80" className="w-full h-[80px] overflow-visible">
        <defs>
          <linearGradient id="growth-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3AA8BC" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#3AA8BC" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={area}
          fill="url(#growth-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 1.2, delay: delay + 0.8 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke="#5FD4E6"
          strokeWidth="2.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: revealed ? 1 : 0 }}
          transition={{ duration: 1.8, delay: delay + 0.3, ease }}
          style={{ filter: 'drop-shadow(0 0 5px rgba(95,212,230,0.8))' }}
        />
        {pts.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="3"
            fill="#0A1628"
            stroke="#5FD4E6"
            strokeWidth="1.5"
            initial={{ scale: 0 }}
            animate={{ scale: revealed ? 1 : 0 }}
            transition={{ delay: delay + 0.6 + i * 0.2, type: 'spring' }}
          />
        ))}
      </svg>
      <div className="grid grid-cols-4 gap-1 mt-2 text-center">
        {sorted.map((s) => (
          <div key={s.label}>
            <p className="font-latin font-bold text-white text-[11px]">{s.value}</p>
            <p className="text-white/40 text-[8px] leading-tight mt-0.5 line-clamp-2">{s.label}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
};

export const VenturesPanel = ({ projects, revealed, delay, onHover, onSelect, hovered }) => (
  <Panel title="مشاريع مميزة" revealed={revealed} delay={delay}>
    <div className="grid grid-cols-3 gap-2">
      {projects.map((p) => (
        <button
          key={p.id}
          type="button"
          onMouseEnter={() => onHover(p.id)}
          onMouseLeave={() => onHover(null)}
          onClick={() => onSelect(p)}
          className={`group flex flex-col items-center gap-1 rounded-xl py-2 border transition-all duration-300 ${
            hovered === p.id ? 'border-accent-light/60 bg-accent/15' : 'border-white/5 bg-white/[0.03] hover:border-white/20'
          }`}
        >
          <span className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center font-bold text-[8px] leading-none text-white/80 text-center whitespace-pre-line group-hover:border-accent-glow group-hover:text-accent-glow transition-colors">
            {p.nameAr.split(' ')[0]}
          </span>
          <span className="text-[9px] text-white/50 leading-tight">{p.nameAr}</span>
        </button>
      ))}
    </div>
  </Panel>
);
