import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Star, 
  Sparkles
} from 'lucide-react';
import { MONTHLY_CHART_DATA, PLATFORM_STATS } from '../../data/adminMockData';
import { SocialBrandIcon } from './SocialIconsAdmin';

export const StatisticsSection = ({ opinions = [], posts = [] }) => {
  const [socialChartMode, setSocialChartMode] = useState('platforms'); // 'platforms' | 'monthly'
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredMonth, setHoveredMonth] = useState(null);

  // Compute live opinion stats from current state
  const totalOpinions = opinions.length;
  const acceptedOpinions = opinions.filter((o) => o.status === 'accepted').length;
  const pendingOpinions = opinions.filter((o) => o.status === 'pending').length;
  const declinedOpinions = opinions.filter((o) => o.status === 'declined').length;

  const acceptedPct = totalOpinions > 0 ? Math.round((acceptedOpinions / totalOpinions) * 100) : 0;
  const pendingPct = totalOpinions > 0 ? Math.round((pendingOpinions / totalOpinions) * 100) : 0;
  const declinedPct = totalOpinions > 0 ? Math.round((declinedOpinions / totalOpinions) * 100) : 0;

  // Star breakdown calculation
  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  opinions.forEach((op) => {
    if (starCounts[op.rating] !== undefined) starCounts[op.rating]++;
  });

  const avgRating = totalOpinions > 0 
    ? (opinions.reduce((acc, curr) => acc + curr.rating, 0) / totalOpinions).toFixed(1)
    : '5.0';

  // SVG Chart Calculations for Social Media Platforms
  const maxPlatformPosts = Math.max(...PLATFORM_STATS.map((p) => p.posts), 300);

  // Monthly SVG Chart Points
  const maxMonthlyViews = 2000000;
  const chartHeight = 220;
  const chartWidth = 600;
  
  const points = MONTHLY_CHART_DATA.map((item, idx) => {
    const x = (idx / (MONTHLY_CHART_DATA.length - 1)) * (chartWidth - 80) + 40;
    const y = chartHeight - (item.views / maxMonthlyViews) * (chartHeight - 40) - 20;
    return { x, y, ...item };
  });

  const linePath = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  return (
    <section className="space-y-6 animate-fadeIn">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-right">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-lg sm:text-xl font-bold text-[#0F172A]">
              الإحصائيات والتحليلات البيانية
            </h2>
            <div className="w-5 h-5 rounded-full bg-[#1D6FD9] text-white flex items-center justify-center">
              <BarChart3 className="w-3 h-3" />
            </div>
          </div>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            مؤشرات الأداء المباشرة لمنشورات قنوات التواصل ورضا العملاء المعتمد
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] text-xs font-semibold text-[#475569] shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#E8B04A]" />
          <span>تحديث فوري للبيانات</span>
        </div>
      </div>

      {/* 2 CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ─── CHART 1: Post Social Media ─── */}
        <div className="rounded-2xl bg-white border border-[#E2E8F0] p-6 shadow-sm relative">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1D6FD9]" />
                <h3 className="font-heading font-bold text-base text-[#0F172A]">
                  المخطط الأول: تحليلات منشورات التواصل الاجتماعي
                </h3>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                توزيع عدد المنشورات ومعدلات التفاعل عبر القنوات السبع
              </p>
            </div>

            {/* View Switch Buttons */}
            <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl">
              <button
                onClick={() => setSocialChartMode('platforms')}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                  socialChartMode === 'platforms'
                    ? 'bg-white text-[#1D6FD9] shadow-sm'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                حسب المنصة
              </button>
              <button
                onClick={() => setSocialChartMode('monthly')}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                  socialChartMode === 'monthly'
                    ? 'bg-white text-[#1D6FD9] shadow-sm'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                النمو الشهري
              </button>
            </div>
          </div>

          {/* Interactive Chart Body */}
          <div className="mt-6">
            {socialChartMode === 'platforms' ? (
              /* PLATFORMS BAR CHART */
              <div className="space-y-3.5">
                {PLATFORM_STATS.map((item, index) => {
                  const pct = Math.round((item.posts / maxPlatformPosts) * 100);
                  const isHovered = hoveredBar === index;
                  return (
                    <div
                      key={item.platform}
                      onMouseEnter={() => setHoveredBar(index)}
                      onMouseLeave={() => setHoveredBar(null)}
                      className="p-2 rounded-xl transition-all duration-200 hover:bg-[#F8FAFC]"
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-5 h-5 rounded-md flex items-center justify-center p-0.5"
                            style={{ backgroundColor: `${item.color}15`, color: item.color }}
                          >
                            <SocialBrandIcon platformId={item.id} className="w-3.5 h-3.5" />
                          </span>
                          <span className="font-bold text-[#0F172A]">{item.platform}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#64748B]">
                          <span className="text-[11px] font-mono text-[#1D6FD9] font-bold">
                            تفاعل: {item.engagement}
                          </span>
                          <span className="font-bold text-[#0F172A]">
                            {item.posts} منشور
                          </span>
                        </div>
                      </div>

                      {/* Progress Track */}
                      <div className="h-2.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden p-0.5">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${pct}%`,
                            background: item.color,
                            opacity: isHovered ? 1 : 0.85,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* MONTHLY AREA CHART */
              <div className="relative pt-2">
                <div className="h-[230px] w-full flex items-end">
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-full overflow-visible"
                  >
                    <defs>
                      <linearGradient id="areaGradLight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1D6FD9" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#1D6FD9" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="lineGradLight" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#1D6FD9" />
                        <stop offset="100%" stopColor="#38BDF8" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
                      <line
                        key={i}
                        x1="30"
                        y1={chartHeight * r}
                        x2={chartWidth - 30}
                        y2={chartHeight * r}
                        stroke="#E2E8F0"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Gradient Area */}
                    <path d={areaPath} fill="url(#areaGradLight)" />

                    {/* Line */}
                    <path
                      d={linePath}
                      fill="none"
                      stroke="url(#lineGradLight)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Circles */}
                    {points.map((pt, i) => (
                      <g key={i}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={hoveredMonth === i ? 6 : 4}
                          fill="#FFFFFF"
                          stroke="#1D6FD9"
                          strokeWidth="2.5"
                          className="cursor-pointer transition-all duration-200"
                          onMouseEnter={() => setHoveredMonth(i)}
                          onMouseLeave={() => setHoveredMonth(null)}
                        />
                      </g>
                    ))}
                  </svg>
                </div>

                {/* X Axis Labels */}
                <div className="flex justify-between px-6 pt-3 text-[11px] text-[#64748B] border-t border-[#F1F5F9]">
                  {MONTHLY_CHART_DATA.map((m) => (
                    <span key={m.month} className="font-medium">
                      {m.month}
                    </span>
                  ))}
                </div>

                {/* Hover Tooltip display */}
                {hoveredMonth !== null && (
                  <div className="absolute top-2 left-6 bg-white border border-[#BFDBFE] rounded-xl px-3 py-2 shadow-lg text-xs text-right animate-fadeIn">
                    <p className="font-bold text-[#1D6FD9]">
                      {MONTHLY_CHART_DATA[hoveredMonth].month}
                    </p>
                    <p className="text-[#475569]">
                      مشاهدات:{' '}
                      <span className="font-bold text-[#0F172A]">
                        {MONTHLY_CHART_DATA[hoveredMonth].reach}
                      </span>
                    </p>
                    <p className="text-[#475569]">
                      منشورات:{' '}
                      <span className="font-bold text-[#0F172A]">
                        {MONTHLY_CHART_DATA[hoveredMonth].posts} منشور
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Insight Footer */}
            <div className="mt-5 pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                أعلى منصة نمواً: تيك توك (+22.4%)
              </span>
              <span>تحديث تلقائي كل 15 دقيقة</span>
            </div>
          </div>
        </div>


        {/* ─── CHART 2: Client Opinion ─── */}
        <div className="rounded-2xl bg-white border border-[#E2E8F0] p-6 shadow-sm relative">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <h3 className="font-heading font-bold text-base text-[#0F172A]">
                  المخطط الثاني: تحليلات آراء العملاء وتجربة الخدمة
                </h3>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                مؤشرات القبول، الرفض، وتوزيع تقييم النجوم الخمس
              </p>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] text-xs font-bold text-[#D97706]">
              <Star className="w-3.5 h-3.5 fill-[#D97706]" />
              <span>{avgRating} / 5</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Donut Chart Visual Representation */}
            <div className="md:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* SVG Donut */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#F1F5F9"
                    strokeWidth="14"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#10B981"
                    strokeWidth="14"
                    strokeDasharray={`${(acceptedPct * 251.2) / 100} 251.2`}
                    strokeDashoffset="0"
                    className="transition-all duration-700 ease-out"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#F59E0B"
                    strokeWidth="14"
                    strokeDasharray={`${(pendingPct * 251.2) / 100} 251.2`}
                    strokeDashoffset={`-${(acceptedPct * 251.2) / 100}`}
                    className="transition-all duration-700 ease-out"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#F43F5E"
                    strokeWidth="14"
                    strokeDasharray={`${(declinedPct * 251.2) / 100} 251.2`}
                    strokeDashoffset={`-${((acceptedPct + pendingPct) * 251.2) / 100}`}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                {/* Donut Center Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold font-heading text-[#0F172A]">{acceptedPct}%</span>
                  <span className="text-[10px] text-emerald-600 font-bold">نسبة الاعتماد</span>
                </div>
              </div>

              {/* Status Breakdown Legend */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#D1FAE5] text-emerald-800 text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  مقبول ({acceptedOpinions})
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FEF3C7] text-amber-800 text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  معلق ({pendingOpinions})
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FEE2E2] text-rose-800 text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  مرفوض ({declinedOpinions})
                </span>
              </div>
            </div>

            {/* Star Rating Distribution */}
            <div className="md:col-span-7 space-y-2.5">
              <h4 className="text-xs font-bold text-[#334155] mb-2">
                توزيع درجات التقييم (من 1 إلى 5 نجوم):
              </h4>

              {[5, 4, 3, 2, 1].map((stars) => {
                const count = starCounts[stars] || 0;
                const pct = totalOpinions > 0 ? Math.round((count / totalOpinions) * 100) : 0;

                return (
                  <div key={stars} className="flex items-center gap-2 text-xs">
                    <div className="w-14 flex items-center gap-1 text-[#334155] font-bold">
                      <span>{stars}</span>
                      <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                    </div>

                    <div className="flex-1 h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1D6FD9] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="w-12 text-left text-[11px] text-[#64748B] font-mono font-bold">
                      {pct}%
                    </div>
                  </div>
                );
              })}

              <div className="mt-4 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#64748B]">مؤشر التوصية (NPS):</span>
                  <span className="font-bold text-[#0F172A] mr-1.5 font-mono">+78</span>
                </div>
                <span className="text-emerald-600 font-bold">مستوى عالمي متميز</span>
              </div>
            </div>

          </div>

          {/* Bottom Footer */}
          <div className="mt-5 pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
            <span>الآراء المقبولة تُعرض تلقائياً في صفحة الآراء بالموقع</span>
            <span className="text-[#1D6FD9] font-bold">تحديث ديناميكي مباشر</span>
          </div>
        </div>

      </div>
    </section>
  );
};
