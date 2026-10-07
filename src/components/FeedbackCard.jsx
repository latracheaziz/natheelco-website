import { useState, useEffect } from 'react';
import { Star, ArrowLeft, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { submitReview } from '../api/reviews';

const triggerFireworks = () => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults, particleCount,
      origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 },
      colors: ['#2E8B9C', '#E8B04A', '#FFFFFF', '#0A1320']
    });
    confetti({
      ...defaults, particleCount,
      origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 },
      colors: ['#2E8B9C', '#E8B04A', '#FFFFFF', '#0A1320']
    });
  }, 250);
};

export default function FeedbackCard() {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [opinion, setOpinion] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'success') {
      triggerFireworks();
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || name.trim().length < 2 || opinion.trim().length < 2) return;
    setStatus('submitting');
    setError('');
    try {
      await submitReview({ name: name.trim(), comment: opinion.trim(), rating });
      setStatus('success');
    } catch (submitError) {
      setStatus('idle');
      setError(submitError.message || 'تعذر إرسال الرأي. حاول مرة أخرى.');
    }
  };

  return (
    <div className="w-full h-full mx-auto rounded-[32px] overflow-hidden flex flex-col md:flex-row shadow-[0_20px_60px_-15px_rgba(10,22,40,0.15)] bg-[#FDFDFD] border border-border-light relative z-20" dir="rtl">
      
      {/* Dark Side (Right in RTL layout) */}
      <div className="md:w-[40%] bg-primary relative p-10 md:p-12 text-white flex flex-col justify-between overflow-hidden min-h-[400px]">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen" style={{ backgroundImage: "url('/roots-hero.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-primary via-primary/60 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div></div>

          <div className="mt-16 mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold leading-tight mb-4 text-white">
              رأيك يساعدنا على التطور.
            </h2>
            <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-xs font-medium">
              شاركنا تجربتك وساعدنا على بناء فرص أفضل معاً.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-latin text-white/50 pt-2 relative">
             <span className="w-8 h-[1px] bg-white/20"></span>
             Natheel Co.
          </div>
        </div>
      </div>

      {/* Light Side (Left in RTL layout) */}
      <div className="md:w-[60%] p-10 md:p-12 relative z-10 flex flex-col justify-center min-h-[450px]">
        <div className="w-full max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-8">
                  <p className="text-[10px] font-bold tracking-[0.15em] text-text-muted uppercase mb-3 font-latin">
                    آراء العملاء
                  </p>
                  <h3 className="text-3xl font-heading font-bold text-primary mb-3">
                    شاركنا رأيك
                  </h3>
                  <p className="text-text-secondary text-sm font-medium">
                    رأيك يهمنا. يرجى أخذ لحظة لتقييم تجربتك وترك رسالة لنا.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="reviewer-name" className="block text-sm font-bold text-primary mb-3 font-heading">الاسم</label>
                    <input
                      id="reviewer-name"
                      value={name}
                      onChange={(e) => setName(e.target.value.slice(0, 80))}
                      placeholder="اسمك"
                      required
                      minLength={2}
                      className="w-full bg-[#FAFAFA] border border-border-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-primary placeholder:text-text-muted"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary mb-3 font-heading">قيّم تجربتك</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="focus:outline-none transition-transform hover:scale-110"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                        >
                          <Star 
                            className={`w-7 h-7 md:w-8 md:h-8 transition-colors duration-300 ${
                              (hoverRating || rating) >= star 
                                ? "fill-map-gold text-map-gold drop-shadow-[0_2px_8px_rgba(232,176,74,0.4)]" 
                                : "text-border fill-transparent"
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="opinion" className="block text-sm font-bold text-primary mb-3 font-heading">رأيك</label>
                    <div className="relative">
                      <textarea
                        id="opinion"
                        value={opinion}
                        onChange={(e) => setOpinion(e.target.value.slice(0, 500))}
                        placeholder="أخبرنا عن تجربتك..."
                        rows="3"
                        className="w-full bg-[#FAFAFA] border border-border-light rounded-xl p-4 pb-8 text-sm resize-none focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-shadow text-primary placeholder:text-text-muted"
                      ></textarea>
                      <div className="absolute bottom-3 left-4 text-[11px] font-medium text-text-muted font-latin">
                        {opinion.length}/500
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!rating || name.trim().length < 2 || opinion.trim().length < 2}
                    className="group mt-2 flex items-center gap-3 bg-[#1B2A2F] hover:bg-primary text-white text-sm font-medium px-8 py-3.5 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    إرسال الرأي
                    <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-2 group-hover:scale-110" />
                  </button>
                  {error && <p className="text-sm text-rose-600">{error}</p>}
                </form>
              </motion.div>
            )}

            {status === 'submitting' && (
              <motion.div
                key="animating"
                className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
              >
                <motion.div
                  initial={{ x: 0, y: 50, opacity: 0, scale: 0.5, rotate: 0 }}
                  animate={{ 
                    x: [0, 80, -150, -600],
                    y: [50, 80, -100, -400],
                    opacity: [0, 1, 1, 0],
                    scale: [0.5, 1, 1.4, 0.4],
                    rotate: [0, 25, -20, -45]
                  }}
                  transition={{ 
                    duration: 2.2, 
                    times: [0, 0.3, 0.6, 1],
                    ease: "easeInOut" 
                  }}
                >
                  <Send className="w-24 h-24 text-accent -scale-x-100 drop-shadow-[0_10px_20px_rgba(46,139,156,0.4)]" strokeWidth={1} />
                </motion.div>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center justify-center text-center py-12 absolute inset-0"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6"
                >
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-heading font-bold text-primary mb-2">شكرًا لك!</h3>
                <p className="text-text-secondary text-sm max-w-sm">تم إرسال رأيك بنجاح، نقدر وقتك ومساهمتك في تطوير خدماتنا.</p>
                <button
                  type="button"
                  onClick={() => {
                    setStatus('idle');
                    setRating(0);
                    setOpinion('');
                    setName('');
                  }}
                  className="mt-6 text-accent text-sm font-medium hover:underline underline-offset-4"
                >
                  إرسال تقييم آخر
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
