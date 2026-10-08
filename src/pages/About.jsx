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
