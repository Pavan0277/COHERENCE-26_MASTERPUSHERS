import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Service', href: '#features' },
  { label: 'Support', href: '#usecases' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/60 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-[22px] font-bold text-[#1e3a5f] tracking-[-0.01em]">Velo</span>
          </Link>

          {/* Right side: nav links + auth */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="text-[15px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </button>
            ))}
            <Link
              to="/login"
              className="text-[15px] font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-[14px] font-semibold text-white bg-[#1e3a5f] hover:bg-[#16304f] px-6 py-2.5 rounded-lg transition-colors"
            >
              Sign up
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="text-[15px] font-medium text-gray-600 hover:text-gray-900 text-left py-3 px-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <hr className="border-gray-100 my-2" />
              <Link to="/login" className="text-[15px] font-medium text-gray-700 py-3 px-3">Login</Link>
              <Link to="/register" className="text-[14px] font-semibold text-white bg-[#1e3a5f] text-center py-3 rounded-lg mt-1">
                Sign up
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
