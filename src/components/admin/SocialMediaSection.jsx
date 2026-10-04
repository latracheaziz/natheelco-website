import React, { useState, useRef } from 'react';
import { 
  Share2, 
  Image as ImageIcon, 
  Video, 
  Send, 
  Check, 
  Trash2, 
  Clock, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Hash,
  Layers,
  Smartphone,
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  Play,
  ThumbsUp
} from 'lucide-react';
import { SOCIAL_PLATFORMS } from '../../data/adminMockData';
import { SocialBrandIcon } from './SocialIconsAdmin';

const LivePlatformPreview = ({ platform, caption, imagePreview, videoUrl }) => {
  const postText = caption || 'هنا سيظهر نص المنشور الذي تقوم بكتابته في النموذج...';
  const renderMedia = (emptyMessage = 'معاينة الوسائط') => {
    if (videoUrl) {
      return <video src={videoUrl} controls playsInline className="h-full w-full bg-black object-cover" />;
    }
    if (imagePreview) {
      return <img src={imagePreview} alt="معاينة المنشور" className="h-full w-full object-cover" />;
    }
    return (
      <div className="flex h-full min-h-28 flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-200 to-slate-100 px-4 text-center text-slate-500">
        <ImageIcon className="h-7 w-7" />
        <span className="text-xs">{emptyMessage}</span>
      </div>
    );
  };

  const account = (
    <div className="flex min-w-0 items-center gap-2">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B3B46] text-sm font-bold text-white">N</div>
      <div className="min-w-0 text-right">
        <p className="truncate text-xs font-bold text-slate-900">شركة نثيل</p>
        <p className="truncate text-[10px] text-slate-500">@natheelco</p>
      </div>
    </div>
  );

  if (platform.id === 'tiktok') {
    return (
      <div className="relative mx-auto aspect-[9/16] max-h-[440px] w-full max-w-[250px] overflow-hidden rounded-[26px] bg-black text-white shadow-lg">
        <div className="absolute inset-0">{renderMedia('أضف صورة أو فيديو لتيك توك')}</div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/80" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-5 text-[11px] font-bold">
          <span>LIVE</span><span>لك　|　أتابعه</span><span>⌕</span>
        </div>
        <div className="absolute bottom-5 left-12 right-3 text-right">
          <p className="mb-1 text-xs font-bold">@natheelco</p>
          <p className="line-clamp-4 whitespace-pre-wrap text-xs leading-relaxed">{postText}</p>
          <p className="mt-2 text-[10px] text-white/80">♪ الصوت الأصلي - شركة نثيل</p>
        </div>
        <div className="absolute bottom-8 right-2 flex flex-col items-center gap-4 text-center text-[9px]">
          <Heart className="h-6 w-6 fill-white" /><span>-</span><MessageCircle className="h-6 w-6 fill-white" /><span>-</span><Bookmark className="h-5 w-5 fill-white" />
        </div>
      </div>
    );
  }

  if (platform.id === 'snapchat') {
    return (
      <div className="relative mx-auto aspect-[9/16] max-h-[440px] w-full max-w-[250px] overflow-hidden rounded-[26px] border-[5px] border-slate-900 bg-slate-900 text-white shadow-lg">
        <div className="absolute inset-0">{renderMedia('أضف صورة أو فيديو للقصة')}</div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/60" />
        <div className="absolute inset-x-3 top-3 flex gap-1"><span className="h-0.5 flex-1 rounded bg-white" /><span className="h-0.5 flex-1 rounded bg-white/45" /><span className="h-0.5 flex-1 rounded bg-white/45" /></div>
        <div className="absolute inset-x-3 top-6 flex items-center justify-between text-[10px] font-bold"><span>قصة نثيل</span><span>×</span></div>
        <div className="absolute bottom-4 inset-x-3 rounded-xl bg-black/35 p-3 text-right backdrop-blur-sm">
          <p className="line-clamp-5 whitespace-pre-wrap text-xs leading-relaxed">{postText}</p>
          <p className="mt-2 text-[10px] text-white/75">إرسال إلى الأصدقاء　　رد</p>
        </div>
      </div>
    );
  }

  if (platform.id === 'instagram') {
    return (
      <article className="mx-auto w-full max-w-[370px] overflow-hidden rounded-xl border border-slate-200 bg-white text-right shadow-sm">
        <div className="flex items-center justify-between p-3"><span className="text-lg font-bold">•••</span>{account}</div>
        <div className="aspect-square overflow-hidden bg-slate-100">{renderMedia('أضف صورة أو فيديو لمنشور إنستغرام')}</div>
        <div className="p-3">
          <div className="mb-2 flex items-center justify-between text-slate-800"><span className="flex items-center gap-3"><Heart className="h-5 w-5" /><MessageCircle className="h-5 w-5" /><Repeat2 className="h-5 w-5" /></span><Bookmark className="h-5 w-5" /></div>
          <p className="mb-1 text-xs font-bold text-slate-900">٢٬٤٠٠ إعجاب</p>
          <p className="line-clamp-5 whitespace-pre-wrap text-xs leading-relaxed text-slate-800"><strong>natheelco </strong>{postText}</p>
          <p className="mt-2 text-[10px] text-slate-400">عرض جميع التعليقات　·　الآن</p>
        </div>
      </article>
    );
  }

  if (platform.id === 'linkedin') {
    return (
      <article className="mx-auto w-full max-w-[410px] overflow-hidden rounded-lg border border-slate-200 bg-white text-right shadow-sm">
        <div className="flex items-center justify-between p-3"><span className="text-slate-500">•••</span>{account}</div>
        <p className="whitespace-pre-wrap px-3 pb-3 text-xs leading-relaxed text-slate-800">{postText}</p>
        <div className="max-h-[230px] overflow-hidden bg-slate-100">{renderMedia('أضف صورة أو فيديو لمنشور لينكد إن')}</div>
        <div className="flex items-center justify-around border-t border-slate-200 px-2 py-2 text-[10px] font-semibold text-slate-600"><span className="flex items-center gap-1"><ThumbsUp className="h-4 w-4" />أعجبني</span><span>تعليق</span><span>إعادة نشر</span><span>إرسال</span></div>
      </article>
    );
  }

  if (platform.id === 'twitter') {
    return (
      <article className="mx-auto w-full max-w-[410px] rounded-xl border border-slate-200 bg-white p-4 text-right shadow-sm">
        <div className="flex items-start justify-between"><span className="text-lg font-bold text-slate-900">𝕏</span>{account}</div>
        <p className="my-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-900">{postText}</p>
        {(imagePreview || videoUrl) && <div className="mb-3 max-h-[230px] overflow-hidden rounded-2xl border border-slate-200">{renderMedia('')}</div>}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] text-slate-500"><span>💬 142</span><span>🔄 86</span><span>❤️ 2.4K</span><span>↗</span></div>
      </article>
    );
  }

  if (platform.id === 'pinterest') {
    return (
      <article className="mx-auto w-full max-w-[300px] overflow-hidden rounded-2xl bg-white text-right shadow-md">
        <div className="aspect-[4/5] max-h-[350px] overflow-hidden bg-slate-100">{renderMedia('أضف صورة أو فيديو لفكرة بنترست')}</div>
        <div className="p-3">
          <div className="mb-2 flex items-center justify-between"><button type="button" className="rounded-full bg-[#BD081C] px-4 py-2 text-xs font-bold text-white">حفظ</button>{account}</div>
          <p className="line-clamp-4 whitespace-pre-wrap text-xs leading-relaxed text-slate-700">{postText}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="mx-auto w-full max-w-[410px] overflow-hidden rounded-xl border border-slate-200 bg-white text-right shadow-sm">
      <div className="aspect-video overflow-hidden bg-black">{renderMedia('أضف فيديو لمعاينة يوتيوب')}</div>
      <div className="flex gap-3 p-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF0000] text-white"><Play className="h-4 w-4 fill-current" /></div>
        <div className="min-w-0 flex-1"><p className="mb-1 line-clamp-2 whitespace-pre-wrap text-xs font-bold leading-relaxed text-slate-900">{postText}</p><p className="text-[10px] text-slate-500">شركة نثيل　·　٢٫٤ ألف مشاهدة　·　الآن</p></div>
      </div>
      <div className="flex items-center gap-4 px-3 pb-3 text-[10px] font-semibold text-slate-600"><span>👍 ٢٫٤ ألف</span><span>👎</span><span>مشاركة</span><span>حفظ</span></div>
    </article>
  );
};

export const SocialMediaSection = ({ posts = [], onAddPost, onDeletePost }) => {
  // Form State
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([
    'instagram',
    'linkedin',
    'twitter',
  ]);
  const [activePreviewPlatformId, setActivePreviewPlatformId] = useState('instagram');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [publishingStep, setPublishingStep] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Quick Hashtag Suggestions
  const suggestedHashtags = [
    '#نثيل',
    '#عمارة_سعودية',
    '#تصميم_داخلي',
    '#رؤية_2030',
    '#الرياض_الخضراء',
    '#مشاريع_فاخرة',
  ];

  const handleAddHashtag = (tag) => {
    if (!caption.includes(tag)) {
      setCaption((prev) => (prev ? `${prev} ${tag}` : tag));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setVideoUrl(objectUrl);
    }
  };

  const togglePlatform = (id) => {
    setActivePreviewPlatformId(id);
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const activePreviewPlatform = SOCIAL_PLATFORMS.find((platform) => platform.id === activePreviewPlatformId) || SOCIAL_PLATFORMS[0];

  const selectAllPlatforms = () => {
    if (selectedPlatforms.length === SOCIAL_PLATFORMS.length) {
      setSelectedPlatforms([]);
    } else {
      setSelectedPlatforms(SOCIAL_PLATFORMS.map((p) => p.id));
    }
  };

  const handlePostButtonClick = (e) => {
    e.preventDefault();
    if (!caption.trim() && !imagePreview && !videoUrl) {
      showToast('يرجى كتابة نص المنشور أو إرفاق صورة/فيديو أولاً', 'error');
      return;
    }
    setShowPlatformModal(true);
  };

  const confirmPublish = () => {
    if (selectedPlatforms.length === 0) {
      showToast('يرجى تحديد منصة واحدة على الأقل للنشر', 'error');
      return;
    }

    setIsSubmitting(true);
    setPublishingStep('broadcasting');

    setTimeout(() => {
      const newPost = {
        id: `post-${Date.now()}`,
        caption: caption.trim() || 'منشور جديد من شركة نثيل للمقاولات والتصميم',
        mediaType: videoUrl ? 'video' : imagePreview ? 'image' : 'text',
        mediaUrl: imagePreview || (videoUrl ? '' : '/pic1.jpeg'),
        videoUrl: videoUrl || '',
        platforms: [...selectedPlatforms],
        status: 'published',
        publishedAt: 'الآن',
        stats: { views: '1', likes: '0', shares: '0' },
      };

      onAddPost(newPost);
      setIsSubmitting(false);
      setShowPlatformModal(false);
      setPublishingStep(null);

      // Reset form
      setCaption('');
      setImagePreview(null);
      setVideoUrl('');

      showToast(
        `تم نشر المنشور بنجاح على ${selectedPlatforms.length} منصات اجتماعية!`,
        'success'
      );
    }, 1200);
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 left-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border transition-all animate-bounce ${
            toastMessage.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-800'
              : 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-md'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-500" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          )}
          <span className="text-xs font-bold">{toastMessage.text}</span>
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-right">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-lg sm:text-xl font-bold text-[#0F172A]">
              منشورات التواصل الاجتماعي (Social Media Hub)
            </h2>
            <div className="w-5 h-5 rounded-full bg-[#1D6FD9] text-white flex items-center justify-center">
              <Share2 className="w-3 h-3" />
            </div>
          </div>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            صياغة ونشر المحتوى فورياً أو مجدولاً على قنوات نثيل السبع
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] text-xs font-semibold text-[#475569] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span>جاهز للنشر: {selectedPlatforms.length} منصات محددة</span>
        </div>
      </div>

      {/* Main Grid: Formulaire (Left) + Live Mockup (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ─── THE FORMULAIRE ─── */}
        <div className="lg:col-span-7 xl:col-span-8 rounded-2xl bg-white border border-[#E2E8F0] p-6 shadow-sm">
          
          <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
            <h3 className="font-heading font-bold text-base text-[#0F172A]">
              نموذج إنشاء المنشور الجديد (Formulaire)
            </h3>
            <span className="text-xs text-[#64748B]">يدعم النصوص، الصور، ومقاطع الفيديو</span>
          </div>

          <form onSubmit={handlePostButtonClick} className="mt-5 space-y-5">
            
            {/* 1. TEXT INPUT FIELD */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#334155] flex items-center gap-1">
                  <span>نص المنشور (Text Caption)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] font-mono text-[#64748B]">
                  {caption.length} / 2200 حرف
                </span>
              </div>
              <textarea
                value={caption}
                maxLength={2200}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="اكتب تفاصيل المنشور هنا... مثل الإعلان عن مشاريع نثيل الجديدة، التحديثات المعمارية، إنجازات البناء، أو التهنئات الرسمية 🏛️✨"
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1D6FD9] transition-all text-xs resize-none leading-relaxed"
              />

              {/* Hashtag Suggestions */}
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-[#64748B] flex items-center gap-1 font-medium">
                  <Hash className="w-3 h-3 text-[#1D6FD9]" /> وسوم مقترحة:
                </span>
                {suggestedHashtags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddHashtag(tag)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#1D6FD9] border border-[#BFDBFE] hover:bg-[#DBEAFE] font-medium transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. MEDIA INPUTS (PICTURE & VIDEO) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Picture Upload Zone */}
              <div className="rounded-xl border border-dashed border-[#CBD5E1] hover:border-[#1D6FD9] bg-[#F8FAFC] p-4 transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#334155] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#1D6FD9]" />
                    <span>إرفاق صورة (Pic)</span>
                  </span>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> حذف
                    </button>
                  )}
                </div>

                {imagePreview ? (
                  <div className="relative rounded-lg overflow-hidden h-32 w-full border border-[#E2E8F0]">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="h-32 flex flex-col items-center justify-center cursor-pointer text-center p-3 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#1D6FD9] mb-1.5">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#334155]">
                      اضغط لاختيار صورة من جهازك
                    </span>
                    <span className="text-[10px] text-[#64748B] mt-0.5">
                      PNG, JPG, WEBP حتى 25MB
                    </span>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {!imagePreview && (
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-[#64748B]">صورة نموذجية:</span>
                    <button
                      type="button"
                      onClick={() => setImagePreview('/pic1.jpeg')}
                      className="text-[#1D6FD9] font-bold hover:underline"
                    >
                      صورة مشروع الدرعية
                    </button>
                  </div>
                )}
              </div>

              {/* Video Upload / Link Zone */}
              <div className="rounded-xl border border-dashed border-[#CBD5E1] hover:border-[#1D6FD9] bg-[#F8FAFC] p-4 transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#334155] flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-[#F59E0B]" />
                    <span>إرفاق فيديو (Video)</span>
                  </span>
                  {videoUrl && (
                    <button
                      type="button"
                      onClick={() => setVideoUrl('')}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> حذف
                    </button>
                  )}
                </div>

                {videoUrl ? (
                  <div className="relative rounded-lg overflow-hidden h-32 w-full border border-[#E2E8F0] bg-black flex items-center justify-center">
                    <video src={videoUrl} controls className="max-h-full max-w-full" />
                  </div>
                ) : (
                  <div className="h-32 flex flex-col items-center justify-center p-2 text-center">
                    <div 
                      onClick={() => videoInputRef.current?.click()}
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#D97706] mb-1.5">
                        <Video className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-[#334155]">
                        رفع ملف فيديو MP4
                      </span>
                    </div>

                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />

                    <div className="w-full mt-1.5">
                      <input
                        type="url"
                        placeholder="أو رابط فيديو..."
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full px-2 py-1 text-[11px] rounded bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1D6FD9]"
                      />
                    </div>
                  </div>
                )}

                {!videoUrl && (
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-[#64748B]">عينة فيديو:</span>
                    <button
                      type="button"
                      onClick={() => setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4')}
                      className="text-[#D97706] font-bold hover:underline"
                    >
                      فيديو هندسي
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* 3. TARGET PLATFORMS SELECTION */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold text-[#334155] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#1D6FD9]" />
                  <span>تحديد المنصات المستهدفة للنشر (المنصات السبع):</span>
                </label>
                <button
                  type="button"
                  onClick={selectAllPlatforms}
                  className="text-xs text-[#1D6FD9] font-bold hover:underline"
                >
                  {selectedPlatforms.length === SOCIAL_PLATFORMS.length
                    ? 'إلغاء تحديد الكل'
                    : 'تحديد كافة المنصات'}
                </button>
              </div>

              {/* 7 Platforms Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {SOCIAL_PLATFORMS.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform.id);
                  return (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => togglePlatform(platform.id)}
                      aria-pressed={isSelected}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all duration-200 relative ${
                        isSelected
                          ? 'bg-[#EFF6FF] border-[#1D6FD9] shadow-sm text-[#1D6FD9]'
                          : 'bg-white border-[#E2E8F0] text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center mb-1"
                        style={{ color: platform.color }}
                      >
                        <SocialBrandIcon platformId={platform.id} className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-[#0F172A]">
                        {platform.name}
                      </span>
                      <span className="text-[10px] text-[#64748B] font-mono mt-0.5">
                        {platform.followers}
                      </span>

                      {isSelected && (
                        <div className="absolute top-1 left-1 w-3.5 h-3.5 rounded-full bg-[#1D6FD9] text-white flex items-center justify-center text-[9px]">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. BUTTON POST */}
            <div className="pt-3 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-[#64748B] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#1D6FD9]" />
                <span>نشر فوري عبر جميع الحسابات المعتمدة</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-7 py-3 rounded-xl font-heading font-bold text-xs text-white bg-[#1D6FD9] hover:bg-[#165AB8] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>نشر المنشور (Post Now)</span>
              </button>
            </div>

          </form>

        </div>


        {/* ─── LIVE PLATFORM PREVIEW ─── */}
        <div className="lg:col-span-5 xl:col-span-4 rounded-2xl bg-white border border-[#E2E8F0] p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] mb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#1D6FD9]" />
              <h4 className="font-heading font-bold text-xs text-[#0F172A]">
                معاينة المنشور المباشرة (Live Mockup)
              </h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              مباشر
            </span>
          </div>

          <div className="mb-3 grid grid-cols-4 gap-1.5">
            {SOCIAL_PLATFORMS.map((platform) => {
              const isActive = activePreviewPlatform.id === platform.id;
              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => setActivePreviewPlatformId(platform.id)}
                  aria-label={`معاينة ${platform.name}`}
                  aria-pressed={isActive}
                  className={`flex min-w-0 items-center justify-center gap-1 rounded-lg border px-1.5 py-2 text-[10px] font-bold transition-colors ${isActive ? 'border-current bg-slate-50' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                  style={isActive ? { color: platform.color, borderColor: platform.color } : undefined}
                  title={platform.name}
                >
                  <SocialBrandIcon platformId={platform.id} className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{platform.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 shadow-inner">
            <div className="mb-3 flex items-center justify-between text-xs">
              <span className="font-bold text-[#0F172A]">معاينة {activePreviewPlatform.name}</span>
              <span className="flex items-center gap-1.5 text-[10px] text-[#64748B]">
                <SocialBrandIcon platformId={activePreviewPlatform.id} className="h-3.5 w-3.5" />
                {activePreviewPlatform.enName}
              </span>
            </div>
            <LivePlatformPreview
              platform={activePreviewPlatform}
              caption={caption}
              imagePreview={imagePreview}
              videoUrl={videoUrl}
            />
          </div>
        </div>

      </div>

      {/* ─── PLATFORM OPTIONS MODAL ─── */}
      {showPlatformModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-xl rounded-2xl bg-white border border-[#E2E8F0] shadow-2xl p-6 relative text-right">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
              <div>
                <h3 className="font-heading font-bold text-base text-[#0F172A] flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#1D6FD9]" />
                  <span>تأكيد خيارات النشر عبر المنصات السبع</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  اختر المنصات التي ترغب ببث المنشور إليها فورياً:
                </p>
              </div>
              <button
                onClick={() => setShowPlatformModal(false)}
                className="p-1 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {SOCIAL_PLATFORMS.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <div
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#EFF6FF] border-[#1D6FD9]'
                        : 'bg-white border-[#E2E8F0] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shadow-inner"
                        style={{ backgroundColor: `${platform.color}15`, color: platform.color }}
                      >
                        <SocialBrandIcon platformId={platform.id} className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#0F172A] ml-2">
                          {platform.name} ({platform.enName})
                        </span>
                        <span className="text-[11px] text-[#64748B] block">
                          المتابعون: {platform.followers}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-[#1D6FD9] border-[#1D6FD9] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowPlatformModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                إلغاء التراجع
              </button>

              <button
                type="button"
                disabled={isSubmitting || selectedPlatforms.length === 0}
                onClick={confirmPublish}
                className="px-5 py-2.5 rounded-xl font-heading font-bold text-xs text-white bg-[#1D6FD9] hover:bg-[#165AB8] transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{publishingStep === 'broadcasting' ? 'جاري البث والمزامنة...' : 'جاري النشر...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>تأكيد النشر على ({selectedPlatforms.length}) منصات</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── RECENT POSTS FEED ─── */}
      <div className="rounded-2xl bg-white border border-[#E2E8F0] p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <h3 className="font-heading font-bold text-base text-[#0F172A]">
            سجل المنشورات الحديثة المنشورة
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#1D6FD9] font-bold border border-[#BFDBFE]">
            {posts.length} منشور مسجل
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#1D6FD9]/50 transition-all overflow-hidden flex flex-col"
            >
              {post.mediaUrl && (
                <div className="h-40 w-full bg-slate-200 overflow-hidden relative">
                  <img
                    src={post.mediaUrl}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] text-white flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-[#38BDF8]" />
                    <span>{post.publishedAt}</span>
                  </div>
                </div>
              )}

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <p className="text-xs text-[#334155] line-clamp-3 leading-relaxed mb-3">
                  {post.caption}
                </p>

                <div>
                  <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
                    {post.platforms.map((pId) => (
                      <span
                        key={pId}
                        className="p-1 rounded bg-white border border-slate-200 text-[#475569]"
                        title={pId}
                      >
                        <SocialBrandIcon platformId={pId} className="w-3.5 h-3.5" />
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>مشاهدات: {post.stats?.views || '1.2K'}</span>
                    <button
                      type="button"
                      onClick={() => onDeletePost(post.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 rounded"
                      title="حذف المنشور"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
