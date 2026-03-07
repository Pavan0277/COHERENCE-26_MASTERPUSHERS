import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CRMOverview from './components/CRMOverview';
import MultiPlatformCapture from './components/MultiPlatformCapture';
import FeaturesGrid from './components/FeaturesGrid';
import EmailSocial from './components/EmailSocial';
import CTASection from './components/CTASection';
import BrandedFooter from './components/BrandedFooter';

export default function LandingPage() {
  return (
    <div className="relative overflow-x-hidden bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <CRMOverview />
        <MultiPlatformCapture />
        <FeaturesGrid />
        <EmailSocial />
        <CTASection />
      </main>
      <BrandedFooter />
    </div>
  );
}
