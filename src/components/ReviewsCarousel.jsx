import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Star, Quote } from 'lucide-react';
import TiltCard from './fx/TiltCard';
import { fetchPublicReviews } from '../api/reviews';

const initialsOf = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('.');

export default function ReviewsCarousel() {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let stop = false;
    const load = () => {
      fetchPublicReviews()
        .then((data) => {
          if (stop) return;
          const next = (data.reviews || []).map((review) => ({
            id: review.id,
            name: review.name,
            role: review.role || 'عميل',
            review: review.comment,
            rating: review.rating,
            initials: initialsOf(review.name),
          }));
          setReviews(next);
          setCurrentIndex((index) => (next.length ? Math.min(index, next.length - 1) : 0));
        })
        .catch(() => {
          if (!stop) setReviews([]);
        })
        .finally(() => {
          if (!stop) setIsLoading(false);
        });
    };
    load();
    const timer = window.setInterval(load, 15000);
    return () => {
      stop = true;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (isHovered || reviews.length < 2) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, reviews.length]);

  const handleNext = () => {
    if (!reviews.length) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    if (!reviews.length) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.8,
      rotateY: dir > 0 ? 45 : -45,
      z: -100
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      z: 0
    },
    exit: (dir) => ({
      zIndex: 0,
      x: dir < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.8,
      rotateY: dir < 0 ? 45 : -45,
      z: -100
    })
  };

  return (
    <div 
      className="w-full h-full relative overflow-hidden bg-[#0A1320] flex flex-col justify-center rounded-[32px] p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(10,22,40,0.5)] border border-white/5 perspective-[2000px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      dir="rtl"
    >
      {/* Subtle Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -right-1/4 w-[400px] h-[400px] bg-primary/20 blur-[100px] rounded-full"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-accent/20 blur-[120px] rounded-full"
        />
      </div>

      <div className="relative z-10 flex flex-col h-full transform-style-3d">
        {/* Header Section */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20, rotateX: -20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          >
            <p className="text-accent text-sm font-bold mb-2 font-heading tracking-wide drop-shadow-[0_0_8px_rgba(58,168,188,0.3)]">
              قالوا عنا
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3 drop-shadow-md">
              آراء شركاء النجاح
            </h2>
            <p className="text-white/70 text-sm max-w-md mx-auto leading-relaxed">
              اكتشف تجارب عملائنا وقصص نجاحهم الملهمة مع فريق نثيل.
            </p>
          </motion.div>
        </div>

        {/* Carousel Content */}
        <div className="flex-1 relative flex items-center justify-center min-h-[340px] perspective-[1500px]">
          {isLoading ? (
            <div role="status" aria-label="جارٍ تحميل الآراء" className="flex flex-col items-center gap-3">
              <span className="w-10 h-10 rounded-full border-2 border-white/15 border-t-accent animate-spin" />
              <span className="text-white/60 text-xs">جارٍ تحميل الآراء...</span>
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-white/70 text-sm text-center">لا توجد آراء بعد!</p>
          ) : (
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 25 },
                opacity: { duration: 0.3 },
                rotateY: { type: "spring", stiffness: 200, damping: 25 },
                z: { duration: 0.4 }
              }}
              className="w-full max-w-2xl mx-auto absolute"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <TiltCard max={15} perspective={1000} hoverScale={1.05} glare={true} className="relative group cursor-pointer w-full">
                {/* Glow effect on hover */}
                <div style={{ transform: 'translateZ(-20px)' }} className="absolute -inset-0.5 bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0 rounded-[28px] blur-md opacity-0 group-hover:opacity-100 transition duration-500"></div>
                
                <div style={{ transform: 'translateZ(30px)' }} className="relative bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 p-8 md:p-10 rounded-[24px] backdrop-blur-2xl transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                  
                  <motion.div 
                    initial={{ rotate: -10, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    style={{ transform: 'translateZ(40px)' }}
                  >
                    <Quote className="absolute top-6 left-6 w-12 h-12 text-white/5 group-hover:text-accent/30 transition-colors duration-500" />
                  </motion.div>

                  {/* Stars */}
                  <div className="flex gap-1.5 mb-6" style={{ transform: 'translateZ(50px)' }}>
                    {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0, y: 20, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                        transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 300 }}
                        className="group-hover:animate-pulse"
                      >
                        <Star className="w-5 h-5 md:w-6 md:h-6 fill-map-gold text-map-gold drop-shadow-[0_0_12px_rgba(232,176,74,0.6)] group-hover:drop-shadow-[0_0_16px_rgba(232,176,74,0.9)] transition-all" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p style={{ transform: 'translateZ(60px)' }} className="text-white/95 text-lg md:text-xl font-medium leading-relaxed mb-8 drop-shadow-sm">
                    "{reviews[currentIndex].review}"
                  </p>

                  {/* Client Info */}
                  <div style={{ transform: 'translateZ(40px)' }} className="flex items-center gap-4 border-t border-white/10 pt-6">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white font-bold text-sm shadow-xl ring-2 ring-white/10 group-hover:ring-accent transition-all duration-300"
                    >
                      {reviews[currentIndex].initials}
                    </motion.div>
                    <div>
                      <h4 className="text-white font-bold flex items-center gap-2 text-lg drop-shadow-sm">
                        {reviews[currentIndex].name}
                      </h4>
                      <p className="text-accent/80 text-xs mt-1 font-medium">
                        {reviews[currentIndex].role}
                      </p>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </AnimatePresence>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-8 pt-4">
          <div className="flex gap-2">
            <button 
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                }}
                className={`transition-all duration-500 rounded-full ${
                  i === currentIndex 
                    ? 'w-8 h-2 bg-accent shadow-[0_0_10px_rgba(58,168,188,0.5)]' 
                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
