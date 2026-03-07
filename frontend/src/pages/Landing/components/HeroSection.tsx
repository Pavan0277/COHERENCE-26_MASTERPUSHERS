import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-[72px] overflow-hidden">
      {/* Subtle wavy background lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-[0.08]"
          viewBox="0 0 1440 800"
          fill="none"
          preserveAspectRatio="none"
        >
          <path d="M-100 400C200 200 400 600 700 350C1000 100 1200 500 1540 300" stroke="#94a3b8" strokeWidth="1.5" />
          <path d="M-100 450C200 250 400 650 700 400C1000 150 1200 550 1540 350" stroke="#94a3b8" strokeWidth="1" />
          <path d="M-100 500C200 300 400 700 700 450C1000 200 1200 600 1540 400" stroke="#94a3b8" strokeWidth="0.8" />
          <path d="M-100 350C200 150 400 550 700 300C1000 50 1200 450 1540 250" stroke="#94a3b8" strokeWidth="0.5" />
          <path d="M-100 550C200 350 400 750 700 500C1000 250 1200 650 1540 450" stroke="#94a3b8" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Light gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-white to-white pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8 pt-16 md:pt-24 lg:pt-28 pb-20 md:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left content */}
          <div className="max-w-[540px]">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[36px] sm:text-[42px] md:text-[48px] lg:text-[52px] font-bold leading-[1.1] tracking-[-0.02em] text-gray-900"
            >
              Get More Leads, Close More Deals, Grow Your Business Faster.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-6 text-[15px] md:text-[16px] text-gray-500 leading-[1.7] max-w-[460px]"
            >
              Avalanche 360 is a game changer. Period. You'll get such an unfair competitive
              advantage, you'll wonder how you ever ran your sales and marketing team without it.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-5 mt-9"
            >
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-white bg-[#1e3a5f] hover:bg-[#16304f] px-7 py-3.5 rounded-full transition-colors"
              >
                Get started
                <ArrowRight size={16} />
              </Link>
              <button
                onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-3 text-[15px] font-semibold text-gray-700 hover:text-gray-900 transition-colors group"
              >
                <span className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-gray-300 group-hover:border-gray-400 transition-colors">
                  <Play size={16} className="text-gray-500 ml-0.5" />
                </span>
                Watch Video
              </button>
            </motion.div>
          </div>

          {/* Right visual — hero image with floating UI widgets */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Main image */}
            <div className="relative w-full max-w-[520px]">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/hero-meeting.png"
                  alt="Business professionals in a meeting"
                  className="w-full h-auto block object-cover"
                />
              </div>

              {/* Floating card: Notification card (top-right) */}
              <motion.div
                initial={{ opacity: 0, y: -20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute -top-4 -right-4 sm:right-0 lg:-right-8 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-3 min-w-[220px]"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[11px] font-bold">JC</span>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-800">
                    Jerry Calzoni{' '}
                    <span className="text-emerald-500 font-semibold">joined</span>{' '}
                    Swimming
                  </p>
                  <p className="text-[11px] text-gray-400">Class · 9:22 AM</p>
                </div>
              </motion.div>

              {/* Floating card: Calendar (bottom-left) */}
              <motion.div
                initial={{ opacity: 0, y: 20, x: -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="absolute -bottom-6 -left-4 sm:left-0 lg:-left-10 bg-white rounded-xl shadow-lg border border-gray-100 p-4 w-[200px]"
              >
                <div className="flex items-center justify-between mb-3">
                  <button className="text-[12px] font-semibold text-brand-600 hover:underline">
                    June 2021 &gt;
                  </button>
                  <div className="flex gap-1">
                    <button className="w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:bg-gray-100">
                      <span className="text-[10px]">&lt;</span>
                    </button>
                    <button className="w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:bg-gray-100">
                      <span className="text-[10px]">&gt;</span>
                    </button>
                  </div>
                </div>
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-0 text-center mb-1">
                  {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((d) => (
                    <span key={d} className="text-[8px] font-semibold text-gray-400 py-0.5">{d}</span>
                  ))}
                </div>
                {/* Calendar rows */}
                <div className="grid grid-cols-7 gap-0 text-center">
                  {/* Row 1: empty + 1-5 */}
                  {['', '', '1', '2', '3', '4', '5'].map((n, i) => (
                    <span key={`r1-${i}`} className="text-[11px] text-gray-600 py-1">{n}</span>
                  ))}
                  {/* Row 2: 6-12, with 7 highlighted */}
                  {['6', '7', '8', '9', '10', '11', '12'].map((n) => (
                    <span
                      key={`r2-${n}`}
                      className={`text-[11px] py-1 rounded-full ${
                        n === '7'
                          ? 'bg-brand-600 text-white font-bold'
                          : 'text-gray-600'
                      }`}
                    >
                      {n}
                    </span>
                  ))}
                  {/* Row 3: 13-19 */}
                  {['13', '14', '15', '16', '17', '18', '19'].map((n) => (
                    <span key={`r3-${n}`} className="text-[11px] text-gray-600 py-1">{n}</span>
                  ))}
                </div>
                {/* Time */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                  <span className="text-[10px] text-gray-400">Time</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-semibold text-gray-700 bg-gray-50 px-2 py-0.5 rounded">09 : 41</span>
                    <span className="text-[9px] font-bold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">AM</span>
                    <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">PM</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating card: Net Sales (bottom-right) */}
              <motion.div
                initial={{ opacity: 0, y: 20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="absolute -bottom-10 -right-2 sm:right-0 lg:-right-6 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 w-[180px]"
              >
                <p className="text-[10px] text-gray-400 font-medium">Net Sales</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-[20px] font-bold text-gray-900">$19,7650</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] font-bold text-emerald-500">32% ↗</span>
                  {/* Mini bar chart */}
                  <div className="flex items-end gap-[3px] h-6">
                    {[40, 30, 50, 35, 60, 80, 100, 90].map((h, i) => (
                      <div
                        key={i}
                        className="w-[5px] rounded-sm bg-[#1e3a5f]"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
