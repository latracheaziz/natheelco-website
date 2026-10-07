import React from 'react';
import { BarChart3, RefreshCw, Star } from 'lucide-react';
import { SOCIAL_PLATFORMS } from '../../data/adminMockData';
import { SocialBrandIcon } from './SocialIconsAdmin';

const number = (value) => (
  value === null || value === undefined
    ? 'غير متاح'
    : new Intl.NumberFormat('ar-SA').format(value)
);

export const StatisticsSection = ({
  opinions = [],
  analytics = { accounts: [], publications: [], history: [] },
  loading = false,
  error = '',
  onRefresh,
}) => {
  const totalOpinions = opinions.length;
  const acceptedOpinions = opinions.filter((item) => item.status === 'accepted').length;
  const pendingOpinions = opinions.filter((item) => item.status === 'pending').length;
  const declinedOpinions = opinions.filter((item) => item.status === 'declined').length;
  const averageRating = totalOpinions
    ? (opinions.reduce((sum, item) => sum + item.rating, 0) / totalOpinions).toFixed(1)
    : null;
  const historyByPlatform = (analytics.history || []).reduce((groups, item) => {
    groups[item.platform] = [...(groups[item.platform] || []), item];
    return groups;
  }, {});

  return (
    <section className="space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-lg font-bold text-[#0F172A] sm:text-xl">
              الإحصائيات والبيانات الفعلية
            </h2>
            <BarChart3 className="h-5 w-5 text-[#1D6FD9]" />
          </div>
          <p className="mt-1 text-xs text-[#64748B]">
            آخر قيم أعادتها واجهات المنصات الرسمية، دون تقدير أو بيانات افتراضية
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#1D6FD9] px-4 py-2 text-xs font-bold text-white disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'جارٍ جلب البيانات...' : 'تحديث من المنصات'}
        </button>
      </div>

      {error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SOCIAL_PLATFORMS.map((platform) => {
          const account = (analytics.accounts || []).find((item) => item.platform === platform.id);
          const snapshots = historyByPlatform[platform.id] || [];
          return (
            <article key={platform.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SocialBrandIcon platformId={platform.id} className="h-5 w-5" />
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">{platform.name}</h3>
                    <p className="text-[10px] text-[#64748B]">{account?.username || platform.enName}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                  account?.available
                    ? 'bg-emerald-50 text-emerald-700'
                    : account?.connected
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-slate-100 text-slate-600'
                }`}>
                  {account?.available ? 'بيانات متاحة' : account?.connected ? 'متصل بلا مقاييس' : 'غير متصل'}
                </span>
              </div>

              {account?.available ? (
                <>
                  <dl className="mt-5 grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-xl bg-[#F8FAFC] p-3">
                      <dt className="text-[10px] text-[#64748B]">المتابعون</dt>
                      <dd className="mt-1 text-lg font-black text-[#0F172A]">{number(account.followers_count)}</dd>
                    </div>
                    <div className="rounded-xl bg-[#F8FAFC] p-3">
                      <dt className="text-[10px] text-[#64748B]">منشورات الحساب</dt>
                      <dd className="mt-1 text-lg font-black text-[#0F172A]">{number(account.posts_count)}</dd>
                    </div>
                    <div className="rounded-xl bg-[#F8FAFC] p-3">
                      <dt className="text-[10px] text-[#64748B]">الإعجابات</dt>
                      <dd className="mt-1 text-lg font-black text-[#0F172A]">{number(account.likes_count)}</dd>
                    </div>
                    <div className="rounded-xl bg-[#F8FAFC] p-3">
                      <dt className="text-[10px] text-[#64748B]">المشاهدات</dt>
                      <dd className="mt-1 text-lg font-black text-[#0F172A]">{number(account.views_count)}</dd>
                    </div>
                  </dl>
                  <p className="mt-3 text-[10px] text-[#94A3B8]">
                    آخر جلب: {new Date(account.captured_at).toLocaleString('ar-SA')}
                    {snapshots.length > 1 ? ` · ${snapshots.length} نقاط محفوظة` : ''}
                  </p>
                </>
              ) : (
                <p className="mt-4 rounded-xl bg-[#F8FAFC] p-3 text-xs leading-6 text-[#64748B]">
                  {account?.reason || 'لم يتم جلب بيانات هذه المنصة بعد.'}
                </p>
              )}
            </article>
          );
        })}
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4">
          <div>
            <h3 className="font-heading text-base font-bold text-[#0F172A]">آراء العملاء المسجلة</h3>
            <p className="mt-1 text-xs text-[#64748B]">محسوبة مباشرة من سجلات قاعدة البيانات الحالية</p>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            <Star className="h-4 w-4" />
            <span>{averageRating === null ? 'غير متاح' : `${averageRating} / 5`}</span>
          </div>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['الإجمالي', totalOpinions],
            ['المقبولة', acceptedOpinions],
            ['قيد المراجعة', pendingOpinions],
            ['المرفوضة', declinedOpinions],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-[#F8FAFC] p-4 text-center">
              <dt className="text-xs text-[#64748B]">{label}</dt>
              <dd className="mt-1 text-2xl font-black text-[#0F172A]">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
