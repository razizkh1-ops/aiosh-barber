import { BarberService, BarberStaff, ShopInfo, ReviewItem } from '../types';

export const SHOP_INFO: ShopInfo = {
  name: 'AIOSH BARBER',
  owner: 'عيوش',
  city: 'سخنين',
  street: 'شارع مغارة العشرة',
  cityHe: "סח'נין",
  cityAr: 'سخنين',
  country: 'إسرائيل',
  address: 'سخنين، شارع مغارة العشرة، إسرائيل (32°52\'16.8"N 35°17\'28.8"E)',
  coordinates: {
    lat: 32.871333,
    lng: 35.291333,
    dms: '32°52\'16.8"N 35°17\'28.8"E',
  },
  phone: '+972 0549898923',
  phoneDisplay: '+972 054-989-8923',
  phoneRaw: '972549898923',
  whatsappUrl: 'https://wa.me/972549898923',
  hours: [
    { days: 'الأحد', hours: '12:00 – 21:00' },
    { days: 'الإثنين – الخميس', hours: '14:00 – 21:00' },
    { days: 'الجمعة', hours: '12:00 – 21:00' },
    { days: 'السبت', hours: 'مغلق (عطلة أسبوعية)' },
  ],
  googleMapsQuery: 'https://maps.google.com/?q=32.871333,35.291333',
  wazeQuery: 'https://waze.com/ul?ll=32.871333,35.291333&navigate=yes',
};

export function getTodayStatus(): { isOpenToday: boolean; badgeText: string; hoursText: string } {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun, 1 = Mon, ... 5 = Fri, 6 = Sat
  if (day === 6) {
    return {
      isOpenToday: false,
      badgeText: 'السبت: مغلق (عطلة أسبوعية)',
      hoursText: 'مغلق اليوم',
    };
  }
  if (day === 0 || day === 5) {
    return {
      isOpenToday: true,
      badgeText: 'مفتوح اليوم: 12:00 – 21:00',
      hoursText: '12:00 – 21:00',
    };
  }
  return {
    isOpenToday: true,
    badgeText: 'مفتوح اليوم: 14:00 – 21:00',
    hoursText: '14:00 – 21:00',
  };
}

export const SERVICES_LIST: BarberService[] = [
  {
    id: 'normal-haircut',
    name: 'قص شعر عادي',
    nameHe: 'Normal Haircut',
    nameAr: 'قص شعر عادي',
    category: 'hair',
    price: 40,
    durationMin: 30,
    description: 'قص شعر احترافي بالمقص والماكينة، تدريج وتصفيف أنيق وتنظيف الرقبة.',
    popular: false,
    iconName: 'Scissors',
  },
  {
    id: 'haircut-with-beard',
    name: 'قص شعر مع لحية',
    nameHe: 'Haircut with Beard',
    nameAr: 'قص شعر مع لحية',
    category: 'combo',
    price: 50,
    durationMin: 40,
    description: 'قص شعر متكامل مع تحديد ونحت اللحية والشارب بالموس وترتيب متقن.',
    popular: true,
    iconName: 'Sparkles',
  },
];

export const BARBERS_LIST: BarberStaff[] = [
  {
    id: 'barber-aiosh',
    name: 'عيوش',
    title: 'الحلاق والمؤسس',
    specialty: 'قصات شعر وتحديد لحية',
    experienceYears: 10,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'صالون عيوش في سخنين، حلاقة احترافية ومواعيد دقيقة.',
    rating: 5.0,
    availableDays: [0, 1, 2, 3, 4, 5, 6],
  },
];

export const REVIEWS_LIST: ReviewItem[] = [];

export const GALLERY_ITEMS = [
  {
    id: 'g1',
    title: 'ميد فيد دقيق مع تسريحة حديثة',
    category: 'قص شعر',
    img: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'g2',
    title: 'تحديد ونحت لحية بالموس بدقة متناهية',
    category: 'لحية',
    img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'g3',
    title: 'حلاقة ملكية بالفوطة الساخنة والتبخير',
    category: 'حلاقة',
    img: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'g4',
    title: 'لو سكن تيبر مع بومبادور ناعم',
    category: 'تصفيف',
    img: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'g5',
    title: 'تحديد خط الشعر بالموس بدقة ليزرية',
    category: 'تحديد',
    img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'g6',
    title: 'أجواء الصالون وكراسي الجلد الفاخرة',
    category: 'الصالون',
    img: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80',
  },
];
