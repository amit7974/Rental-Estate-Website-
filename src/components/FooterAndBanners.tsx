import React, { useState } from 'react';
import { Building2, Phone, Mail, MapPin, ArrowRight, ShieldCheck, HeartHandshake, Award, Headphones, Check } from 'lucide-react';

interface SellingBannerProps {
  onGetValuation: () => void;
}

export const SellingBanner: React.FC<SellingBannerProps> = ({ onGetValuation }) => {
  return (
    <section id="selling-banner" className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
      <div className="relative rounded-3xl overflow-hidden bg-[#0B192C] text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left copy */}
          <div className="p-8 sm:p-12 lg:col-span-7 z-10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400 block mb-2">
              Thinking of Selling?
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
              Get Maximum Value for Your Property
            </h3>
            <p className="text-sm text-slate-300 max-w-lg mb-6 leading-relaxed">
              Our certified local property experts help you price strategically, list with high-converting virtual tours, and sell faster for the best market price.
            </p>
            <button
              id="get-free-valuation-btn"
              onClick={onGetValuation}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white hover:bg-slate-100 text-[#0B192C] rounded-xl text-xs font-extrabold transition-all shadow-md transform hover:-translate-y-0.5"
            >
              <span>Get Free Home Valuation</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </button>
          </div>

          {/* Right Image + Floated Estimate Card matching Reference */}
          <div className="relative lg:col-span-5 h-64 sm:h-80 lg:h-full min-h-[260px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80"
              alt="Living room interior"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%231e293b'/%3E%3C/svg%3E";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-transparent to-[#0B192C]/40" />

            {/* Floating pill card matching reference image */}
            <div className="absolute bottom-6 left-6 sm:left-10 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/50 text-slate-900 max-w-xs animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Home Value Estimate
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-slate-900">$875,000</span>
                    <span className="text-[11px] font-bold text-emerald-600">+12.5% ↑</span>
                  </div>
                  <span className="block text-[10px] text-slate-400">Based on recent market trends</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const WhyChooseUsSection: React.FC = () => {
  const points = [
    {
      icon: MapPin,
      title: 'Local Expertise',
      desc: 'In-depth knowledge of local markets, property values, and neighborhoods.',
    },
    {
      icon: HeartHandshake,
      title: 'Personalized Service',
      desc: 'Tailored real-estate solutions that fit your unique lifestyle and financial needs.',
    },
    {
      icon: Award,
      title: 'Proven Results',
      desc: 'A track record of thousands of successful sales, rentals, and happy clients.',
    },
    {
      icon: Headphones,
      title: 'Full Support',
      desc: 'From initial search to contract closing, our dedicated team is with you all the way.',
    },
  ];

  return (
    <section id="why-choose-us" className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="text-left mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
          Why Choose Us
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          We Make Real Estate Simple
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {points.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-slate-900 mb-1">{p.title}</h5>
                <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export const NewsletterBanner: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section id="newsletter-section" className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      <div className="bg-blue-50/70 border border-blue-100/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-slate-900">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">Stay Updated</h4>
            <p className="text-xs text-slate-500">
              Subscribe to get the latest property listings, market reports, and real estate tips.
            </p>
          </div>
        </div>

        {subscribed ? (
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-4 py-2.5 rounded-xl">
            <Check className="w-4 h-4" />
            <span>Thank you for subscribing! We'll keep you updated.</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full md:w-auto">
            <input
              id="newsletter-email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full md:w-72"
            />
            <button
              id="newsletter-subscribe-btn"
              type="submit"
              className="px-5 py-2.5 bg-[#0B192C] hover:bg-[#1E3E62] text-white rounded-xl text-xs font-bold transition-all shrink-0"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

interface FooterProps {
  onNavigateHome?: () => void;
  onNavigateBuy?: () => void;
  onNavigateRent?: () => void;
  onNavigateSell?: () => void;
  onNavigateFeatured?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onNavigateBuy,
  onNavigateRent,
  onNavigateSell,
  onNavigateFeatured,
}) => {
  return (
    <footer id="footer" className="bg-[#0B192C] text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={onNavigateHome}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">HOMELUXE</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Helping you find the perfect place to call home. Your trusted, modern real estate partner with end-to-end transparency, verified listings, and on-demand walkthrough viewings.
            </p>
            <div className="flex items-center space-x-3 text-slate-400 text-xs font-bold pt-2">
              <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:text-white cursor-pointer transition-colors">FB</span>
              <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:text-white cursor-pointer transition-colors">IG</span>
              <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:text-white cursor-pointer transition-colors">TW</span>
              <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:text-white cursor-pointer transition-colors">IN</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Quick Links</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={onNavigateHome} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={onNavigateBuy} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Buy Properties
                </button>
              </li>
              <li>
                <button 
                  onClick={onNavigateRent} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Rent Properties
                </button>
              </li>
              <li>
                <button 
                  onClick={onNavigateSell} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Sell With Us
                </button>
              </li>
              <li>
                <button 
                  onClick={onNavigateFeatured} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Featured Listings
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Resources</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={onNavigateSell} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Home Valuation
                </button>
              </li>
              <li>
                <button 
                  onClick={onNavigateBuy} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Buyer's Guide
                </button>
              </li>
              <li>
                <button 
                  onClick={onNavigateSell} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Seller's Guide
                </button>
              </li>
              <li>
                <button 
                  onClick={onNavigateFeatured} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Explore Catalog
                </button>
              </li>
              <li>
                <a 
                  href="tel:8001234567" 
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Contact Concierge
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Contact Us</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>(800) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>info@homeluxe.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>123 Real Estate Blvd, Suite 100, Los Angeles, CA 90001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 HomeLuxe Real Estate. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
