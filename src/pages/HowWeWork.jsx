import PageHero from '../components/fx/PageHero';
import HowWeWorkProcess from '../components/HowWeWorkProcess';

const HowWeWork = () => {
  return (
    <div className="bg-white">
      <PageHero
        eyebrow="منهجيتنا"
        title="نحوّل الفكرة إلى مشروع قابل للنمو"
        subtitle="نعمل بخطوات واضحة، تبدأ بدراسة الفكرة وتنتهي ببناء مشروع منظم ومستدام."
        variant={1}
        showHeritageMark
        heritageMarkClassName="spinning-heritage-mark"
        useWaveLines
      />

      <HowWeWorkProcess />
    </div>
  );
};

export default HowWeWork;
