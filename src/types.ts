export interface BarberService {
  id: string;
  name: string;
  nameHe?: string;
  nameAr?: string;
  category: 'hair' | 'beard' | 'combo' | 'treatment';
  price: number; // in ILS (₪)
  durationMin: number;
  description: string;
  popular?: boolean;
  iconName: string;
}

export interface BarberStaff {
  id: string;
  name: string;
  title: string;
  specialty: string;
  experienceYears: number;
  avatar: string;
  bio: string;
  rating: number;
  availableDays: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
}

export interface TimeSlot {
  time: string; // HH:mm format, e.g. "10:30"
  available: boolean;
  period: 'morning' | 'afternoon' | 'evening';
}

export interface AppointmentBooking {
  id: string;
  bookingRef: string; // e.g. "AB-8492"
  serviceIds: string[];
  serviceNames: string[];
  totalPrice: number;
  totalDurationMin: number;
  barberId: string;
  barberName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  userId?: string;
}

export interface ShopInfo {
  name: string;
  owner: string;
  city: string;
  street: string;
  cityHe: string;
  cityAr: string;
  country: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
    dms: string;
  };
  phone: string; // +972 0549898923
  phoneDisplay: string;
  phoneRaw: string; // +972549898923
  whatsappUrl: string;
  hours: {
    days: string;
    hours: string;
  }[];
  googleMapsQuery: string;
  wazeQuery: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  service: string;
}
