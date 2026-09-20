import React, { useState, useEffect, useMemo } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  getDocs,
  setDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Property, PropertyCategory, ListingType, ViewingBooking } from './types';
import { INITIAL_PROPERTIES } from './initialData';
import { useAuth, AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroSection, TrustFeaturesStrip } from './components/HeroSection';
import { FilterBar } from './components/FilterBar';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailsModal } from './components/PropertyDetailsModal';
import { SellPropertyModal } from './components/SellPropertyModal';
import { ManagePropertiesView } from './components/ManagePropertiesView';
import { BookingsView } from './components/BookingsView';
import { AuthModal } from './components/AuthModal';
import { SellingBanner, WhyChooseUsSection, NewsletterBanner, Footer } from './components/FooterAndBanners';
import { ArrowRight, Sparkles, Building, AlertCircle, RefreshCw } from 'lucide-react';

function RealEstateApp() {
  const { user, setAuthModalOpen, setAuthMode } = useAuth();

  // Navigation tab: 'browse' (main UI), 'sell', 'manage', 'bookings'
  const [activeTab, setActiveTab] = useState<'browse' | 'sell' | 'manage' | 'bookings'>('browse');

  // Properties State
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  // Bookings State
  const [bookings, setBookings] = useState<ViewingBooking[]>([]);

  // Filtering State
  const [categoryFilter, setCategoryFilter] = useState<'All' | PropertyCategory>('All');
  const [listingTypeFilter, setListingTypeFilter] = useState<'all' | ListingType>('all');
  const [searchLocation, setSearchLocation] = useState('');
  const [priceRange, setPriceRange] = useState('any');
  const [bedsFilter, setBedsFilter] = useState('any');
  const [bathsFilter, setBathsFilter] = useState('any');

  // Modals
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [actionNotification, setActionNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setActionNotification({ message, type });
    setTimeout(() => setActionNotification(null), 4000);
  };

  // 1. Subscribe to /properties in Firestore with initial seed fallback
  useEffect(() => {
    const propCollection = collection(db, 'properties');
    const q = query(propCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const userAddedProperties: Property[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Property, 'id'>),
        }));

        // Always keep the curated showcase catalog available so users can view all properties (Houses, Apartments, Plots)
        const defaultCatalog: Property[] = INITIAL_PROPERTIES.map((p, idx) => ({
          ...p,
          id: `catalog-${idx}`,
        }));

        // Deduplicate in case a catalog item was saved with identical title
        const userTitles = new Set(
          userAddedProperties.map((p) => p.title?.toLowerCase().trim())
        );
        const remainingCatalog = defaultCatalog.filter(
          (p) => !userTitles.has(p.title?.toLowerCase().trim())
        );

        setProperties([...userAddedProperties, ...remainingCatalog]);
        setLoadingProperties(false);
      },
      (error) => {
        console.error('Firestore properties listener error:', error);
        // Fallback to initial properties smoothly
        setProperties(
          INITIAL_PROPERTIES.map((p, idx) => ({ ...p, id: `catalog-${idx}` }))
        );
        setLoadingProperties(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Subscribe to /viewings in Firestore
  useEffect(() => {
    const viewingsCollection = collection(db, 'viewings');
    const q = query(viewingsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: ViewingBooking[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<ViewingBooking, 'id'>),
        }));
        setBookings(list);
      },
      (err) => {
        console.warn('Viewings listener:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter Logic
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Category filter: House, Apartment, Plot
      if (categoryFilter !== 'All' && prop.category !== categoryFilter) {
        return false;
      }

      // Listing type: sale vs rent
      if (listingTypeFilter !== 'all' && prop.listingType !== listingTypeFilter) {
        return false;
      }

      // Location search (matches title, address, location, city)
      if (searchLocation.trim()) {
        const query = searchLocation.toLowerCase().trim();
        const matchesLoc =
          prop.location.toLowerCase().includes(query) ||
          prop.city.toLowerCase().includes(query) ||
          prop.address.toLowerCase().includes(query) ||
          prop.title.toLowerCase().includes(query);
        if (!matchesLoc) return false;
      }

      // Price range
      if (priceRange !== 'any') {
        if (priceRange === 'under-500k' && prop.price > 500000) return false;
        if (priceRange === '500k-800k' && (prop.price < 500000 || prop.price > 800000)) return false;
        if (priceRange === '800k-1.2m' && (prop.price < 800000 || prop.price > 1200000)) return false;
        if (priceRange === 'over-1.2m' && prop.price < 1200000) return false;
        if (priceRange === 'rent-under-3k' && prop.price > 3000) return false;
        if (priceRange === 'rent-over-3k' && prop.price <= 3000) return false;
      }

      // Beds
      if (bedsFilter !== 'any') {
        const minBeds = Number(bedsFilter);
        if ((prop.beds ?? 0) < minBeds) return false;
      }

      // Baths
      if (bathsFilter !== 'any') {
        const minBaths = Number(bathsFilter);
        if ((prop.baths ?? 0) < minBaths) return false;
      }

      return true;
    });
  }, [properties, categoryFilter, listingTypeFilter, searchLocation, priceRange, bedsFilter, bathsFilter]);

  // User's own properties
  const userProperties = useMemo(() => {
    if (!user) return [];
    return properties.filter((p) => p.sellerId === user.uid);
  }, [properties, user]);

  // User's own bookings
  const userBookings = useMemo(() => {
    if (!user) return bookings;
    return bookings.filter((b) => b.userId === user.uid || b.sellerId === user.uid);
  }, [bookings, user]);

  // Handlers
  const handleResetFilters = () => {
    setCategoryFilter('All');
    setListingTypeFilter('all');
    setSearchLocation('');
    setPriceRange('any');
    setBedsFilter('any');
    setBathsFilter('any');
  };

  const handleViewAllProperties = () => {
    setActiveTab('browse');
    handleResetFilters();
    setTimeout(() => {
      document.getElementById('featured-properties')?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  const handleFilterBuy = () => {
    setActiveTab('browse');
    handleResetFilters();
    setListingTypeFilter('sale');
    setTimeout(() => {
      document.getElementById('featured-properties')?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  const handleFilterRent = () => {
    setActiveTab('browse');
    handleResetFilters();
    setListingTypeFilter('rent');
    setTimeout(() => {
      document.getElementById('featured-properties')?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  const handleOpenSellModal = (propertyToEdit?: Property) => {
    if (!user) {
      setAuthMode('signin');
      setAuthModalOpen(true);
      return;
    }
    setEditingProperty(propertyToEdit || null);
    setSellModalOpen(true);
  };

  const handleSaveProperty = async (propertyData: any, existingId?: string) => {
    try {
      if (existingId) {
        // Update
        const propRef = doc(db, 'properties', existingId);
        await updateDoc(propRef, propertyData);
        showNotification('Property listing updated successfully!');
      } else {
        // Add new
        await addDoc(collection(db, 'properties'), {
          ...propertyData,
          createdAt: Date.now(),
        });
        showNotification('Property listing created and published!');
      }
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message || 'Failed to save property to database');
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this property listing?')) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'properties', propertyId));
      showNotification('Property deleted successfully.');
    } catch (err: any) {
      console.error(err);
      showNotification('Failed to delete property: ' + err.message, 'error');
    }
  };

  const handleBookViewing = async (bookingData: any) => {
    try {
      await addDoc(collection(db, 'viewings'), bookingData);
      showNotification('Viewing tour scheduled successfully!');
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message || 'Could not schedule viewing');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Cancel this scheduled property viewing?')) return;
    try {
      await deleteDoc(doc(db, 'viewings', bookingId));
      showNotification('Viewing appointment cancelled.');
    } catch (err: any) {
      console.error(err);
      showNotification('Failed to cancel appointment: ' + err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {actionNotification && (
        <div
          id="toast-notification"
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2 animate-fadeIn ${
            actionNotification.type === 'error'
              ? 'bg-red-600 text-white border-red-700'
              : 'bg-[#0B192C] text-white border-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>{actionNotification.message}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSellModal={() => handleOpenSellModal()}
        onViewAll={handleViewAllProperties}
        onFilterBuy={handleFilterBuy}
        onFilterRent={handleFilterRent}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'manage' ? (
          <ManagePropertiesView
            userProperties={userProperties}
            onSelectProperty={(p) => setSelectedProperty(p)}
            onEditProperty={(p) => handleOpenSellModal(p)}
            onDeleteProperty={handleDeleteProperty}
            onAddNewProperty={() => handleOpenSellModal()}
          />
        ) : activeTab === 'bookings' ? (
          <BookingsView
            bookings={userBookings}
            onCancelBooking={handleCancelBooking}
            onViewProperty={(pId) => {
              const p = properties.find((item) => item.id === pId);
              if (p) setSelectedProperty(p);
            }}
          />
        ) : (
          /* Default Main Real Estate Landing & Catalog View */
          <>
            {/* Section 1: Hero Banner */}
            <HeroSection
              onExploreClick={handleViewAllProperties}
              onSellClick={() => handleOpenSellModal()}
            />

            {/* Filter Search Component (Positioned overlapping hero as in reference) */}
            <FilterBar
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              listingTypeFilter={listingTypeFilter}
              setListingTypeFilter={setListingTypeFilter}
              searchLocation={searchLocation}
              setSearchLocation={setSearchLocation}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              bedsFilter={bedsFilter}
              setBedsFilter={setBedsFilter}
              bathsFilter={bathsFilter}
              setBathsFilter={setBathsFilter}
              onResetFilters={handleResetFilters}
            />

            {/* Trust Features Strip */}
            <TrustFeaturesStrip />

            {/* Section 2: Featured Properties Grid */}
            <section id="featured-properties" className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                    Featured Properties
                  </span>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Homes You'll Love
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Hand-picked residential listings available for immediate sale and luxury rental.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500">
                    Showing <strong className="text-slate-900">{filteredProperties.length}</strong> of {properties.length} properties
                  </span>
                  <button
                    id="view-all-properties-btn"
                    onClick={handleViewAllProperties}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>View All Properties</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {loadingProperties ? (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                  <p className="text-sm font-semibold text-slate-600">Loading verified properties from database...</p>
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">No Properties Found</h4>
                  <p className="text-xs text-slate-500 mb-4">
                    No properties match your current filters. Try changing your category, price range, or location search.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-[#0B192C] text-white text-xs font-bold rounded-xl"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onSelect={(p) => setSelectedProperty(p)}
                      onBookViewing={(p) => setSelectedProperty(p)}
                      isOwner={user?.uid === property.sellerId}
                      onEdit={(p) => handleOpenSellModal(p)}
                      onDelete={handleDeleteProperty}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Section 3: Thinking of Selling Valuation Banner */}
            <SellingBanner onGetValuation={() => handleOpenSellModal()} />

            {/* Section 4: Why Choose Us & Newsletter */}
            <WhyChooseUsSection />
            <NewsletterBanner />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigateHome={handleViewAllProperties}
        onNavigateBuy={handleFilterBuy}
        onNavigateRent={handleFilterRent}
        onNavigateSell={() => handleOpenSellModal()}
        onNavigateFeatured={handleViewAllProperties}
      />

      {/* Modals */}
      <AuthModal />

      <PropertyDetailsModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onBookViewing={handleBookViewing}
      />

      <SellPropertyModal
        isOpen={sellModalOpen}
        onClose={() => {
          setSellModalOpen(false);
          setEditingProperty(null);
        }}
        onSubmitProperty={handleSaveProperty}
        editingProperty={editingProperty}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RealEstateApp />
    </AuthProvider>
  );
}
