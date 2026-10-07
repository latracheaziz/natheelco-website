import React, { useState } from 'react';
import { 
  Star, 
  Plus, 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';
import { ClientOpinionCard } from './ClientOpinionCard';

export const ClientOpinionSection = ({ 
  opinions = [], 
  onAcceptOpinion, 
  onDeclineOpinion, 
  onAddOpinion,
  error = '',
}) => {
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'pending' | 'accepted' | 'declined'
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // New Opinion Modal Form State
  const [newClientName, setNewClientName] = useState('');
  const [newClientRole, setNewClientRole] = useState('');
  const [newClientRating, setNewClientRating] = useState(5);
  const [newClientComment, setNewClientComment] = useState('');

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAccept = async (id, clientName) => {
    try {
      await onAcceptOpinion(id);
      showToast(`تم قبول واعتماد رأي العميل "${clientName}" بنجاح!`, 'success');
    } catch (acceptError) {
      showToast(acceptError.message || 'تعذر قبول الرأي', 'error');
    }
  };

  const handleDecline = async (id, clientName) => {
    try {
      await onDeclineOpinion(id);
      showToast(`تم رفض رأي العميل "${clientName}".`, 'declined');
    } catch (declineError) {
      showToast(declineError.message || 'تعذر رفض الرأي', 'error');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientComment.trim()) {
      showToast('يرجى ملء اسم العميل ونص التقييم', 'error');
      return;
    }

    const newOp = {
      name: newClientName.trim(),
      role: newClientRole.trim() || 'عميل',
      rating: Number(newClientRating),
      comment: newClientComment.trim(),
    };

    try {
      await onAddOpinion(newOp);
    } catch (addError) {
      showToast(addError.message || 'تعذر إضافة الرأي', 'error');
      return;
    }
    setShowAddModal(false);
    setNewClientName('');
    setNewClientRole('');
    setNewClientComment('');
    setNewClientRating(5);

    showToast('تمت إضافة رأي العميل بنجاح وهو الآن بانتظار الاعتماد', 'success');
  };

  // Filter Logic
  const filteredOpinions = opinions.filter((op) => {
    if (filterStatus === 'all') return true;
    return op.status === filterStatus;
  });

  const pendingCount = opinions.filter((o) => o.status === 'pending').length;
  const acceptedCount = opinions.filter((o) => o.status === 'accepted').length;
  const declinedCount = opinions.filter((o) => o.status === 'declined').length;

  return (
    <section className="space-y-5 animate-fadeIn">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 left-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border transition-all animate-bounce ${
            toastMessage.type === 'declined'
              ? 'bg-rose-50 border-rose-300 text-rose-800'
              : toastMessage.type === 'error'
              ? 'bg-rose-100 border-rose-400 text-rose-900'
              : 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-md'
          }`}
        >
          {toastMessage.type === 'declined' ? (
            <XCircle className="w-5 h-5 text-rose-500" />
          ) : toastMessage.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-500" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          )}
          <span className="text-xs font-bold">{toastMessage.text}</span>
        </div>
      )}

      {/* Section Header Matching Screenshot */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Right side: Title & Description */}
        <div className="text-right">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-lg sm:text-xl font-bold text-[#0F172A]">
              إدارة آراء وتقييمات العملاء
            </h2>
            <div className="w-5 h-5 rounded-full bg-[#1D6FD9] text-white flex items-center justify-center">
              <Star className="w-3 h-3 fill-white" />
            </div>
          </div>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            مراجعة آراء العملاء واتخاذ قرار القبول (Accept) أو الرفض (Decline) للظهور في واجهة الموقع
          </p>
        </div>

        {/* Left side: "+ إضافة رأي عميل جديد" Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#1D6FD9] hover:bg-[#165AB8] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة رأي عميل جديد</span>
        </button>
      </div>

      {error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-700">{error}</p>
      )}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterStatus === 'all'
              ? 'bg-[#1D6FD9] text-white shadow-sm'
              : 'bg-white text-[#475569] border border-[#E2E8F0] hover:bg-slate-50'
          }`}
        >
          الكل ({opinions.length})
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterStatus === 'pending'
              ? 'bg-[#1D6FD9] text-white shadow-sm'
              : 'bg-white text-[#475569] border border-[#E2E8F0] hover:bg-slate-50'
          }`}
        >
          بانتظار المراجعة ({pendingCount})
        </button>
        <button
          onClick={() => setFilterStatus('accepted')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterStatus === 'accepted'
              ? 'bg-[#1D6FD9] text-white shadow-sm'
              : 'bg-white text-[#475569] border border-[#E2E8F0] hover:bg-slate-50'
          }`}
        >
          المقبولة ({acceptedCount})
        </button>
        <button
          onClick={() => setFilterStatus('declined')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterStatus === 'declined'
              ? 'bg-[#1D6FD9] text-white shadow-sm'
              : 'bg-white text-[#475569] border border-[#E2E8F0] hover:bg-slate-50'
          }`}
        >
          المرفوضة ({declinedCount})
        </button>
      </div>

      {/* 2-Columns Grid of Client Opinions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOpinions.map((opinion) => (
          <ClientOpinionCard
            key={opinion.id}
            opinion={opinion}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        ))}
      </div>

      {/* ─── ADD NEW OPINION MODAL ─── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#E2E8F0] shadow-2xl p-6 relative text-right">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
              <div>
                <h3 className="font-heading font-bold text-base text-[#0F172A] flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#1D6FD9]" />
                  <span>إضافة رأي عميل جديد للمراجعة</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  سيكون التقييم بحالة (بانتظار القرار) للمعاينة والاعتماد
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  اسم العميل الكامل *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: م. فهد بن عبد العزيز"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1D6FD9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  الصفة / الشركة
                </label>
                <input
                  type="text"
                  placeholder="مثال: مالك المشروع"
                  value={newClientRole}
                  onChange={(e) => setNewClientRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1D6FD9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  التقييم (النجوم)
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewClientRating(s)}
                      className="p-1 text-slate-400 hover:text-amber-500"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          s <= newClientRating
                            ? 'fill-[#F59E0B] text-[#F59E0B]'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-slate-500 font-mono mr-2">
                    {newClientRating} من 5 نجوم
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  نص رأي العميل *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="اكتب تفاصيل انطباع العميل هنا..."
                  value={newClientComment}
                  onChange={(e) => setNewClientComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1D6FD9] resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-heading font-bold text-xs text-white bg-[#1D6FD9] hover:bg-[#165AB8] shadow-sm"
                >
                  إضافة للمراجعة
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </section>
  );
};
