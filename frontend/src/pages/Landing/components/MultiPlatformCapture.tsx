import AnimatedSection from '../../../components/AnimatedSection';
import { Globe, Zap, Shield } from 'lucide-react';

export default function MultiPlatformCapture() {
  return (
    <section className="section-padding bg-surface-subtle relative overflow-hidden">
      <div className="section-container">
        <AnimatedSection>
          <div className="feature-card !p-10 md:!p-14 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-radial from-brand-50/50 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Left — Content */}
              <div>
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-ultra-wide text-brand-600 font-semibold">
                  <Globe size={14} />
                  Multi-Platform Capture
                </span>

                <h3 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-heading leading-tight">
                  Capture leads from every channel, automatically.
                </h3>

                <p className="mt-4 text-body leading-relaxed">
                  From social media to search engines, from referral links to landing pages —
                  Velo aggregates every prospect touchpoint into one unified pipeline.
                  Never miss an opportunity, regardless of where it originates.
                </p>

                {/* Feature bullets */}
                <div className="mt-8 space-y-4">
                  {[
                    { icon: Zap, text: 'Instant lead capture from 50+ channels' },
                    { icon: Shield, text: 'GDPR & privacy compliant by default' },
                    { icon: Globe, text: 'Multi-region, multi-language support' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <item.icon size={16} className="text-brand-600" />
                      </div>
                      <p className="text-sm text-gray-700">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Visual */}
              <div className="relative">
                <div className="bg-gradient-to-br from-brand-50 via-blue-50 to-indigo-50 rounded-2xl p-8 aspect-[4/3] flex items-center justify-center border border-brand-100/30">
                  {/* Dashboard mockup */}
                  <div className="w-full max-w-sm bg-white rounded-xl shadow-card p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                      <div className="flex-1 ml-2 h-5 bg-gray-100 rounded" />
                    </div>
                    {/* Bars */}
                    <div className="space-y-2">
                      <div className="flex gap-2 items-center">
                        <div className="w-16 h-3 bg-gray-100 rounded" />
                        <div className="flex-1 h-6 bg-brand-500/80 rounded" />
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="w-16 h-3 bg-gray-100 rounded" />
                        <div className="flex-1 h-6 bg-brand-400/60 rounded" style={{ width: '75%' }} />
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="w-16 h-3 bg-gray-100 rounded" />
                        <div className="flex-1 h-6 bg-brand-300/50 rounded" style={{ width: '55%' }} />
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="w-16 h-3 bg-gray-100 rounded" />
                        <div className="flex-1 h-6 bg-brand-200/40 rounded" style={{ width: '40%' }} />
                      </div>
                    </div>
                    {/* Mini stats */}
                    <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
                      <div className="flex-1 text-center">
                        <p className="text-lg font-bold text-heading">2.4K</p>
                        <p className="text-[10px] text-body-light">Leads</p>
                      </div>
                      <div className="flex-1 text-center">
                        <p className="text-lg font-bold text-heading">89%</p>
                        <p className="text-[10px] text-body-light">Reply Rate</p>
                      </div>
                      <div className="flex-1 text-center">
                        <p className="text-lg font-bold text-green-600">↑ 34%</p>
                        <p className="text-[10px] text-body-light">Growth</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
