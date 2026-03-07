import AnimatedSection from '../../../components/AnimatedSection';
import { Headphones, BookOpen, Code, MessageSquare } from 'lucide-react';

const supportLinks = [
  { icon: Headphones, label: 'Help Center' },
  { icon: BookOpen, label: 'Knowledge Base' },
  { icon: Code, label: 'API Documentation' },
  { icon: MessageSquare, label: 'Contact Support' },
];

export default function BrandedFooter() {
  return (
    <section className="relative bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 text-white overflow-hidden">
      {/* Background funnel silhouette */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[600px] h-[500px]">
          <div className="w-full h-20 bg-white/30 -skew-x-6 mb-2 rounded" />
          <div className="w-4/5 mx-auto h-20 bg-white/30 -skew-x-3 mb-2 rounded" />
          <div className="w-3/5 mx-auto h-20 bg-white/30 skew-x-3 mb-2 rounded" />
          <div className="w-2/5 mx-auto h-20 bg-white/30 skew-x-6 rounded" />
        </div>
      </div>

      <div className="section-container relative z-10 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-start">
          {/* Left — Tagline */}
          <AnimatedSection direction="left">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <span className="text-xl font-bold tracking-tight">Velo</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Every<br />
                moment<br />
                <span className="text-brand-300">matters.</span>
              </h2>
              <p className="mt-6 text-brand-200 text-sm leading-relaxed max-w-xs">
                Trusted by over 10,000 teams worldwide to capture, nurture, and
                convert leads at unprecedented speeds.
              </p>
            </div>
          </AnimatedSection>

          {/* Center — Support */}
          <AnimatedSection delay={0.1}>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <h3 className="text-lg font-bold mb-6">Support</h3>
              <div className="space-y-4">
                {supportLinks.map((link) => (
                  <a
                    key={link.label}
                    href="#"
                    className="flex items-center gap-3 text-sm text-brand-100 hover:text-white transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <link.icon size={16} />
                    </div>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Right — Social */}
          <AnimatedSection delay={0.2} direction="right">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <h3 className="text-lg font-bold mb-6">Social</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Instagram', handle: '@velocrm' },
                  { name: 'X / Twitter', handle: '@velo_hq' },
                  { name: 'LinkedIn', handle: 'Velo CRM' },
                  { name: 'YouTube', handle: 'Velo Official' },
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className="bg-white/5 hover:bg-white/10 rounded-xl p-4 text-center transition-colors group"
                  >
                    <p className="text-sm font-semibold group-hover:text-white transition-colors">
                      {social.name}
                    </p>
                    <p className="text-[10px] text-brand-300 mt-1">{social.handle}</p>
                  </a>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
