import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';

const ADMIN_EMAIL = 'adminnatheelco@gmail.com';
const ADMIN_PASSWORD = 'ir123456';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email.trim().toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      return;
    }

    setError('');
    setIsAuthenticating(true);
    window.setTimeout(onLogin, 1400);
  };

  return (
    <main dir="rtl" className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#071321] px-5 py-12 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_15%_85%,rgba(46,139,156,0.24),transparent_42%),radial-gradient(ellipse_at_85%_15%,rgba(27,58,92,0.5),transparent_45%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-[#5FD4E6]/70 to-transparent" />

      <motion.section
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px]"
      >
        <div className="mb-9 flex flex-col items-center text-center">
          <div className="mb-7 flex w-[min(100%,300px)] items-center justify-center rounded-xl bg-white px-5 py-3 shadow-[0_12px_36px_-14px_rgba(95,212,230,0.65)] ring-1 ring-white/40">
            <img src="/logo.png" alt="نثيل Natheel" className="block h-auto w-full object-contain" />
          </div>
          <span className="mb-3 text-[11px] font-bold tracking-[0.18em] text-[#83D8E5]">بوابة نثيل الداخلية</span>
          <h1 className="text-3xl font-bold text-white">مرحباً بعودتك</h1>
          <p className="mt-3 text-sm leading-7 text-white/60">سجّل الدخول للمتابعة إلى لوحة الإدارة</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[5px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_32px_90px_-35px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:p-8">
          <label htmlFor="admin-email" className="mb-2 block text-sm font-semibold text-white/85">البريد الإلكتروني</label>
          <div className="mb-5 flex h-12 items-center gap-3 border border-white/15 bg-[#071321]/65 px-3.5 transition-colors focus-within:border-[#5FD4E6]/70">
            <Mail aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-[#83D8E5]" />
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => { setEmail(event.target.value); setError(''); }}
              disabled={isAuthenticating}
              placeholder="name@natheelco.com"
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            />
          </div>

          <label htmlFor="admin-password" className="mb-2 block text-sm font-semibold text-white/85">كلمة المرور</label>
          <div className="flex h-12 items-center gap-3 border border-white/15 bg-[#071321]/65 px-3.5 transition-colors focus-within:border-[#5FD4E6]/70">
            <LockKeyhole aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-[#83D8E5]" />
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => { setPassword(event.target.value); setError(''); }}
              disabled={isAuthenticating}
              placeholder="أدخل كلمة المرور"
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              disabled={isAuthenticating}
              aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              className="flex h-8 w-8 shrink-0 items-center justify-center text-white/50 transition-colors hover:text-white"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} role="alert" className="mt-3 overflow-hidden text-sm text-rose-300">
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button type="submit" disabled={isAuthenticating} className="mt-7 flex h-12 w-full items-center justify-center gap-2 bg-[#2E8B9C] text-sm font-bold text-white transition-colors hover:bg-[#3AA8BC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5FD4E6] disabled:cursor-wait disabled:opacity-65">
            <span>تسجيل الدخول</span>
            <ArrowLeft aria-hidden="true" size={17} />
          </button>
        </form>

        <a href="/" className="mx-auto mt-7 flex w-fit items-center gap-2 text-sm text-white/55 transition-colors hover:text-white">
          <ArrowLeft aria-hidden="true" size={15} />
          العودة إلى الموقع
        </a>
      </motion.section>

      <AnimatePresence>
        {isAuthenticating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#071321]/95 px-6 text-center backdrop-blur-xl"
            role="status"
            aria-live="polite"
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-7 flex h-24 w-24 items-center justify-center">
                <motion.span
                  animate={{ scale: [1, 1.45], opacity: [0.45, 0] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full border border-[#5FD4E6]"
                />
                <motion.span
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.1 }}
                  className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#2E8B9C] text-white shadow-[0_0_42px_rgba(95,212,230,0.5)]"
                >
                  <Check className="h-8 w-8" strokeWidth={3} />
                </motion.span>
              </div>
              <h2 className="text-2xl font-bold text-white">تم تسجيل الدخول بنجاح</h2>
              <p className="mt-3 text-sm text-white/65">جارٍ فتح لوحة الإدارة</p>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.25, ease: 'linear' }}
                className="mt-7 h-0.5 w-48 origin-right bg-gradient-to-l from-[#5FD4E6] to-[#2E8B9C]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}