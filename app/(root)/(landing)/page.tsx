import FaqSection from '@/components/Marketing/FaqSection';
import { FeaturesSection } from '@/components/Marketing/FeaturesSection';
import HeroSection from '@/components/Marketing/HeroSection';
import { HowItWorksSection } from '@/components/Marketing/HowItWorksSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <FaqSection />
    </>
  );
}
