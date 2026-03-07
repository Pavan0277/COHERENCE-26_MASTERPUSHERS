import { Link } from 'react-router-dom';
import AnimatedSection from '../../../components/AnimatedSection';

export default function CTASection() {
  return (
    <section id="cta" className="py-24 md:py-36 bg-[#FAFBFC] relative overflow-hidden">
      {/* Decorative stars — subtle like n8n */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        <svg className="absolute top-10 left-[15%] w-5 h-5 text-brand-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.09 6.26L20.18 9l-5.09 3.74L17.18 19 12 15.27 6.82 19l2.09-6.26L3.82 9l6.09-.74z" /></svg>
        <svg className="absolute bottom-16 right-[20%] w-4 h-4 text-brand-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.09 6.26L20.18 9l-5.09 3.74L17.18 19 12 15.27 6.82 19l2.09-6.26L3.82 9l6.09-.74z" /></svg>
        <svg className="absolute top-1/2 left-[8%] w-3 h-3 text-brand-100" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.09 6.26L20.18 9l-5.09 3.74L17.18 19 12 15.27 6.82 19l2.09-6.26L3.82 9l6.09-.74z" /></svg>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 relative">
        <AnimatedSection>
          <div className="text-center max-w-[700px] mx-auto">
            <h2 className="text-[36px] sm:text-[52px] md:text-[64px] font-bold text-gray-900 leading-[1.05] tracking-[-0.03em]">
              There&apos;s nothing you can&apos;t close.
            </h2>
            <p className="mt-5 text-[16px] text-gray-500 leading-[1.6] max-w-[460px] mx-auto">
              Start for free. No credit card. Scale when you&apos;re ready.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="text-[15px] font-semibold text-white bg-brand-600 hover:bg-brand-700 px-8 py-3.5 rounded-lg transition-colors w-full sm:w-auto text-center"
              >
                Get started for free
              </Link>
              <Link
                to="#newsletter"
                className="text-[15px] font-medium text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 px-8 py-3.5 rounded-lg transition-colors w-full sm:w-auto text-center"
              >
                Talk to sales
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
