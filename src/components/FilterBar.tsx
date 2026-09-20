import React, { useState } from 'react';
import { PropertyCategory, ListingType } from '../types';
import { Search, MapPin, Home, Building, Layers, DollarSign, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  categoryFilter: 'All' | PropertyCategory;
  setCategoryFilter: (cat: 'All' | PropertyCategory) => void;
  listingTypeFilter: 'all' | ListingType;
  setListingTypeFilter: (type: 'all' | ListingType) => void;
  searchLocation: string;
  setSearchLocation: (loc: string) => void;
  priceRange: string;
  setPriceRange: (range: string) => void;
  bedsFilter: string;
  setBedsFilter: (beds: string) => void;
  bathsFilter: string;
  setBathsFilter: (baths: string) => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categoryFilter,
  setCategoryFilter,
  listingTypeFilter,
  setListingTypeFilter,
  searchLocation,
  setSearchLocation,
  priceRange,
  setPriceRange,
  bedsFilter,
  setBedsFilter,
  bathsFilter,
  setBathsFilter,
  onResetFilters,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div id="filter-bar-container" className="w-full max-w-5xl mx-auto -mt-10 sm:-mt-12 relative z-20 px-4">
      {/* Listing Type Toggle Tabs (Buy / Rent / All) matching reference */}
      <div className="flex items-center space-x-1 mb-2">
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-t-2xl shadow-sm border-t border-x border-slate-200/80 inline-flex items-center gap-1">
          <button
            id="tab-listing-buy"
            type="button"
            onClick={() => setListingTypeFilter('sale')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              listingTypeFilter === 'sale'
                ? 'bg-[#0B192C] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Buy
          </button>
          <button
            id="tab-listing-rent"
            type="button"
            onClick={() => setListingTypeFilter('rent')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              listingTypeFilter === 'rent'
                ? 'bg-[#0B192C] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Rent
          </button>
          <button
            id="tab-listing-all"
            type="button"
            onClick={() => setListingTypeFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              listingTypeFilter === 'all'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Types
          </button>
        </div>
      </div>

      {/* Main Search Panel */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 p-4 sm:p-6 transition-all">
        {/* Category Pills (House, Apartment, Plot) as mandated */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
              Category:
            </span>
            <button
              id="filter-cat-all"
              type="button"
              onClick={() => setCategoryFilter('All')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                categoryFilter === 'All'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              id="filter-cat-house"
              type="button"
              onClick={() => setCategoryFilter('House')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                categoryFilter === 'House'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>House</span>
            </button>
            <button
              id="filter-cat-apartment"
              type="button"
              onClick={() => setCategoryFilter('Apartment')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                categoryFilter === 'Apartment'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Apartment</span>
            </button>
            <button
              id="filter-cat-plot"
              type="button"
              onClick={() => setCategoryFilter('Plot')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                categoryFilter === 'Plot'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Plot</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="toggle-advanced-filters"
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-blue-600 py-1 px-2.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'Hide Filters' : 'More Filters'}</span>
            </button>

            {(searchLocation || categoryFilter !== 'All' || listingTypeFilter !== 'all' || priceRange !== 'any' || bedsFilter !== 'any' || bathsFilter !== 'any') && (
              <button
                id="reset-filters-btn"
                type="button"
                onClick={onResetFilters}
                className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-700 py-1 px-2 rounded-lg hover:bg-rose-50 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Inputs Grid matching Reference UI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Location Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="search-location-input"
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="City, Neighborhood, or State"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Price Range
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                id="filter-price-select"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white appearance-none cursor-pointer transition-all"
              >
                <option value="any">Any Price Range</option>
                <option value="under-500k">Under $500,000</option>
                <option value="500k-800k">$500,000 - $800,000</option>
                <option value="800k-1.2m">$800,000 - $1,200,000</option>
                <option value="over-1.2m">Above $1,200,000</option>
                <option value="rent-under-3k">Rent: Under $3,000/mo</option>
                <option value="rent-over-3k">Rent: Over $3,000/mo</option>
              </select>
            </div>
          </div>

          {/* Bedrooms Filter */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Beds
            </label>
            <select
              id="filter-beds-select"
              value={bedsFilter}
              onChange={(e) => setBedsFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white appearance-none cursor-pointer transition-all"
            >
              <option value="any">Any Bedrooms</option>
              <option value="1">1+ Beds</option>
              <option value="2">2+ Beds</option>
              <option value="3">3+ Beds</option>
              <option value="4">4+ Beds</option>
            </select>
          </div>

          {/* Search Button */}
          <div>
            <button
              id="submit-search-properties-btn"
              type="button"
              onClick={() => {
                const el = document.getElementById('featured-properties');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-5 bg-[#0B192C] hover:bg-[#1E3E62] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Search className="w-4 h-4 text-blue-400" />
              <span>Search Properties</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters Expandable */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Baths
              </label>
              <select
                id="filter-baths-select"
                value={bathsFilter}
                onChange={(e) => setBathsFilter(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              >
                <option value="any">Any Bathrooms</option>
                <option value="1">1+ Baths</option>
                <option value="2">2+ Baths</option>
                <option value="3">3+ Baths</option>
                <option value="4">4+ Baths</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Property Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              >
                <option value="All">All Categories (House, Apartment, Plot)</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Plot">Plot</option>
              </select>
            </div>

            <div className="flex items-end">
              <p className="text-xs text-slate-500 italic pb-2">
                Showing live filtered properties in the catalog below.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
