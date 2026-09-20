export type PropertyCategory = 'House' | 'Apartment' | 'Plot';
export type ListingType = 'sale' | 'rent';

export interface Property {
  id: string;
  title: string;
  category: PropertyCategory;
  listingType: ListingType;
  price: number;
  location: string;
  address: string;
  city: string;
  beds?: number;
  baths?: number;
  sqft: number;
  imageUrl: string;
  description: string;
  features?: string[];
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone?: string;
  createdAt: number;
  updatedAt?: number;
  featured?: boolean;
}

export interface ViewingBooking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage: string;
  propertyPrice: number;
  userId?: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  date: string;
  time: string;
  notes?: string;
  sellerId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber?: string;
  createdAt: number;
}
