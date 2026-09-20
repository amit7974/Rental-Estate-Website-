import React, { useState, useEffect } from 'react';
import { Property, PropertyCategory, ListingType } from '../types';
import { useAuth } from '../context/AuthContext';
import { X, Upload, DollarSign, MapPin, Sparkles, Building, Check, Image as ImageIcon } from 'lucide-react';

interface SellPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitProperty: (propertyData: any, existingId?: string) => Promise<void>;
  editingProperty: Property | null;
}

const SAMPLE_PROPERTY_IMAGES = [
  { label: 'Modern Villa with Pool', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Suburban Cedar House', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Highrise Urban Apartment', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Oceanfront Luxury Villa', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80' },
  { label: 'City Penthouse Flat', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Scenic Prime Land Plot', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80' },
];

export const SellPropertyModal: React.FC<SellPropertyModalProps> = ({
  isOpen,
  onClose,
  onSubmitProperty,
  editingProperty,
}) => {
  const { user, userProfile } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PropertyCategory>('House');
  const [listingType, setListingType] = useState<ListingType>('sale');
  const [price, setPrice] = useState<number | ''>('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [beds, setBeds] = useState<number | ''>(3);
  const [baths, setBaths] = useState<number | ''>(2);
  const [sqft, setSqft] = useState<number | ''>(1800);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [featuresStr, setFeaturesStr] = useState('Parking Garage, Central AC, Modern Kitchen');
  const [contactPhone, setContactPhone] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Populate when editing
  useEffect(() => {
    if (editingProperty) {
      setTitle(editingProperty.title);
      setCategory(editingProperty.category);
      setListingType(editingProperty.listingType);
      setPrice(editingProperty.price);
      setLocation(editingProperty.location);
      setAddress(editingProperty.address || '');
      setCity(editingProperty.city || '');
      setBeds(editingProperty.beds ?? '');
      setBaths(editingProperty.baths ?? '');
      setSqft(editingProperty.sqft);
      setImageUrl(editingProperty.imageUrl);
      setDescription(editingProperty.description);
      setFeaturesStr(editingProperty.features ? editingProperty.features.join(', ') : '');
      setContactPhone(editingProperty.sellerPhone || '');
    } else {
      // Defaults for new property
      setTitle('');
      setCategory('House');
      setListingType('sale');
      setPrice('');
      setLocation('');
      setAddress('');
      setCity('');
      setBeds(3);
      setBaths(2);
      setSqft(1800);
      setImageUrl(SAMPLE_PROPERTY_IMAGES[0].url);
      setDescription('');
      setFeaturesStr('Balcony, Smart Home, Security System, Garage');
      setContactPhone('');
    }
  }, [editingProperty, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter a property title.');
      return;
    }
    if (!price || Number(price) <= 0) {
      setError('Please provide a valid price.');
      return;
    }
    if (!location.trim()) {
      setError('Please provide a city/neighborhood location.');
      return;
    }
    if (!imageUrl.trim()) {
      setError('Please provide an image URL for the property.');
      return;
    }

    setSubmitting(true);
    try {
      const featuresArray = featuresStr
        .split(',')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const propertyData = {
        title,
        category,
        listingType,
        price: Number(price),
        location,
        address: address || location,
        city: city || location.split(',')[0].trim(),
        beds: category === 'Plot' ? 0 : Number(beds) || 0,
        baths: category === 'Plot' ? 0 : Number(baths) || 0,
        sqft: Number(sqft) || 1000,
        imageUrl,
        description,
        features: featuresArray,
        sellerId: user ? user.uid : 'anonymous-user',
        sellerName: userProfile?.displayName || user?.email?.split('@')[0] || 'Property Owner',
        sellerEmail: user?.email || 'owner@homeluxe.com',
        sellerPhone: contactPhone || '(800) 123-4567',
        updatedAt: Date.now(),
      };

      await onSubmitProperty(propertyData, editingProperty ? editingProperty.id : undefined);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save property. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="sell-property-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="sell-property-modal"
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="bg-[#0B192C] px-6 sm:px-8 py-6 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Building className="w-3.5 h-3.5" />
              <span>{editingProperty ? 'Edit Property Listing' : 'List a New Property'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              {editingProperty ? 'Update Property Information' : 'Sell or Rent Your Property'}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Provide complete details, set your pricing, and attract verified buyers worldwide.
            </p>
          </div>

          <button
            id="close-sell-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Core Categorization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['House', 'Apartment', 'Plot'] as PropertyCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                      category === cat
                        ? 'bg-[#0B192C] text-white border-[#0B192C] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Listing Type *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setListingType('sale')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                    listingType === 'sale'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  For Sale
                </button>
                <button
                  type="button"
                  onClick={() => setListingType('rent')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                    listingType === 'rent'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  For Rent
                </button>
              </div>
            </div>
          </div>

          {/* Title & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Property Title / Name *
              </label>
              <input
                id="property-title-input"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Modern Glass Villa with Infinity Pool"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Price ({listingType === 'rent' ? '$/month' : 'USD'}) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="property-price-input"
                  type="number"
                  required
                  min={1}
                  value={price}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                  placeholder={listingType === 'rent' ? '2800' : '750000'}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Location & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                General Location / Region (e.g. Austin, TX 78701) *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="property-location-input"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Austin, TX 78701"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Street Address (e.g. 456 Oak Avenue)
              </label>
              <input
                id="property-address-input"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="456 Oak Avenue"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Basic Property Dimensions (Beds, Baths, SqFt) */}
          <div className="grid grid-cols-3 gap-4">
            {category !== 'Plot' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Bedrooms
                  </label>
                  <input
                    id="property-beds-input"
                    type="number"
                    min={0}
                    value={beds}
                    onChange={(e) => setBeds(e.target.value ? Number(e.target.value) : '')}
                    placeholder="3"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Bathrooms
                  </label>
                  <input
                    id="property-baths-input"
                    type="number"
                    min={0}
                    value={baths}
                    onChange={(e) => setBaths(e.target.value ? Number(e.target.value) : '')}
                    placeholder="2"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </>
            ) : (
              <div className="col-span-2 flex items-center text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                Plots and land lots are measured by lot square footage without internal room counts.
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Area (Sq Ft) *
              </label>
              <input
                id="property-sqft-input"
                type="number"
                required
                min={10}
                value={sqft}
                onChange={(e) => setSqft(e.target.value ? Number(e.target.value) : '')}
                placeholder="1850"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Image URL with Preset Pickers */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Property Image URL *
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="property-image-url-input"
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            {/* Quick sample image pickers */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                Or pick from curated high-resolution photography:
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_PROPERTY_IMAGES.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImageUrl(img.url)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                      imageUrl === img.url
                        ? 'bg-blue-50 border-blue-400 text-blue-700 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {img.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Preview */}
            {imageUrl && (
              <div className="mt-3 relative rounded-xl overflow-hidden h-36 bg-slate-100 border border-slate-200">
                <img
                  src={imageUrl}
                  alt="Property preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-[10px] text-white px-2 py-0.5 rounded-md font-semibold">
                  Preview
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Property Description
            </label>
            <textarea
              id="property-description-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Highlight special architectural elements, renovations, proximity to schools, transit, and scenic views..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white resize-none"
            />
          </div>

          {/* Features / Amenities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Features & Amenities (comma separated)
              </label>
              <input
                id="property-features-input"
                type="text"
                value={featuresStr}
                onChange={(e) => setFeaturesStr(e.target.value)}
                placeholder="Pool, Garage, Smart Home, Garden"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contact Phone for Inquiries
              </label>
              <input
                id="property-phone-input"
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="(800) 123-4567"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-property-listing-btn"
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-[#0B192C] hover:bg-[#1E3E62] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-blue-400" />
              <span>{submitting ? 'Saving Property...' : editingProperty ? 'Save Changes' : 'Publish Property Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
