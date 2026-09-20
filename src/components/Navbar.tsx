import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Phone, 
  Star, 
  Tag, 
  Menu, 
  X, 
  PlusCircle, 
  LogOut, 
  User as UserIcon, 
  CalendarCheck,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'browse' | 'sell' | 'manage' | 'bookings';
  setActiveTab: (tab: 'browse' | 'sell' | 'manage' | 'bookings') => void;
  onOpenSellModal: () => void;
  onViewAll?: () => void;
  onFilterBuy?: () => void;
  onFilterRent?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenSellModal,
  onViewAll,
  onFilterBuy,
  onFilterRent,
}) => {
  const { user, userProfile, logout, setAuthModalOpen, setAuthMode } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleSellClick = () => {
    if (!user) {
      handleOpenAuth('signin');
    } else {
      onOpenSellModal();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs">
      {/* Top Utility Bar */}
      <div className="bg-[#0B192C] text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Trusted by 10,000+ Clients
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="text-slate-200">5 Star Rated Agency</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors">
              <Tag className="w-3.5 h-3.5 text-blue-400" />
              Free Property Valuation
            </span>
          </div>

          <div className="flex items-center space-x-5 text-slate-300">
            <a 
              href="tel:8001234567" 
              className="flex items-center gap-1.5 hover:text-white font-medium"
            >
              <Phone className="w-3 h-3 text-blue-400" />
              (800) 123-4567
            </a>
            <div className="flex items-center space-x-2 text-slate-400">
              <span className="hover:text-white cursor-pointer transition-colors text-xs font-semibold">FB</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer transition-colors text-xs font-semibold">IG</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer transition-colors text-xs font-semibold">IN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          id="brand-logo"
          onClick={() => {
            if (onViewAll) {
              onViewAll();
            } else {
              setActiveTab('browse');
            }
          }}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0B192C] text-white flex items-center justify-center shadow-md group-hover:bg-[#1E3E62] transition-colors">
            <Building2 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-[#0B192C] flex items-center">
              HOMELUXE
            </span>
            <span className="block text-[10px] tracking-widest uppercase font-semibold text-slate-500 -mt-1">
              REAL ESTATE
            </span>
          </div>
        </div>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-slate-600">
          <button
            id="nav-home-btn"
            onClick={() => {
              if (onViewAll) {
                onViewAll();
              } else {
                setActiveTab('browse');
              }
            }}
            className={`transition-colors relative py-1 cursor-pointer ${
              activeTab === 'browse' ? 'text-[#0B192C] font-bold' : 'hover:text-[#0B192C]'
            }`}
          >
            Home
            {activeTab === 'browse' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0B192C] rounded-full" />
            )}
          </button>

          <button 
            id="nav-buy-btn"
            type="button"
            onClick={() => {
              if (onFilterBuy) {
                onFilterBuy();
              } else {
                setActiveTab('browse');
              }
            }}
            className="hover:text-[#0B192C] transition-colors cursor-pointer py-1 font-semibold"
          >
            Buy
          </button>

          <button 
            id="nav-rent-btn"
            type="button"
            onClick={() => {
              if (onFilterRent) {
                onFilterRent();
              } else {
                setActiveTab('browse');
              }
            }}
            className="hover:text-[#0B192C] transition-colors cursor-pointer py-1 font-semibold"
          >
            Rent
          </button>

          <button
            id="nav-sell-tab-btn"
            onClick={handleSellClick}
            className={`transition-colors ${
              activeTab === 'sell' ? 'text-[#0B192C] font-bold' : 'hover:text-[#0B192C]'
            }`}
          >
            Sell
          </button>

          {user && (
            <>
              <button
                id="nav-manage-properties-btn"
                onClick={() => setActiveTab('manage')}
                className={`transition-colors relative py-1 ${
                  activeTab === 'manage' ? 'text-[#0B192C] font-bold' : 'hover:text-[#0B192C]'
                }`}
              >
                My Listings
                {activeTab === 'manage' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0B192C] rounded-full" />
                )}
              </button>

              <button
                id="nav-bookings-btn"
                onClick={() => setActiveTab('bookings')}
                className={`transition-colors relative py-1 flex items-center gap-1.5 ${
                  activeTab === 'bookings' ? 'text-[#0B192C] font-bold' : 'hover:text-[#0B192C]'
                }`}
              >
                <CalendarCheck className="w-4 h-4 text-blue-600" />
                Viewings
                {activeTab === 'bookings' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0B192C] rounded-full" />
                )}
              </button>
            </>
          )}

          <a 
            href="#why-choose-us" 
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('why-choose-us')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-[#0B192C] transition-colors"
          >
            About Us
          </a>
        </nav>

        {/* Right CTA / Auth Controls */}
        <div className="hidden sm:flex items-center space-x-3">
          {user ? (
            <div className="relative">
              <button
                id="user-profile-menu-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2.5 px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 transition-colors"
              >
                <img
                  src={userProfile?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.displayName || 'User')}`}
                  alt="Avatar"
                  className="w-7 h-7 rounded-full object-cover border border-white"
                />
                <span className="text-xs font-bold text-slate-800 max-w-[110px] truncate">
                  {userProfile?.displayName || user.email?.split('@')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {userDropdownOpen && (
                <div 
                  id="user-dropdown-menu"
                  className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100 text-xs text-slate-500">
                    Signed in as <br />
                    <strong className="text-slate-800 break-all">{user.email}</strong>
                  </div>

                  <button
                    id="menu-my-properties-btn"
                    onClick={() => {
                      setActiveTab('manage');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Listed Properties</span>
                  </button>

                  <button
                    id="menu-my-bookings-btn"
                    onClick={() => {
                      setActiveTab('bookings');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <CalendarCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Scheduled Viewings</span>
                  </button>

                  <button
                    id="menu-logout-btn"
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center space-x-2 border-t border-slate-100 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                id="signin-nav-btn"
                onClick={() => handleOpenAuth('signin')}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-[#0B192C] transition-colors"
              >
                Sign In
              </button>
              <button
                id="signup-nav-btn"
                onClick={() => handleOpenAuth('signup')}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all shadow-xs"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* List Your Property Button */}
          <button
            id="list-property-cta-btn"
            onClick={handleSellClick}
            className="flex items-center space-x-2 px-4 py-2 bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>List Your Property</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="lg:hidden flex items-center space-x-2">
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden border-t border-slate-100 bg-white px-5 py-4 space-y-3">
          <button
            onClick={() => {
              if (onViewAll) {
                onViewAll();
              } else {
                setActiveTab('browse');
              }
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 font-semibold text-slate-800 text-sm"
          >
            Home / All Properties
          </button>

          <button
            onClick={() => {
              if (onFilterBuy) {
                onFilterBuy();
              } else {
                setActiveTab('browse');
              }
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 font-semibold text-slate-800 text-sm"
          >
            Buy Properties
          </button>

          <button
            onClick={() => {
              if (onFilterRent) {
                onFilterRent();
              } else {
                setActiveTab('browse');
              }
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 font-semibold text-slate-800 text-sm"
          >
            Rent Properties
          </button>
          
          <button
            onClick={() => {
              handleSellClick();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 font-semibold text-slate-800 text-sm"
          >
            Sell Property
          </button>

          {user && (
            <>
              <button
                onClick={() => {
                  setActiveTab('manage');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 font-semibold text-slate-800 text-sm"
              >
                My Listings
              </button>
              <button
                onClick={() => {
                  setActiveTab('bookings');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 font-semibold text-slate-800 text-sm"
              >
                Scheduled Viewings
              </button>
            </>
          )}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 text-xs font-bold text-red-600 bg-red-50 rounded-xl"
              >
                Sign Out ({user.email})
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOpenAuth('signin')}
                  className="py-2.5 text-xs font-bold text-slate-800 bg-slate-100 rounded-xl text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleOpenAuth('signup')}
                  className="py-2.5 text-xs font-bold text-white bg-[#0B192C] rounded-xl text-center"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
