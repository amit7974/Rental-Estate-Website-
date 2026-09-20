import React from 'react';
import { ViewingBooking } from '../types';
import { Calendar, Clock, MapPin, DollarSign, User, Mail, Phone, CheckCircle2, Trash2, ExternalLink } from 'lucide-react';

interface BookingsViewProps {
  bookings: ViewingBooking[];
  onCancelBooking: (bookingId: string) => Promise<void>;
  onViewProperty: (propertyId: string) => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  onCancelBooking,
  onViewProperty,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div id="user-bookings-section" className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Tour Appointments</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Scheduled Property Viewings
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Keep track of your private tours and in-person walkthrough appointments.
          </p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-xl mx-auto px-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No Viewings Scheduled Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            Browse our listings of houses, apartments, and residential plots to schedule your first in-person or virtual walkthrough tour.
          </p>
          <a
            href="#featured-properties"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B192C] hover:bg-[#1E3E62] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <span>Explore Properties</span>
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              id={`booking-card-${booking.id}`}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              {/* Property Image Header */}
              <div className="relative h-44 w-full bg-slate-100">
                <img
                  src={booking.propertyImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
                  alt={booking.propertyTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23e2e8f0'/%3E%3Ctext x='400' y='300' font-family='sans-serif' font-size='20' font-weight='bold' fill='%2364748b' text-anchor='middle'%3EProperty Image%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{booking.status}</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                  {formatPrice(booking.propertyPrice)}
                </div>
              </div>

              {/* Booking & Property Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base line-clamp-1">
                      {booking.propertyTitle}
                    </h4>
                    <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{booking.propertyLocation}</span>
                    </p>
                  </div>

                  {/* Scheduled Date & Time highlight */}
                  <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 flex items-center justify-between text-blue-900">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <div>
                        <span className="block text-xs font-extrabold">{booking.date}</span>
                        <span className="block text-[10px] text-blue-700 font-medium">{booking.time}</span>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold bg-blue-200/60 px-2 py-0.5 rounded text-blue-800">
                      Confirmed
                    </span>
                  </div>

                  {/* Visitor Contact Info */}
                  <div className="text-xs text-slate-600 space-y-1 pt-1">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{booking.userName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{booking.userEmail}</span>
                    </div>
                    {booking.userPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{booking.userPhone}</span>
                      </div>
                    )}
                  </div>

                  {booking.notes && (
                    <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg italic">
                      "{booking.notes}"
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onViewProperty(booking.propertyId)}
                    className="flex-1 text-xs font-bold text-slate-700 hover:text-blue-600 py-1.5 px-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Property</span>
                  </button>

                  <button
                    id={`cancel-booking-btn-${booking.id}`}
                    onClick={() => onCancelBooking(booking.id)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-800 py-1.5 px-3 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
