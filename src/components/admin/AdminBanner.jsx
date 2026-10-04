import React, { useEffect, useRef } from 'react';

/* ─── Animated Canvas Particles ─────────────────────────────────────── */
const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Small glowing particles
    const particles = Array.from({ length: 38 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.6 + 0.2,
      alphaDir: Math.random() > 0.5 ? 1 : -1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha += p.alphaDir * 0.005;
        if (p.alpha >= 0.8 || p.alpha <= 0.1) p.alphaDir *= -1;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0, `rgba(125,211,252,${p.alpha})`);
        grad.addColorStop(1, 'rgba(125,211,252,0)');
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

/* ─── Banner Component ───────────────────────────────────────────────── */
export const AdminBanner = () => {
  return (
    <div
      dir="ltr"
      className="relative overflow-hidden rounded-2xl min-h-[160px] flex items-center"
      style={{
        background: 'linear-gradient(125deg, #0A1628 0%, #0C2340 30%, #0E3A6E 58%, #0369A1 80%, #0EA5E9 100%)',
        boxShadow: '0 8px 40px -8px rgba(3,105,161,0.55), 0 2px 8px rgba(0,0,0,0.25)',
      }}
    >
      {/* ── Animated gradient orbs ── */}
      <div
        className="absolute -top-16 -right-16 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(14,165,233,0.30) 0%, transparent 70%)',
          animation: 'orbFloat1 7s ease-in-out infinite',
        }}
      />
      <div
        className="absolute -bottom-20 left-10 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 65%)',
          animation: 'orbFloat2 9s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-1/2 left-1/3 -translate-y-1/2 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(125,211,252,0.10) 0%, transparent 60%)',
          animation: 'orbFloat3 11s ease-in-out infinite',
        }}
      />

      {/* ── Dot grid overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #7DD3FC 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── Shimmer sweep line ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(105deg, transparent 40%, rgba(125,211,252,0.08) 50%, transparent 60%)',
          animation: 'shimmerSweep 4s linear infinite',
          backgroundSize: '200% 100%',
        }}
      />

      {/* ── Canvas particles ── */}
      <ParticleCanvas />

      {/* ── Top shimmer line ── */}
      <div
        className="absolute top-0 inset-x-0 h-[1.5px] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, #38BDF8, #7DD3FC, #38BDF8, transparent)',
          opacity: 0.7,
        }}
      />

      {/* ── Layout: image LEFT | text RIGHT (dir=ltr so right = physical right) ── */}
      <div className="relative z-10 w-full flex flex-row items-center gap-6 p-6 sm:p-8">

        {/* Physical LEFT — decorative architecture image */}
        <div className="hidden md:block relative w-48 lg:w-64 h-32 lg:h-36 flex-shrink-0 rounded-xl overflow-hidden opacity-40">
          <img
            src="/pic1.jpeg"
            alt="Natheel Architecture"
            className="w-full h-full object-cover mix-blend-luminosity"
            onError={(e) => { e.currentTarget.src = '/office.jpg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C2340]/60 to-transparent" />
          <div className="absolute inset-0 rounded-xl ring-1 ring-[#38BDF8]/20" />
        </div>

        {/* Physical RIGHT — ml-auto pushes to the right in LTR, dir=rtl keeps Arabic text correct */}
        <div
          dir="rtl"
          className="flex flex-col items-end text-right"
          style={{ marginLeft: 'auto' }}
        >
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
            <span className="text-[11px] font-bold text-[#7DD3FC] tracking-widest uppercase">
              Natheel Executive Suite
            </span>
          </div>

          <h1
            className="font-heading font-extrabold text-xl sm:text-2xl md:text-3xl text-white leading-tight tracking-tight"
            style={{ textShadow: '0 2px 20px rgba(14,165,233,0.4)' }}
          >
            مرحباً بك في لوحة تحكم نثيل
          </h1>

          <p className="text-xs sm:text-sm text-[#BAE6FD] mt-2.5 font-medium leading-relaxed max-w-lg">
            تحكم كامل في إحصائيات الأداء، بث المنشورات المباشرة إلى{' '}
            <span className="text-white font-bold">7 شبكات تواصل اجتماعي</span>،
            واعتماد أو رفض تقييمات العملاء.
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-5 mt-4 flex-wrap justify-end">
            {[
              { label: 'منصة متصلة', value: '7' },
              { label: 'منشور مباشر', value: '3' },
              { label: 'رأي معلق',    value: '2' },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-2">
                {i !== 0 && <span className="w-px h-6 bg-[#38BDF8]/25 mx-1" />}
                <div className="text-right">
                  <div
                    className="text-lg sm:text-xl font-black text-white leading-none"
                    style={{ textShadow: '0 0 14px rgba(56,189,248,0.8)' }}
                  >
                    {s.value}
                  </div>
                  <div className="text-[11px] text-[#7DD3FC] font-medium mt-0.5">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Keyframe styles injected via <style> ── */}
      <style>{`
        @keyframes orbFloat1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-18px, 22px) scale(1.12); }
        }
        @keyframes orbFloat2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(22px, -16px) scale(1.1); }
        }
        @keyframes orbFloat3 {
          0%,100% { transform: translate(-50%,-50%) scale(1); }
          50%      { transform: translate(-50%,-50%) scale(1.25); }
        }
        @keyframes shimmerSweep {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};
