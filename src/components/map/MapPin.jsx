import { motion, useTransform } from 'framer-motion';
import { Briefcase, CakeSlice, Coffee, Croissant, Landmark, Palette, Store } from 'lucide-react';

const icons = {
  croissant: Croissant,
  coffee: Coffee,
  store: Store,
  briefcase: Briefcase,
  palette: Palette,
  cake: CakeSlice,
  landmark: Landmark,
};

const tones = {
  gold: {
    color: '#E8B04A',
    pin: 'from-[#FFE1A0] via-[#E8B04A] to-[#9A6A1C]',
    glow: 'shadow-[0_0_40px_8px_rgba(232,176,74,0.55)]',
    text: 'text-map-gold-light',
  },
  teal: {
    color: '#3AA8BC',
    pin: 'from-[#9FE6F2] via-[#3AA8BC] to-[#1B3A5C]',
    glow: 'shadow-[0_0_36px_6px_rgba(58,168,188,0.55)]',
    text: 'text-accent-glow',
  },
  glow: {
    color: '#5FD4E6',
    pin: 'from-[#E6FBFF] via-[#5FD4E6] to-[#2E8B9C]',
    glow: 'shadow-[0_0_36px_6px_rgba(95,212,230,0.5)]',
    text: 'text-accent-glow',
  },
};

const toneFor = (item) => (item.id === 'hq' ? 'gold' : item.status === 'نشط' ? 'teal' : 'glow');

// Flat pulse rings drawn on the ground plane under the pin.
export const PinGround = ({ item, dimmed, big }) => {
  const tone = tones[toneFor(item)];
  return (
    <div
      className="absolute pointer-events-none transition-opacity duration-500 max-md:scale-[0.6]"
      style={{ left: `${item.pos.x}%`, top: `${item.pos.y}%`, color: tone.color, opacity: dimmed ? 0.15 : 1 }}
    >
      <span className="pin-pulse" style={big ? { width: 80, height: 80, margin: '-40px 0 0 -40px' } : undefined} />
      <span className="pin-pulse delay" style={big ? { width: 80, height: 80, margin: '-40px 0 0 -40px' } : undefined} />
      <span
        className="absolute left-0 top-0 w-24 h-24 -ml-12 -mt-12 rounded-full"
        style={{ background: `radial-gradient(circle, ${tone.color}55, transparent 65%)` }}
      />
    </div>
  );
};

const MapPin = ({
  item,
  index,
  tilt,
  rotZ,
  revealed,
  dimmed,
  focused,
  hovered,
  onHover,
  onSelect,
  showLabel,
}) => {
  const toneKey = toneFor(item);
  const tone = tones[toneKey];
  const Icon = icons[item.icon] ?? Landmark;
  const isHq = item.id === 'hq';
  const isHot = hovered || focused;

  const transform = useTransform(
    [tilt, rotZ],
    ([t, r]) => `translate(-50%, -100%) rotateZ(${-r}deg) rotateX(${-t}deg)`
  );

  return (
    <motion.div
      className="absolute preserve-3d max-md:scale-[0.78]"
      style={{ left: `${item.pos.x}%`, top: `${item.pos.y}%`, transform, transformOrigin: '50% 100%', zIndex: isHot ? 30 : 10 }}
    >
      <motion.div
        className="preserve-3d flex flex-col items-center"
        initial={{ opacity: 0, y: -160 }}
        animate={
          revealed
            ? { opacity: dimmed ? 0.25 : 1, y: isHot ? -14 : 0, scale: dimmed ? 0.8 : 1 }
            : { opacity: 0, y: -160 }
        }
        transition={{ type: 'spring', stiffness: 170, damping: 14, delay: revealed && !isHot ? 1.2 + index * 0.12 : 0 }}
      >
        {/* Label */}
        {showLabel && (
          <motion.div
            className="map-label absolute bottom-full mb-3 left-1/2 rounded-xl px-3 py-2 whitespace-nowrap text-right pointer-events-none"
            dir="rtl"
            initial={false}
            animate={{ x: isHq ? '-50%' : '-10%', scale: isHot ? 1.08 : 1, opacity: dimmed ? 0 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <p className={`font-latin font-extrabold tracking-[0.12em] uppercase leading-tight ${isHq ? 'text-[13px]' : 'text-[11px]'} ${tone.text}`}>
              {item.nameEn}
            </p>
            <p className="text-white/80 text-[11px] font-bold leading-tight mt-0.5">{item.nameAr}</p>
            <motion.p
              className="text-white/45 text-[10px] leading-tight overflow-hidden"
              initial={false}
              animate={{ height: isHot || isHq ? 'auto' : 0, opacity: isHot || isHq ? 1 : 0, marginTop: isHot || isHq ? 2 : 0 }}
            >
              {item.category}
            </motion.p>
          </motion.div>
        )}

        {/* Pin head */}
        <button
          type="button"
          onClick={() => onSelect(item)}
          onMouseEnter={() => onHover(item.id)}
          onMouseLeave={() => onHover(null)}
          onFocus={() => onHover(item.id)}
          onBlur={() => onHover(null)}
          aria-label={`${item.nameAr} — ${item.nameEn}`}
          className="relative block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-glow rounded-full cursor-pointer"
        >
          <span
            className={`relative flex items-center justify-center rounded-full rounded-br-none rotate-45 bg-gradient-to-br ${tone.pin} ${tone.glow} border border-white/40 transition-transform duration-500 ${
              isHq ? 'w-16 h-16' : 'w-11 h-11'
            } ${isHot ? 'scale-110' : ''}`}
          >
            <span className="absolute inset-[3px] rounded-full rounded-br-none bg-gradient-to-br from-white/35 to-transparent" />
            <span className="-rotate-45 relative flex items-center justify-center rounded-full bg-primary-deep/85 border border-white/20 w-[70%] h-[70%]">
              {isHq ? (
                <span className="font-latin font-black text-lg text-map-gold-light drop-shadow-[0_0_6px_rgba(232,176,74,0.9)]">N</span>
              ) : (
                <Icon className={`w-4 h-4 ${tone.text}`} strokeWidth={2.2} />
              )}
            </span>
          </span>
        </button>

        {/* Beam to ground */}
        <span
          className="block w-[2px] rounded-full"
          style={{ height: isHq ? 34 : 24, background: `linear-gradient(to bottom, ${tone.color}, transparent)` }}
        />
      </motion.div>
    </motion.div>
  );
};

export default MapPin;
