import AnimatedSection from '../../../components/AnimatedSection';

export default function CRMOverview() {
  return (
    <section id="usecases" className="py-20 md:py-28 bg-white border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center max-w-[700px] mx-auto">
            <h2 className="text-[30px] sm:text-[36px] md:text-[42px] font-bold text-gray-900 leading-[1.15] tracking-[-0.02em]">
              At its core, Velo is a robust CRM{' '}
              <span className="text-[#1e3a5f]">automation</span> platform.
            </h2>
            <p className="mt-5 text-[15px] md:text-[16px] text-gray-500 leading-[1.7] max-w-[560px] mx-auto">
              Manage pipelines, automate outreach, and close deals faster with
              AI-powered workflows that integrate seamlessly with your existing stack.
            </p>
          </div>
        </AnimatedSection>

        {/* Feature highlights */}
        <AnimatedSection delay={0.15}>
          <div className="grid sm:grid-cols-3 gap-8 mt-14">
            {[
              {
                title: 'Smart Pipeline',
                desc: 'AI-scored leads flow through visual pipelines with automated stage transitions.',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#1e3a5f]">
                    <path d="M3 12h4l3-9 4 18 3-9h4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                title: 'Multi-Channel Outreach',
                desc: 'Email, calls, Telegram, Slack — reach leads on the channels they prefer.',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#1e3a5f]">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                title: 'Workflow Engine',
                desc: 'Drag-and-drop automations with conditional logic, delays, and AI nodes.',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#1e3a5f]">
                    <rect x="3" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="14" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="8.5" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6.5 10v1.5a1 1 0 001 1H12m0-2.5v2.5m0 0h4.5a1 1 0 001-1V10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
            ].map((f) => (
              <div key={f.title} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  {f.icon}
                </div>
                <h3 className="text-[17px] font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-[14px] text-gray-500 leading-[1.6]">{f.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
