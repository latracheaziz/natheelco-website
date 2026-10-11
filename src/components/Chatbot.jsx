import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QA = {
  "وش هي شركة نثيل؟": "نثيل هي شركة متخصصة في تطوير وتنمية المشاريع والمساهمة في بناء شركات منظّمة وقابلة للنمو المستدام في منطقة حائل.",
  "وش المشاريع اللي تشتغلون عليها؟": "عندنا عدة مشاريع مثل 'أودن فرني' و 'هاجس' و 'غالية'، ونركز على مجالات الأغذية والمشروبات والحلويات الفاخرة.",
  "وين مقركم الرئيسي؟": "مقرنا الأساسي في عروس الشمال حائل، ومنها ننطلق بمشاريعنا وتطلعاتنا.",
  "وش يميز نثيل عن غيرها؟": "في نثيل نركز على جودة المنتج والخدمة، ونبني مشاريعنا على أسس متينة لكسب ثقة السوق، مع الحرص التام على استدامة ونمو هالمشاريع.",
  "هل تقبلون أفكار مشاريع جديدة؟": "أكيد! إحنا دايم نبحث عن الأفكار الواعدة والمبتكرة عشان نطورها ونحولها لواقع، تقدر تتواصل معنا وتشاركنا فكرتك.",
  "هل توظفون كفاءات جديدة؟": "نعم، إحنا دايماً نبحث عن الكفاءات الشابة والمبدعة اللي تشاركنا طموحنا وشغفنا. تقدر تتواصل معنا لمعرفة الفرص المتاحة.",
  "وش رؤيتكم للمستقبل؟": "رؤيتنا هي أننا نبني المستقبل بأصالة الماضي، ونطور مشاريع تحترم هوية حائل وتستفيد من قدرات شبابها وتجمع بين الأصالة والأسلوب العصري.",
  "كيف أقدر أتواصل معكم؟": "تقدر تتواصل معنا عن طريق صفحة 'اتصل بنا' في الموقع، أو ترسل لنا رسالة مباشرة وراح نرد عليك بأقرب وقت."
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'يا هلا والله! حياك في نثيل، كيف أقدر أخدمك؟' }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleQuestionClick = (q) => {
    setMessages(prev => [
      ...prev,
      { type: 'user', text: q },
      { type: 'bot', text: QA[q] }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" dir="rtl">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden flex flex-col"
            style={{ maxHeight: 'calc(100vh - 120px)' }}
          >
            {/* Header */}
            <div className="bg-primary text-white p-4 flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Natheel" className="w-8 h-8 object-contain filter brightness-0 invert" />
                <span className="font-bold text-lg">نثيل</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fa]" style={{ maxHeight: '400px' }}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed shadow-sm ${
                      msg.type === 'user'
                        ? 'bg-accent text-white rounded-tl-sm'
                        : 'bg-white border border-gray-100 text-primary rounded-tr-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Options */}
            <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] z-10">
              <div className="flex flex-col gap-2">
                {Object.keys(QA).map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuestionClick(q)}
                    className="text-right text-[14px] text-accent hover:bg-accent hover:text-white border border-accent/40 rounded-xl px-4 py-2.5 transition-all duration-200 w-full"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex items-center justify-center hover:scale-105 transition-transform duration-200 relative"
      >
        <img src="/logo.png" alt="Chat" className="w-10 h-10 object-contain" />
        {!isOpen && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>
    </div>
  );
};

export default Chatbot;
