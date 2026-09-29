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
        variant={0}
        showHeritageMark
        heritageMarkClassName="spinning-heritage-mark"
      />

      <AboutIdentity />
      <CoreFocus />
    </div>
  );
};

export default About;
