import React from 'react';
import { Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const ClientOpinionCard = ({ opinion, onAccept, onDecline }) => {
  const isPending = opinion.status === 'pending';
  const isAccepted = opinion.status === 'accepted';
  const isDeclined = opinion.status === 'declined';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
    >
      <div>
        {/* Top Header Row: Client Info + Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          
          {/* Client Details (Right side in RTL) */}
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-[#E2E8F0] bg-[#F8FAFC] text-sm font-bold text-[#1D6FD9]">
              {(opinion.name || 'ع').trim().charAt(0)}
            </div>
            <div className="text-right">
              <h4 className="font-heading font-bold text-sm text-[#0F172A] leading-tight">
                {opinion.name}
              </h4>
              <div className="text-[11px] text-[#64748B] mt-1 space-y-0.5 leading-tight">
                <p>{opinion.role}{opinion.city ? ` | ${opinion.city}` : ''}</p>
                {opinion.project && (
                  <p className="font-medium text-[#334155]">{opinion.project}</p>
                )}
                <p className="flex items-center gap-1 text-[10px] text-[#94A3B8]">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{opinion.date}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Status Badge (Left side in RTL) */}
          <div>
            {isPending && (
              <span className="px-3 py-1 rounded-lg bg-[#FEF3C7] text-[#D97706] text-[11px] font-bold inline-block">
                بانتظار القرار
              </span>
            )}
            {isAccepted && (
              <span className="px-3 py-1 rounded-lg bg-[#D1FAE5] text-[#059669] text-[11px] font-bold inline-block">
                مقبول ومعتمد
              </span>
            )}
            {isDeclined && (
              <span className="px-3 py-1 rounded-lg bg-[#FEE2E2] text-[#DC2626] text-[11px] font-bold inline-block">
                مرفوض
              </span>
            )}
          </div>
        </div>

        {/* Stars Rating Row */}
        <div className="flex items-center justify-end gap-1.5 my-2">
          <span className="text-xs font-mono font-bold text-[#334155]">
            ({opinion.rating}.0 / 5)
          </span>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-3.5 h-3.5 ${
                  s <= opinion.rating
                    ? 'fill-[#F59E0B] text-[#F59E0B]'
                    : 'text-[#CBD5E1]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Client Quote Comment Box */}
        <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl p-3.5 my-3 text-xs text-[#334155] leading-relaxed relative text-right">
          <span className="text-[#94A3B8] font-serif text-base ml-1">“</span>
          <span>{opinion.comment}</span>
          <span className="text-[#94A3B8] font-serif text-base mr-1">”</span>
        </div>
      </div>

      {/* Action Buttons: Accept & Decline side-by-side with Framer Motion tap */}
      <div className="flex items-center gap-3 pt-2">
        {/* Accept Button (Blue) */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={() => onAccept(opinion.id, opinion.name)}
          className={`flex-1 py-2.5 rounded-xl font-heading font-bold text-xs text-center transition-all cursor-pointer ${
            isAccepted
              ? 'bg-[#1D6FD9] text-white shadow-sm ring-2 ring-[#BFDBFE]'
              : 'bg-[#1D6FD9] hover:bg-[#165AB8] text-white shadow-sm'
          }`}
        >
          قبول (Accept)
        </motion.button>

        {/* Decline Button (Red Outline) */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={() => onDecline(opinion.id, opinion.name)}
          className={`flex-1 py-2.5 rounded-xl font-heading font-bold text-xs text-center transition-all cursor-pointer ${
            isDeclined
              ? 'bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626]'
              : 'bg-white hover:bg-[#FFF1F2] border border-[#FCA5A5] text-[#E11D48]'
          }`}
        >
          رفض (Decline)
        </motion.button>
      </div>
    </motion.div>
  );
};
