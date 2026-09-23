import { AppointmentBooking, TimeSlot } from '../types';
import { SHOP_INFO } from '../data/barberData';

const STORAGE_KEY = 'aiosh_barber_bookings';

// Generate default upcoming sample bookings for realistic view
const generateInitialBookings = (): AppointmentBooking[] => {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  
  return [
    {
      id: 'demo-1',
      bookingRef: 'AB-8821',
      serviceIds: ['haircut-with-beard'],
      serviceNames: ['قص شعر مع لحية'],
      totalPrice: 50,
      totalDurationMin: 40,
      barberId: 'barber-aiosh',
      barberName: 'عيوش',
      date: dateStr,
      time: '11:00',
      customerName: 'سمير منصور',
      customerPhone: '+972 52-849-3012',
      customerEmail: 'samir@example.com',
      notes: 'تحديد لحية بالموس وتدريج ناعم',
      status: 'confirmed',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 'demo-2',
      bookingRef: 'AB-9104',
      serviceIds: ['normal-haircut'],
      serviceNames: ['قص شعر عادي'],
      totalPrice: 40,
      totalDurationMin: 30,
      barberId: 'barber-aiosh',
      barberName: 'عيوش',
      date: dateStr,
      time: '15:30',
      customerName: 'نضال غنايم',
      customerPhone: '+972 54-129-8765',
      customerEmail: 'nidal@example.com',
      status: 'confirmed',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: 'demo-3',
      bookingRef: 'AB-4389',
      serviceIds: ['haircut-with-beard'],
      serviceNames: ['قص شعر مع لحية'],
      totalPrice: 50,
      totalDurationMin: 40,
      barberId: 'barber-aiosh',
      barberName: 'عيوش',
      date: dateStr,
      time: '17:00',
      customerName: 'طارق أسدي',
      customerPhone: '+972 50-776-5432',
      status: 'confirmed',
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    }
  ];
};

export function getStoredBookings(): AppointmentBooking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = generateInitialBookings();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return generateInitialBookings();
  }
}

export function saveBooking(booking: Omit<AppointmentBooking, 'id' | 'bookingRef' | 'createdAt'>): AppointmentBooking {
  const all = getStoredBookings();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newBooking: AppointmentBooking = {
    ...booking,
    id: `book-${Date.now()}-${randomNum}`,
    bookingRef: `AB-${randomNum}`,
    createdAt: new Date().toISOString(),
  };

  const updated = [newBooking, ...all];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newBooking;
}

export function updateBookingStatus(id: string, status: 'confirmed' | 'cancelled' | 'completed'): AppointmentBooking[] {
  const all = getStoredBookings();
  const updated = all.map(b => (b.id === id ? { ...b, status } : b));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteBooking(id: string): AppointmentBooking[] {
  const all = getStoredBookings();
  const updated = all.filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

// Generate slots from 10:00 to 20:30 (every 30 mins)
export function generateDaySlots(dateStr: string, barberId: string): TimeSlot[] {
  const allBookings = getStoredBookings();
  const selectedDate = new Date(dateStr);
  const dayOfWeek = selectedDate.getDay(); // 0 is Sunday, 5 is Friday

  // Opening hours: Friday 09:00 - 18:00, other days 10:00 - 21:00
  const startHour = dayOfWeek === 5 ? 9 : 10;
  const endHour = dayOfWeek === 5 ? 18 : 21;

  const slots: TimeSlot[] = [];

  for (let h = startHour; h < endHour; h++) {
    for (const m of [0, 30]) {
      // Don't go past closing
      if (h === endHour - 1 && m === 30 && dayOfWeek === 5) continue;

      const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      
      let period: 'morning' | 'afternoon' | 'evening' = 'morning';
      if (h >= 12 && h < 17) period = 'afternoon';
      else if (h >= 17) period = 'evening';

      // Check if slot is taken on this date for this barber
      const isTaken = allBookings.some(b => {
        if (b.status === 'cancelled') return false;
        if (b.date !== dateStr) return false;
        if (b.time !== timeStr) return false;
        if (barberId === 'barber-any') return false; // Available on at least one chair unless all are taken
        return b.barberId === barberId;
      });

      // Check if time has already passed today
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      let isPast = false;
      if (dateStr === todayStr) {
        const [currH, currM] = [now.getHours(), now.getMinutes()];
        if (h < currH || (h === currH && m <= currM)) {
          isPast = true;
        }
      }

      slots.push({
        time: timeStr,
        available: !isTaken && !isPast,
        period,
      });
    }
  }

  return slots;
}

export function formatWhatsAppMessage(booking: AppointmentBooking): string {
  const text = `💈 *حجز موعد جديد في AIOSH BARBER (صالون عيوش - سخنين)* 💈

✂️ *رقم الحجز:* ${booking.bookingRef}
👤 *اسم الزبون:* ${booking.customerName}
📞 *رقم الهاتف:* ${booking.customerPhone}
📅 *التاريخ:* ${booking.date}
⏰ *الوقت:* ${booking.time}
✂️ *الحلاق:* ${booking.barberName}
💈 *الخدمات:* ${booking.serviceNames.join('، ')}
💰 *المبلغ التقديري:* ₪${booking.totalPrice} (حوالي ${booking.totalDurationMin} دقيقة)
${booking.notes ? `📝 *ملاحظات:* ${booking.notes}\n` : ''}
📍 *الموقع:* صالون عيوش باربر، سخنين، إسرائيل (${SHOP_INFO.phoneDisplay})

يرجى تأكيد الحجز. شكراً لك!`;

  return `https://wa.me/${SHOP_INFO.phoneRaw}?text=${encodeURIComponent(text)}`;
}

export function generateGoogleCalendarUrl(booking: AppointmentBooking): string {
  const [year, month, day] = booking.date.split('-').map(Number);
  const [hour, minute] = booking.time.split(':').map(Number);
  
  const start = new Date(year, month - 1, day, hour, minute);
  const end = new Date(start.getTime() + booking.totalDurationMin * 60000);

  const formatCalTime = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

  const startIso = formatCalTime(start);
  const endIso = formatCalTime(end);

  const title = encodeURIComponent(`موعد حلاقة في AIOSH BARBER (${booking.serviceNames.join('، ')})`);
  const details = encodeURIComponent(
    `موعد في صالون عيوش سخنين مع الحلاق: ${booking.barberName}\nرقم الحجز: ${booking.bookingRef}\nهاتف الصالون: ${SHOP_INFO.phone}\nالسعر: ₪${booking.totalPrice}`
  );
  const location = encodeURIComponent('AIOSH BARBER, سخنين, إسرائيل');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
}

export function downloadIcsFile(booking: AppointmentBooking) {
  const [year, month, day] = booking.date.split('-').map(Number);
  const [hour, minute] = booking.time.split(':').map(Number);
  
  const start = new Date(year, month - 1, day, hour, minute);
  const end = new Date(start.getTime() + booking.totalDurationMin * 60000);

  const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AIOSH BARBER Sakhnin//Appointments//AR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${booking.id}@aioshbarber.com`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(start)}`,
    `DTEND:${formatDate(end)}`,
    `SUMMARY:موعد حلاقة @ AIOSH BARBER (${booking.serviceNames.join('، ')})`,
    `DESCRIPTION:موعد مع ${booking.barberName}\\nرقم الحجز: ${booking.bookingRef}\\nهاتف: ${SHOP_INFO.phone}\\nالسعر: ₪${booking.totalPrice}`,
    `LOCATION:AIOSH BARBER\\, Sakhnin\\, Israel`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `aiosh-barber-${booking.bookingRef}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
