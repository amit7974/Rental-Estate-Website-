import React from 'react';
import { Home, Users, ShieldCheck, Tag, ArrowRight, Play, TrendingUp, Building2 } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onSellClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onSellClick,
}) => {
  return (
    <section id="hero-section" className="relative w-full overflow-hidden bg-slate-900 text-white">
      {/* Background Hero Image with Deep Contrast Overlay matching the reference */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85"
          alt="Modern Architecture Estate"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-90"
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'%3E%3Crect width='1200' height='800' fill='%230b192c'/%3E%3C/svg%3E";
          }}
        />
        {/* Gradients mirroring reference design (left-to-right dark gradient for text clarity) */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-28 sm:pb-36 flex flex-col justify-center">
        <div className="max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span>Premium Verified Real Estate</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Find Your <br />
            <span className="text-white">Perfect </span>
            <span className="text-blue-400 underline decoration-blue-500/40 underline-offset-8">Home</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed">
            Discover exceptional properties and unlock the door to your dream home with transparent verified listings and private walkthrough viewings.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              id="hero-explore-btn"
              onClick={onExploreClick}
              className="flex items-center space-x-2.5 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore Properties</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-how-it-works-btn"
              onClick={onSellClick}
              className="flex items-center space-x-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 text-sm font-bold rounded-xl transition-all"
            >
              <Play className="w-4 h-4 fill-white text-white" />
              <span>How It Works</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const TrustFeaturesStrip: React.FC = () => {
  const features = [
    {
      icon: Home,
      title: 'Find The Perfect Home',
      desc: 'Browse thousands of verified listings that match your needs.',
      badgeColor: 'bg-blue-900/40 text-blue-400',
    },
    {
      icon: Users,
      title: 'Expert Agents',
      desc: 'Work with experienced agents who guide you at every step.',
      badgeColor: 'bg-indigo-900/40 text-indigo-400',
    },
    {
      icon: ShieldCheck,
      title: 'Trusted & Secure',
      desc: 'Transparent process and secure property transactions.',
      badgeColor: 'bg-emerald-900/40 text-emerald-400',
    },
    {
      icon: Tag,
      title: 'Best Deals',
      desc: 'Get the best value with exclusive property deals.',
      badgeColor: 'bg-amber-900/40 text-amber-400',
    },
  ];

  return (
    <section id="trust-features-strip" className="max-w-7xl mx-auto px-4 sm:px-8 py-10 pt-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-start space-x-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#0B192C] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Icon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
