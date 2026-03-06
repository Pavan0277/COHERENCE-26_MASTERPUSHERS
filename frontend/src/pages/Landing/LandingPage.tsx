import { useLenis } from '../../hooks/useLenis';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CRMOverview from './components/CRMOverview';
import MultiPlatformCapture from './components/MultiPlatformCapture';
import PlaneMorph from './components/PlaneMorph';
import FeaturesGrid from './components/FeaturesGrid';
import EmailSocial from './components/EmailSocial';
import CTASection from './components/CTASection';
import BrandedFooter from './components/BrandedFooter';
import Footer from './components/Footer';

export default function LandingPage() {
  useLenis(); // Initialize smooth scrolling

  return (
    <div className="relative overflow-x-hidden bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <CRMOverview />
        <MultiPlatformCapture />
        <PlaneMorph />
        <FeaturesGrid />
        <EmailSocial />
        <CTASection />
      </main>
      <BrandedFooter />
      <Footer />
    </div>
  );
}
