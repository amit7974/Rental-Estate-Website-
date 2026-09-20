import React from 'react';
import { Property } from '../types';
import { 
  Bed, 
  Bath, 
  Maximize2, 
  MapPin, 
  Heart, 
  Eye, 
  Edit3, 
  Trash2,
  Calendar
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelect: (prop: Property) => void;
  onBookViewing?: (prop: Property) => void;
  onEdit?: (prop: Property) => void;
  onDelete?: (propId: string) => void;
  isOwner?: boolean;
}

const getCategoryFallbackImage = (category?: string) => {
  if (category === 'Apartment') {
    return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';
  }
  if (category === 'Plot') {
    return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80';
  }
  return 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
};

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onBookViewing,
  onEdit,
  onDelete,
  isOwner = false,
}) => {
  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);

    return type === 'rent' ? `${formatted} /mo` : formatted;
  };

  const propertyImage = property.imageUrl?.trim() || getCategoryFallbackImage(property.category);

  return (
    <div 
      id={`property-card-${property.id}`}
      className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-lg transition-shadow duration-200 flex flex-col overflow-hidden relative"
    >
      {/* Property Image Container */}
      <div 
        className="relative w-full h-56 bg-slate-100 overflow-hidden cursor-pointer" 
        onClick={() => onSelect(property)}
      >
        <img
          src={propertyImage}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover select-none"
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            const fallback = getCategoryFallbackImage(property.category);
            if (target.src !== fallback) {
              target.src = fallback;
            }
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-10">
          <span 
            className={`px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider text-white shadow-md ${
              property.listingType === 'rent' ? 'bg-emerald-600' : 'bg-blue-600'
            }`}
          >
            {property.listingType === 'rent' ? 'FOR RENT' : 'FOR SALE'}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-xs text-white">
            {property.category}
          </span>
        </div>

        {/* Favorite Icon (Visual Polish) */}
        <button
          type="button"
          aria-label="Save Property"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 hover:text-red-500 flex items-center justify-center shadow-md transition-colors"
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Subtle Bottom Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Property Info Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price */}
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-2xl font-extrabold text-[#0B192C] tracking-tight">
              {formatPrice(property.price, property.listingType)}
            </span>
          </div>

          {/* Title */}
          <h4 
            onClick={() => onSelect(property)}
            className="text-base font-bold text-slate-800 hover:text-blue-600 transition-colors cursor-pointer line-clamp-1 mb-1"
          >
            {property.title}
          </h4>

          {/* Address / Location */}
          <p className="flex items-center text-xs text-slate-500 gap-1 mb-4 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{property.address ? `${property.address}, ` : ''}{property.location}</span>
          </p>

          {/* Key Specs Bar (Beds / Baths / SqFt) */}
          <div className="flex items-center justify-between py-3 px-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs font-semibold text-slate-600 mb-4">
            {property.category !== 'Plot' ? (
              <>
                <div className="flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-slate-400" />
                  <span>{property.beds ?? 0} Beds</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bath className="w-4 h-4 text-slate-400" />
                  <span>{property.baths ?? 0} Baths</span>
                </div>
              </>
            ) : (
              <div className="text-xs text-slate-500 font-medium italic">
                Prime Residential Land
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-slate-400" />
              <span>{property.sqft.toLocaleString()} Sq Ft</span>
            </div>
          </div>
        </div>

        {/* Actions / View Details & Book Viewing */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          {isOwner ? (
            <div className="flex items-center justify-between w-full">
              <button
                id={`edit-property-btn-${property.id}`}
                onClick={() => onEdit && onEdit(property)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-[#0B192C] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              
              <button
                id={`delete-property-btn-${property.id}`}
                onClick={() => onDelete && onDelete(property.id)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <button
                onClick={() => onSelect(property)}
                className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-white bg-[#0B192C] rounded-lg hover:bg-[#1E3E62] transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </button>
            </div>
          ) : (
            <>
              <button
                id={`view-details-btn-${property.id}`}
                onClick={() => onSelect(property)}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors text-center flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>Details</span>
              </button>

              {onBookViewing && (
                <button
                  id={`book-viewing-btn-${property.id}`}
                  onClick={() => onBookViewing(property)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold transition-all shadow-xs text-center flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>Book Tour</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
