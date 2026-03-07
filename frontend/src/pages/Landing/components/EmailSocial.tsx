import AnimatedSection from '../../../components/AnimatedSection';
import { Mail, Share2, CheckCircle } from 'lucide-react';

const emailFeatures = [
  'Custom drag-and-drop email builder',
  'Premium responsive templates',
  'A/B subject line testing',
  'Real-time open & click tracking',
];

const socialFeatures = [
  'Schedule posts across platforms',
  'Unified social inbox',
  'Analytics & ROI reporting',
  'AI-powered content suggestions',
];

export default function EmailSocial() {
  return (
    <section className="section-padding bg-surface-subtle relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-50/30 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container">
        <AnimatedSection className="text-center mb-16">
          <p className="text-xs uppercase tracking-ultra-wide text-brand-600 font-semibold mb-4">
            Marketing Suite
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-heading leading-tight max-w-2xl mx-auto">
            Email & Social, <span className="text-brand-600">unified.</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Email Card */}
          <AnimatedSection direction="left">
            <div className="feature-card h-full group hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-rose-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Mail size={20} className="text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-heading">Craft Beautiful Newsletters</h3>
              </div>

              <p className="text-sm text-body leading-relaxed mb-6">
                Design stunning email campaigns with our intuitive builder.
                Choose from premium templates, personalize with dynamic content,
                and track engagement in real time.
              </p>

              <ul className="space-y-3 mb-6">
                {emailFeatures.map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>

              {/* Email mockup */}
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-5 border border-rose-100/30">
                <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-100" />
                    <div className="flex-1">
                      <div className="h-2.5 bg-gray-100 rounded w-24" />
                      <div className="h-2 bg-gray-50 rounded w-16 mt-1" />
                    </div>
                  </div>
                  <div className="h-20 bg-gradient-to-br from-brand-100 to-brand-200 rounded-lg" />
                  <div className="space-y-1.5">
                    <div className="h-2 bg-gray-100 rounded w-full" />
                    <div className="h-2 bg-gray-100 rounded w-5/6" />
                    <div className="h-2 bg-gray-100 rounded w-3/4" />
                  </div>
                  <div className="flex justify-center pt-2">
                    <div className="h-8 w-28 bg-brand-600 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Social Card */}
          <AnimatedSection direction="right">
            <div className="feature-card h-full group hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Share2 size={20} className="text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-heading">Social Media Management</h3>
              </div>

              <p className="text-sm text-body leading-relaxed mb-6">
                Schedule posts, engage followers, and measure ROI across every
                platform from a single unified dashboard. Instagram, LinkedIn,
                X, Facebook — all in one place.
              </p>

              <ul className="space-y-3 mb-6">
                {socialFeatures.map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>

              {/* Social mockup */}
              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-5 border border-indigo-100/30">
                <div className="grid grid-cols-2 gap-3">
                  {['Instagram', 'LinkedIn', 'X / Twitter', 'Facebook'].map((platform) => (
                    <div key={platform} className="bg-white rounded-lg shadow-sm p-3 text-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 mx-auto mb-2" />
                      <p className="text-[10px] font-semibold text-heading">{platform}</p>
                      <p className="text-[9px] text-body-light mt-0.5">Connected</p>
                    </div>
                  ))}
                </div>
                {/* Activity bar chart */}
                <div className="mt-3 bg-white rounded-lg shadow-sm p-3">
                  <p className="text-[10px] font-semibold text-heading mb-2">Weekly Activity</p>
                  <div className="flex items-end gap-1.5 h-12">
                    {[40, 65, 50, 80, 70, 90, 60].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-indigo-400/60 rounded-t"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
