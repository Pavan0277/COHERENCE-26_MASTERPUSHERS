import { useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useImagePreloader } from '../../../hooks/useImagePreloader';
import { useScrollSequence } from '../../../hooks/useScrollSequence';

const FRAME_COUNT = 120;

const milestones = [
  { start: 0, end: 30, label: 'CAPTURE', description: 'Aggregate leads from every digital touchpoint' },
  { start: 30, end: 60, label: 'NURTURE', description: 'Automate follow-ups and drip campaigns' },
  { start: 60, end: 90, label: 'CONVERT', description: 'Close deals with intelligent pipeline management' },
  { start: 90, end: 120, label: 'GROW', description: 'Scale revenue with data-driven insights' },
];

export default function PlaneMorph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const framePaths = useMemo(
    () =>
      Array.from({ length: FRAME_COUNT }, (_, i) =>
        `/funnel-frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
      ),
    []
  );

  const preloader = useImagePreloader(framePaths);
  const currentFrame = useScrollSequence({ frameCount: FRAME_COUNT, containerRef });

  // Draw current frame on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !preloader.images[currentFrame]) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = preloader.images[currentFrame];
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }, [currentFrame, preloader.images]);

  // Determine active milestone
  const activeMilestone = milestones.findIndex(
    (m) => currentFrame >= m.start && currentFrame < m.end
  );

  return (
    <section className="relative bg-surface-subtle">
      {/* Scroll container - tall to give scroll room */}
      <div ref={containerRef} className="relative" style={{ height: '300vh' }}>
        {/* Sticky inner */}
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="section-container w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left — Text Labels */}
              <div className="space-y-6">
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="text-xs uppercase tracking-ultra-wide text-brand-600 font-semibold"
                >
                  Sales Funnel Journey
                </motion.p>

                <h2 className="text-3xl sm:text-4xl font-bold text-heading leading-tight">
                  Watch your pipeline{' '}
                  <span className="text-brand-600">come alive.</span>
                </h2>

                <p className="text-body leading-relaxed max-w-md">
                  Scroll to see how Velo transforms scattered prospects into a structured,
                  high-converting sales funnel — layer by layer.
                </p>

                {/* Milestone labels */}
                <div className="space-y-3 pt-4">
                  {milestones.map((milestone, index) => (
                    <motion.div
                      key={milestone.label}
                      className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-500 ${
                        activeMilestone === index
                          ? 'bg-white shadow-card border border-brand-100'
                          : 'opacity-40'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${
                          activeMilestone === index
                            ? 'bg-brand-600 text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <span className="text-xs font-bold">{String(index + 1).padStart(2, '0')}</span>
                      </div>
                      <div>
                        <p
                          className={`font-bold text-sm tracking-extra-wide transition-colors duration-500 ${
                            activeMilestone === index ? 'text-heading' : 'text-gray-400'
                          }`}
                        >
                          {milestone.label}
                        </p>
                        <AnimatePresence>
                          {activeMilestone === index && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-xs text-body mt-1"
                            >
                              {milestone.description}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right — Canvas */}
              <div className="relative flex items-center justify-center">
                {!preloader.loaded ? (
                  /* Loading state */
                  <div className="w-full aspect-video flex flex-col items-center justify-center bg-white rounded-2xl shadow-card">
                    <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-brand-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${preloader.progress * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-xs text-body-light mt-3">
                      Loading animation... {Math.round(preloader.progress * 100)}%
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute -inset-8 bg-gradient-radial from-brand-100/30 to-transparent rounded-full blur-2xl" />
                    <canvas
                      ref={canvasRef}
                      className="relative w-full max-w-lg mx-auto rounded-xl"
                      style={{ imageRendering: 'auto' }}
                    />
                    {/* Frame counter */}
                    <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur rounded-lg px-3 py-1.5 shadow-sm">
                      <p className="text-[10px] font-mono text-body-light">
                        {String(currentFrame + 1).padStart(3, '0')} / {FRAME_COUNT}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
