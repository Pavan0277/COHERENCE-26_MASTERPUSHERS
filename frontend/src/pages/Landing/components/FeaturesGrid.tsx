import AnimatedSection from '../../../components/AnimatedSection';
import { UserPlus, RefreshCw, BarChart3, Database } from 'lucide-react';

const features = [
  {
    icon: UserPlus,
    title: 'Capture New Leads',
    description:
      'Automatically capture leads from web forms, social media, email campaigns, and more. Never miss a single opportunity to grow your pipeline.',
    gradient: 'from-blue-50 to-sky-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: RefreshCw,
    title: 'Auto-Nurture Leads into Customers',
    description:
      'Set up intelligent drip campaigns and automated follow-ups that convert cold prospects into warm, ready-to-buy customers.',
    gradient: 'from-violet-50 to-purple-50',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
  {
    icon: BarChart3,
    title: 'Boost Talk-Time & Close More Deals',
    description:
      'Built-in VoIP, smart call routing, and AI-powered conversation insights help your team spend more time selling and less time dialing.',
    gradient: 'from-emerald-50 to-green-50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Database,
    title: 'Direct All Revenue Channels',
    description:
      'Unify your revenue streams — e-commerce, subscriptions, and one-time sales — into a single, powerful dashboard.',
    gradient: 'from-amber-50 to-orange-50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="section-padding bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-brand-50/30 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container">
        {/* Section header */}
        <AnimatedSection className="text-center mb-16">
          <p className="text-xs uppercase tracking-ultra-wide text-brand-600 font-semibold mb-4">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-heading leading-tight max-w-2xl mx-auto">
            Everything you need to{' '}
            <span className="text-brand-600">dominate</span> your market.
          </h2>
          <p className="text-lg text-body mt-4 max-w-xl mx-auto">
            Powerful tools designed for modern sales teams. No compromises.
          </p>
        </AnimatedSection>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <AnimatedSection
              key={feature.title}
              delay={index * 0.1}
              direction={index % 2 === 0 ? 'left' : 'right'}
            >
              <div className="feature-card group h-full hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <feature.icon size={22} className={feature.iconColor} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-heading">{feature.title}</h3>
                    <p className="text-sm text-body mt-2 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Visual area */}
                <div className={`mt-6 bg-gradient-to-br ${feature.gradient} rounded-xl p-6 aspect-[16/9] flex items-center justify-center border border-gray-100/50`}>
                  <div className="w-full max-w-xs bg-white rounded-lg shadow-sm p-3 space-y-2">
                    <div className="flex gap-1.5 mb-3">
                      <div className="w-2 h-2 rounded-full bg-red-300" />
                      <div className="w-2 h-2 rounded-full bg-yellow-300" />
                      <div className="w-2 h-2 rounded-full bg-green-300" />
                    </div>
                    <div className="h-2 bg-gray-100 rounded w-3/4" />
                    <div className="h-2 bg-gray-100 rounded w-1/2" />
                    <div className="h-6 bg-brand-50 rounded mt-3" />
                    <div className="flex gap-2 mt-2">
                      <div className="h-4 bg-brand-100 rounded flex-1" />
                      <div className="h-4 bg-brand-200 rounded flex-1" />
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
