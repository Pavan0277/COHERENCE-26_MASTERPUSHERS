import AnimatedSection from '../../../components/AnimatedSection';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MultiPlatformCapture() {
  return (
    <section id="features" className="py-20 md:py-28 bg-[#FAFBFC]">
      <div className="max-w-[1200px] mx-auto px-5">
        {/* Section heading — n8n centers theirs */}
        <AnimatedSection>
          <h2 className="text-center text-[28px] md:text-[36px] lg:text-[42px] font-bold text-gray-900 leading-[1.1] tracking-[-0.02em] max-w-[700px] mx-auto">
            The fast way to turn leads into revenue
          </h2>
        </AnimatedSection>

        {/* Feature block 1 — AI Lead Scoring */}
        <AnimatedSection>
          <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <h3 className="text-[22px] md:text-[26px] font-bold text-gray-900 leading-[1.2] tracking-[-0.01em]">
                AI-powered lead scoring that actually works
              </h3>
              <p className="text-[15px] text-gray-500 leading-[1.7] mt-3 max-w-[460px]">
                Velo analyzes engagement signals, firmographic data, and behavioral
                patterns to surface your hottest leads — so reps spend time on deals
                that close.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-600 hover:text-brand-700 mt-5 group transition-colors"
              >
                Explore AI features
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Visual: Lead score table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-5 py-3 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-gray-700">Lead Scoring</span>
                <span className="text-[11px] text-gray-400 font-medium">Updated 2m ago</span>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { name: 'Acme Corp', score: 92, color: 'bg-emerald-500', w: 'w-[92%]' },
                  { name: 'Globex Inc', score: 78, color: 'bg-brand-500', w: 'w-[78%]' },
                  { name: 'Initech', score: 64, color: 'bg-amber-500', w: 'w-[64%]' },
                  { name: 'Umbrella Co', score: 41, color: 'bg-gray-300', w: 'w-[41%]' },
                ].map((l) => (
                  <div key={l.name} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 flex-shrink-0">
                      {l.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-medium text-gray-800 truncate">{l.name}</span>
                        <span className="text-[12px] font-bold text-gray-600 ml-2">{l.score}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${l.color} ${l.w}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Feature block 2 — Workflow Builder (reversed) */}
        <AnimatedSection>
          <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Visual first on desktop */}
            <div className="order-2 lg:order-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-5">
              <div className="space-y-1.5">
                {[
                  { step: 'New Lead Created', color: 'border-emerald-200 bg-emerald-50', dot: 'bg-emerald-500' },
                  { step: 'Wait 2 hours', color: 'border-amber-200 bg-amber-50', dot: 'bg-amber-500' },
                  { step: 'Send Welcome Email', color: 'border-brand-200 bg-brand-50', dot: 'bg-brand-500' },
                  { step: 'If opened → Assign to Sales', color: 'border-violet-200 bg-violet-50', dot: 'bg-violet-500' },
                ].map((s, i) => (
                  <div key={s.step}>
                    <div className={`flex items-center gap-3 border rounded-lg px-4 py-3 ${s.color}`}>
                      <div className={`w-2 h-2 rounded-full ${s.dot} flex-shrink-0`} />
                      <span className="text-[13px] font-medium text-gray-700">{s.step}</span>
                    </div>
                    {i < 3 && (
                      <div className="flex justify-center py-0.5">
                        <div className="w-px h-3.5 bg-gray-200" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h3 className="text-[22px] md:text-[26px] font-bold text-gray-900 leading-[1.2] tracking-[-0.01em]">
                Automate every step of your sales process
              </h3>
              <p className="text-[15px] text-gray-500 leading-[1.7] mt-3 max-w-[460px]">
                Design multi-step workflows visually — from lead assignment to
                follow-up sequences to deal-stage transitions. No code required,
                but available when you need it.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  'Visual drag-and-drop workflow editor',
                  'Branch logic with conditions & delays',
                  'Trigger workflows from any CRM event',
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[13px] text-gray-600">
                    <svg className="w-3.5 h-3.5 text-brand-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AnimatedSection>

        {/* Feature block 3 — Unified Inbox */}
        <AnimatedSection>
          <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <h3 className="text-[22px] md:text-[26px] font-bold text-gray-900 leading-[1.2] tracking-[-0.01em]">
                Every conversation, one unified inbox
              </h3>
              <p className="text-[15px] text-gray-500 leading-[1.7] mt-3 max-w-[460px]">
                Email, SMS, WhatsApp, social DMs, and live chat — all threaded
                by contact. Your team never loses context, and customers never
                repeat themselves.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  'Unified threads across all channels',
                  'AI-suggested replies & templates',
                  'Full contact timeline alongside every message',
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[13px] text-gray-600">
                    <svg className="w-3.5 h-3.5 text-brand-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual: Message inbox mockup */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-5 py-3">
                <span className="text-[13px] font-semibold text-gray-700">Inbox</span>
                <span className="text-[11px] text-gray-400 ml-2">3 unread</span>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { from: 'Sarah K.', ch: 'Email', msg: 'Thanks for the demo! Can you send pricing?', time: '2m' },
                  { from: 'James R.', ch: 'WhatsApp', msg: "We're ready to move forward with the annual plan", time: '15m' },
                  { from: 'Lisa M.', ch: 'LinkedIn', msg: 'Saw your post — would love to learn more', time: '1h' },
                ].map((m) => (
                  <div key={m.from} className="px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-default">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center">
                          <span className="text-[9px] font-bold text-brand-700">{m.from[0]}</span>
                        </div>
                        <span className="text-[13px] font-semibold text-gray-800">{m.from}</span>
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-medium">{m.ch}</span>
                      </div>
                      <span className="text-[11px] text-gray-400">{m.time}</span>
                    </div>
                    <p className="text-[13px] text-gray-500 leading-snug pl-8">{m.msg}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
