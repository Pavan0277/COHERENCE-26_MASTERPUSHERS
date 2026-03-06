import { Link } from 'react-router-dom';

const footerLinks = {
  Product: ['Overview', 'Features', 'Pricing', 'Integrations', 'API', 'Changelog'],
  'Why Velo': ['Customer Stories', 'Testimonials', 'Case Studies', 'ROI Calculator'],
  Company: ['About Us', 'Blog', 'Careers', 'Press', 'Contact', 'Partners'],
};

const legalLinks = ['Privacy Policy', 'Terms of Service', 'GDPR', 'Cookie Policy'];

export default function Footer() {
  return (
    <footer className="bg-[#0D0D1A] text-gray-400 relative">
      <div className="section-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 group mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Velo
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-gray-500">
              The all-in-one CRM platform designed to help modern teams capture,
              nurture, and convert leads at scale.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4 tracking-wide">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider & bottom */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} Velo. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              {legalLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
