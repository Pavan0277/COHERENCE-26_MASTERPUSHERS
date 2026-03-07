import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import AnimatedSection from '../../../components/AnimatedSection';

export default function CTASection() {
  return (
    <section id="cta" className="section-padding bg-white relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-brand-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative z-10">
        <AnimatedSection>
          <div className="relative bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 rounded-3xl p-10 md:p-16 lg:p-20 text-center overflow-hidden">
            {/* Inner decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-6"
              >
                <Sparkles size={24} className="text-white" />
              </motion.div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight max-w-xl mx-auto">
                Ready to start growing?
              </h2>

              <p className="mt-4 text-brand-100 text-lg leading-relaxed max-w-md mx-auto">
                Join thousands of teams already using Velo to capture more leads
                and close more deals.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-10 py-4 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm tracking-wide group"
                >
                  Get Started Free
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-10 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 text-sm tracking-wide"
                >
                  Sign In
                </Link>
              </div>

              <p className="mt-6 text-brand-200 text-xs">
                No credit card required · 14-day free trial · Cancel anytime
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
