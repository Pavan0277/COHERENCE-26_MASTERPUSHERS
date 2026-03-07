import AnimatedSection from '../../../components/AnimatedSection';

const testimonials = [
  {
    name: 'Sarah Chen',
    handle: '@sarahchen',
    text: 'We switched from Salesforce to @velocrm and our reps closed 40% more deals in the first quarter. The unified inbox alone saves us hours every day.',
  },
  {
    name: 'Marcus Johnson',
    handle: '@marcusj',
    text: 'Velo\'s workflow automations replaced 3 different tools for us. Lead scoring, nurture sequences, and pipeline management — all in one place.',
  },
  {
    name: 'Priya Patel',
    handle: '@priyapatel',
    text: 'The AI lead scoring is scarily accurate. Our SDRs now spend time on prospects that actually convert instead of chasing dead leads.',
  },
  {
    name: 'Alex Rivera',
    handle: '@alexrivera',
    text: 'Best CRM we\'ve ever used. Period. The team adopted it in days, not months.',
  },
  {
    name: 'Emily Zhang',
    handle: '@emilyzhang',
    text: 'The multi-channel capture is a game-changer. Leads from LinkedIn, email, web forms, and ads all flow into one beautiful pipeline.',
  },
  {
    name: 'David Kim',
    handle: '@davidkim',
    text: 'I built our entire sales process on Velo in a weekend. The workflow builder is intuitive and powerful.',
  },
  {
    name: 'Nina Okoro',
    handle: '@ninaokoro',
    text: 'Switched from HubSpot. No regrets. Velo is faster, cleaner, and the automation engine actually does what you tell it.',
  },
  {
    name: 'Tom Hartley',
    handle: '@tomhartley',
    text: 'Our close rate went from 18% → 31% within 90 days of rolling out Velo across the team. The AI suggestions are genuinely helpful.',
  },
  {
    name: 'Riya Mehta',
    handle: '@riyamehta',
    text: 'Finally a CRM that gets out of the way and lets you sell. Beautiful UX, fast, and the integrations just work.',
  },
];

export default function EmailSocial() {
  return (
    <section id="newsletter" className="py-20 md:py-28 bg-white">
      <div className="max-w-[1200px] mx-auto px-5">
        <AnimatedSection>
          <div className="text-center max-w-[600px] mx-auto mb-14">
            <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-bold text-gray-900 leading-[1.1] tracking-[-0.02em]">
              Loved by 50,000+ teams
            </h2>
            <p className="text-[15px] text-gray-500 leading-[1.6] mt-4">
              Here&apos;s what teams say after switching to Velo.
            </p>
          </div>
        </AnimatedSection>

        {/* 3-column masonry-style grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {testimonials.map((t, i) => (
            <AnimatedSection key={t.handle} delay={i * 0.04}>
              <div className="break-inside-avoid bg-[#FAFBFC] border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-brand-700">{t.name.split(' ').map(w => w[0]).join('')}</span>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900 leading-tight">{t.name}</p>
                    <p className="text-[12px] text-gray-400 leading-tight">{t.handle}</p>
                  </div>
                </div>
                <p className="text-[14px] text-gray-600 leading-[1.65]">{t.text}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
