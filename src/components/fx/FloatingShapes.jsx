import { motion, useScroll, useTransform } from 'framer-motion';

const layouts = [
  { cube: 'top-[22%] left-[8%]', ring: 'bottom-[12%] left-[30%]', mini: 'top-[18%] left-[42%]', mark: 'top-[38%] left-[17%]' },
  { cube: 'bottom-[18%] left-[12%]', ring: 'top-[16%] left-[24%]', mini: 'bottom-[30%] left-[45%]', mark: 'top-[28%] left-[8%]' },
  { cube: 'top-[30%] left-[18%]', ring: 'top-[10%] left-[4%]', mini: 'bottom-[16%] left-[38%]', mark: 'top-[42%] left-[4%]' },
  { cube: 'bottom-[22%] left-[6%]', ring: 'top-[20%] left-[34%]', mini: 'top-[14%] left-[14%]' },
];

const Cube = ({ size }) => (
  <div className="shape-cube" style={{ '--s': `${size}px` }}>
    {Array.from({ length: 6 }).map((_, i) => <span key={i} />)}
  </div>
);

const Ring = ({ size }) => (
  <div className="shape-ring" style={{ '--s': `${size}px` }}>
    {Array.from({ length: 4 }).map((_, i) => <span key={i} />)}
  </div>
);

const HeritageMark = ({ className = '' }) => (
  <svg className={`heritage-mark ${className}`} viewBox="0 0 240 270" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="heritage-glass" x1="28" y1="30" x2="207" y2="244" gradientUnits="userSpaceOnUse">
        <stop stopColor="#B8F7FF" />
        <stop offset="0.48" stopColor="#5FD4E6" />
        <stop offset="1" stopColor="#27899F" />
      </linearGradient>
      <linearGradient id="heritage-fill" x1="70" y1="34" x2="168" y2="185" gradientUnits="userSpaceOnUse">
        <stop stopColor="#5FD4E6" stopOpacity="0.28" />
        <stop offset="1" stopColor="#3AA8BC" stopOpacity="0.04" />
      </linearGradient>
    </defs>

    {/* Palm crown and trunk */}
    <g stroke="url(#heritage-glass)" strokeLinecap="round" strokeLinejoin="round">
      <path d="M120 14C116 35 119 56 120 82" strokeWidth="5" strokeOpacity=".72" />
      <path d="M120 57C99 47 84 29 55 31C72 38 81 50 88 66C63 51 40 51 22 66C44 63 61 75 75 91C52 84 35 94 27 112C49 102 70 106 91 122" strokeWidth="8" strokeOpacity=".82" />
      <path d="M120 57C141 47 156 29 185 31C168 38 159 50 152 66C177 51 200 51 218 66C196 63 179 75 165 91C188 84 205 94 213 112C191 102 170 106 149 122" strokeWidth="8" strokeOpacity=".82" />
      <path d="M105 74C85 72 72 85 69 108C82 97 94 94 108 96M135 74C155 72 168 85 171 108C158 97 146 94 132 96" strokeWidth="7" strokeOpacity=".62" />
      <path d="M108 77C110 111 109 149 112 183C115 190 125 190 128 183C131 149 130 111 132 77C125 83 115 83 108 77Z" fill="url(#heritage-fill)" strokeWidth="3" strokeOpacity=".86" />
      <path d="M111 181L106 190L134 190L129 181" fill="url(#heritage-fill)" strokeWidth="3" strokeOpacity=".82" />

      {/* Crossed swords */}
      <path d="M116 220C89 202 53 192 18 194L15 199C54 201 87 216 112 236L117 231" fill="url(#heritage-fill)" strokeWidth="3.5" strokeOpacity=".9" />
      <path d="M124 220C151 202 187 192 222 194L225 199C186 201 153 216 128 236L123 231" fill="url(#heritage-fill)" strokeWidth="3.5" strokeOpacity=".9" />
      <path d="M113 229L81 253C75 258 68 259 61 255L50 249L55 244L66 249L110 222M127 229L159 253C165 258 172 259 179 255L190 249L185 244L174 249L130 222" strokeWidth="4" strokeOpacity=".8" />
      <path d="M56 242C50 235 43 235 39 241C35 247 41 254 50 251M184 242C190 235 197 235 201 241C205 247 199 254 190 251" strokeWidth="3.5" strokeOpacity=".78" />
      <path d="M116 218L124 226M124 218L116 226" strokeWidth="2" strokeOpacity=".95" />
    </g>
    <path d="M120 14C116 35 119 56 120 82M22 66C44 63 61 75 75 91M218 66C196 63 179 75 165 91M15 199C54 201 87 216 112 236M225 199C186 201 153 216 128 236" stroke="#D5FBFF" strokeWidth="1.2" strokeLinecap="round" opacity=".65" />
  </svg>
);

const FloatingShapes = ({ variant = 0, showHeritageMark = false, heritageMarkClassName = '' }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, 120]);
  const y2 = useTransform(scrollY, [0, 600], [0, -80]);
  const l = layouts[variant % layouts.length];

  return (
    <div className="absolute inset-0 pointer-events-none hidden md:block" aria-hidden="true" style={{ perspective: 900 }}>
      {showHeritageMark && l.mark && (
        <motion.div className={`absolute ${l.mark}`} style={{ y: y1 }}>
          <div className="float-y" style={{ animationDelay: '-4s' }}><HeritageMark className={heritageMarkClassName} /></div>
        </motion.div>
      )}
    </div>
  );
};

export default FloatingShapes;
