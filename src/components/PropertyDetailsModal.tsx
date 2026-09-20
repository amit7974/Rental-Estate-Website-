import React, { useState } from 'react';
import { Property } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Share2, 
  ShieldCheck,
  Check
} from 'lucide-react';

interface PropertyDetailsModalProps {
  property: Property | null;
  onClose: () => void;
  onBookViewing: (bookingData: any) => Promise<void>;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  property,
  onClose,
  onBookViewing,
}) => {
  const { user } = useAuth();
  
  // Booking Form State
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [visitorName, setVisitorName] = useState(user?.displayName || '');
  const [visitorEmail, setVisitorEmail] = useState(user?.email || '');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  React.useEffect(() => {
    if (property) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [property]);

  if (!property) return null;

  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
    return type === 'rent' ? `${formatted} / month` : formatted;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate) {
      setErrorMessage('Please pick a date for the property viewing.');
      return;
    }
    if (!visitorName.trim() || !visitorEmail.trim() || !visitorPhone.trim()) {
      setErrorMessage('Please fill in your name, email, and phone number.');
      return;
    }

    setBookingStatus('submitting');
    setErrorMessage('');

    try {
      await onBookViewing({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyLocation: property.location,
        propertyImage: property.imageUrl,
        propertyPrice: property.price,
        userId: user ? user.uid : null,
        userName: visitorName,
        userEmail: visitorEmail,
        userPhone: visitorPhone,
        date: bookingDate,
        time: bookingTime,
        notes: bookingNotes,
        sellerId: property.sellerId,
        status: 'confirmed',
        createdAt: Date.now(),
      });
      setBookingStatus('success');
    } catch (err: any) {
      console.error(err);
      setBookingStatus('error');
      setErrorMessage(err.message || 'Failed to submit booking. Please check database permissions.');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Set min date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div 
      id="property-details-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="property-details-container"
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold uppercase ${
              property.listingType === 'rent' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {property.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              title="Copy share link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>

            <button
              id="close-property-details-btn"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Main Visual & Title */}
          <div>
            <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 w-full shadow-inner bg-slate-100">
              <img
                src={property.imageUrl?.trim() || (property.category === 'Apartment' ? 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80' : property.category === 'Plot' ? 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80' : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80')}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = property.category === 'Apartment'
                    ? 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
                    : property.category === 'Plot'
                    ? 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
                    : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-slate-950/80 backdrop-blur-md px-5 py-3 rounded-2xl text-white">
                <span className="text-xs font-medium text-slate-300 block uppercase tracking-wider">Listed Price</span>
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {formatPrice(property.price, property.listingType)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {property.title}
                </h2>
                <p className="flex items-center gap-1.5 text-sm text-slate-600 mt-1">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{property.address ? `${property.address}, ` : ''}{property.location}</span>
                </p>
              </div>

              {/* Specs Badge Strip */}
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-slate-700">
                {property.category !== 'Plot' && (
                  <>
                    <div className="text-center px-2">
                      <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-900">
                        <Bed className="w-4 h-4 text-slate-500" />
                        <span>{property.beds ?? 0}</span>
                      </div>
                      <span className="text-[10px] uppercase font-semibold text-slate-500">Beds</span>
                    </div>
                    <div className="w-px h-6 bg-slate-200" />
                    <div className="text-center px-2">
                      <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-900">
                        <Bath className="w-4 h-4 text-slate-500" />
                        <span>{property.baths ?? 0}</span>
                      </div>
                      <span className="text-[10px] uppercase font-semibold text-slate-500">Baths</span>
                    </div>
                    <div className="w-px h-6 bg-slate-200" />
                  </>
                )}
                <div className="text-center px-2">
                  <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-900">
                    <Maximize2 className="w-4 h-4 text-slate-500" />
                    <span>{property.sqft.toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500">Sq Ft</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Layout: Description & Viewing Booking Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Col: Overview & Features */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-2">
                  Property Description
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {property.description || 'No detailed description provided for this listing.'}
                </p>
              </div>

              {property.features && property.features.length > 0 && (
                <div>
                  <h4 className="text-base font-bold text-slate-900 mb-3">
                    Key Amenities & Highlights
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {property.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agent / Seller Profile Card */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                  Listing Agent / Owner
                </span>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#0B192C] text-white flex items-center justify-center font-bold text-sm">
                      {property.sellerName ? property.sellerName[0] : 'A'}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">{property.sellerName || 'Verified Agent'}</h5>
                      <p className="text-xs text-slate-500">{property.sellerEmail}</p>
                    </div>
                  </div>
                  {property.sellerPhone && (
                    <a
                      href={`tel:${property.sellerPhone}`}
                      className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-800 rounded-xl flex items-center gap-1.5 shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>{property.sellerPhone}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Col: Booking Form */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-lg relative">
              <div className="flex items-center gap-2 text-blue-600 mb-1 font-bold text-xs uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>Schedule a Private Tour</span>
              </div>
              <h4 className="text-xl font-extrabold text-slate-900 mb-1">
                Book a Property Viewing
              </h4>
              <p className="text-xs text-slate-500 mb-5">
                Pick your preferred date and time to inspect this property in person or via live video walk-through.
              </p>

              {bookingStatus === 'success' ? (
                <div id="booking-success-message" className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center animate-fadeIn">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h5 className="text-base font-bold text-emerald-900 mb-1">
                    Viewing Scheduled!
                  </h5>
                  <p className="text-xs text-emerald-700 mb-4">
                    Your appointment for <strong>{bookingDate}</strong> at <strong>{bookingTime}</strong> has been saved. The owner has been notified.
                  </p>
                  <button
                    type="button"
                    onClick={() => setBookingStatus('idle')}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline"
                  >
                    Schedule another time
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Date *
                      </label>
                      <input
                        id="booking-date-input"
                        type="date"
                        min={today}
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Preferred Time *
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <select
                          id="booking-time-select"
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                        >
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="11:30 AM">11:30 AM</option>
                          <option value="01:00 PM">01:00 PM</option>
                          <option value="02:30 PM">02:30 PM</option>
                          <option value="04:00 PM">04:00 PM</option>
                          <option value="05:30 PM">05:30 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        id="booking-name-input"
                        type="text"
                        required
                        placeholder="John Smith"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        id="booking-email-input"
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={visitorEmail}
                        onChange={(e) => setVisitorEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        id="booking-phone-input"
                        type="tel"
                        required
                        placeholder="(555) 000-1234"
                        value={visitorPhone}
                        onChange={(e) => setVisitorPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Special Notes (Optional)
                    </label>
                    <textarea
                      id="booking-notes-input"
                      rows={2}
                      placeholder="e.g. Inquiring about financing or video tour request"
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white resize-none"
                    />
                  </div>

                  <button
                    id="submit-booking-viewing-btn"
                    type="submit"
                    disabled={bookingStatus === 'submitting'}
                    className="w-full py-3 bg-[#0B192C] hover:bg-[#1E3E62] text-white rounded-xl text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>{bookingStatus === 'submitting' ? 'Booking Tour...' : 'Confirm Viewing Appointment'}</span>
                  </button>

                  <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>No deposit required • Free instant cancellation</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
