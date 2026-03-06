import AnimatedSection from '../../../components/AnimatedSection';

export default function CRMOverview() {
  return (
    <section id="overview" className="section-padding bg-white relative">
      {/* Subtle divider line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent" />

      <div className="section-container text-center">
        <AnimatedSection>
          <p className="text-xs uppercase tracking-ultra-wide text-brand-600 font-semibold mb-4">
            The Platform
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-heading leading-tight max-w-3xl mx-auto text-balance">
            At its core, Velo is a robust CRM solution.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <p className="text-lg text-body mt-6 leading-relaxed max-w-2xl mx-auto">
            We provide next-generation tools to capture, nurture, and convert leads
            at scale. Built for teams that demand excellence and refuse to settle
            for less than extraordinary results.
          </p>
        </AnimatedSection>

        {/* Stats row */}
        <AnimatedSection delay={0.3}>
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { value: '10K+', label: 'Active Teams' },
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '50+', label: 'Integrations' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-extrabold text-heading">{stat.value}</p>
                <p className="text-sm text-body-light mt-1 tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
