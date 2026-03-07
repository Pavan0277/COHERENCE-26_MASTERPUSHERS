import AnimatedSection from '../../../components/AnimatedSection';
import { Shield, Zap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function FeaturesGrid() {
  return (
    <>
      {/* Section 1 — "Customize when you need it" (like n8n's "Code when you need it") */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1200px] mx-auto px-5">
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div>
                <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-bold text-gray-900 leading-[1.1] tracking-[-0.02em]">
                  Customize when you need it, clicks when you don't
                </h2>
                <p className="text-[15px] text-gray-500 leading-[1.7] mt-4 max-w-[460px]">
                  Most CRMs force a choice: flexibility or simplicity. Velo gives
                  you both — a point-and-click interface backed by full API access
                  and custom scripting.
                </p>
                <ul className="mt-5 space-y-2.5">
                  {[
                    'Point-and-click pipeline customization',
                    'Custom fields, objects, and automations',
                    'Full REST API & webhooks for developers',
                    'JavaScript scripting in workflow nodes',
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-2 text-[13px] text-gray-600">
                      <svg className="w-3.5 h-3.5 text-brand-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-600 hover:text-brand-700 mt-6 group transition-colors"
                >
                  See the developer docs
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Visual: Code + UI split */}
              <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="flex border-b border-gray-100">
                  <div className="px-4 py-2.5 bg-white text-[12px] font-semibold text-brand-600 border-b-2 border-brand-500">Visual</div>
                  <div className="px-4 py-2.5 text-[12px] font-medium text-gray-400">Code</div>
                </div>
                <div className="bg-[#FAFBFC] p-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <div className="flex-1 h-8 bg-white border border-gray-200 rounded-md flex items-center px-3">
                        <span className="text-[11px] text-gray-400">Deal Name</span>
                        <span className="ml-auto text-[11px] font-medium text-gray-700">Acme Renewal</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-brand-400" />
                      <div className="flex-1 h-8 bg-white border border-gray-200 rounded-md flex items-center px-3">
                        <span className="text-[11px] text-gray-400">Stage</span>
                        <span className="ml-auto text-[11px] font-medium text-brand-600">Negotiation</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <div className="flex-1 h-8 bg-white border border-gray-200 rounded-md flex items-center px-3">
                        <span className="text-[11px] text-gray-400">Value</span>
                        <span className="ml-auto text-[11px] font-medium text-gray-700">$48,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 2 — Enterprise trust (n8n's "Secure. Reliable. Collaborative.") */}
      <section className="py-20 md:py-28 bg-[#FAFBFC]">
        <div className="max-w-[1200px] mx-auto px-5">
          <AnimatedSection>
            <div className="text-center max-w-[600px] mx-auto mb-14">
              <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-bold text-gray-900 leading-[1.1] tracking-[-0.02em]">
                Secure. Reliable. Collaborative.
              </h2>
              <p className="text-[15px] text-gray-500 leading-[1.6] mt-4">
                Built for teams that take security and performance as seriously as growth.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                Icon: Shield,
                title: 'Enterprise-grade security',
                items: ['SOC 2 Type II certified', 'End-to-end encryption', 'SSO & SAML support', 'Role-based permissions'],
              },
              {
                Icon: Zap,
                title: 'Built for performance',
                items: ['99.99% uptime SLA', 'Global CDN delivery', 'Auto-scaling infrastructure', 'Real-time data sync'],
              },
              {
                Icon: Users,
                title: 'Team collaboration',
                items: ['Shared pipelines & views', '@mentions & comments', 'Activity feeds per deal', 'Granular permissions'],
              },
            ].map((card, i) => (
              <AnimatedSection key={card.title} delay={i * 0.08}>
                <div className="h-full rounded-xl border border-gray-200 bg-white p-6 hover:border-gray-300 transition-colors">
                  <card.Icon size={20} className="text-brand-600 mb-4" strokeWidth={1.5} />
                  <h3 className="text-[16px] font-bold text-gray-900 mb-4">{card.title}</h3>
                  <ul className="space-y-2">
                    {card.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-[13px] text-gray-600">
                        <svg className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
