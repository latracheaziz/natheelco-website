import PageHero from '../components/fx/PageHero';
import AboutIdentity from '../components/AboutIdentity';
import CoreFocus from '../components/CoreFocus';

const About = () => {
  return (
    <div className="bg-white">
      <PageHero
        eyebrow="تعرّف علينا"
        title="عن نثيل"
        subtitle="نطوّر الأفكار الواعدة ونحولها إلى مشاريع منظّمة قابلة للتوسع والنمو المستدام."
        subtitleClassName="text-2xl md:text-3xl text-white/90 mt-6 max-w-2xl leading-relaxed font-medium"
        titleClassName="text-4xl md:text-5xl lg:text-5xl"
        contentClassName="container-premium section-padding pt-40 pb-8 lg:pt-48 lg:pb-12 relative z-10 w-full"
        variant={0}
        showHeritageMark
        heritageMarkClassName="spinning-heritage-mark"
        useFluidWave={true}
        hideEyebrowLine={true}
      >
        <AboutIdentity />
      </PageHero>

      <CoreFocus />
    </div>
  );
};

export default About;
