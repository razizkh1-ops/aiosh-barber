import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { AppointmentBooking } from '../types';
import { getStoredBookings } from '../utils/bookingUtils';

const COLLECTION_NAME = 'appointments';
const STORAGE_KEY = 'aiosh_barber_bookings';

/**
 * Subscribe in real-time to all appointments in Firestore.
 * Conforms to Firebase Integration guidelines with error handling.
 */
export function subscribeToAppointments(
  onUpdate: (appointments: AppointmentBooking[]) => void,
  onError?: (err: unknown) => void
): () => void {
  try {
    const q = query(collection(db, COLLECTION_NAME), limit(100));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: AppointmentBooking[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            bookingRef: data.bookingRef || `AB-${docSnap.id.slice(-4)}`,
            serviceIds: data.serviceIds || ['normal-haircut'],
            serviceNames: data.serviceNames || ['قص شعر عادي'],
            totalPrice: Number(data.totalPrice) || 40,
            totalDurationMin: Number(data.totalDurationMin) || 30,
            barberId: data.barberId || 'barber-aiosh',
            barberName: data.barberName || 'عيوش',
            date: data.date,
            time: data.time,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            customerEmail: data.customerEmail || undefined,
            notes: data.notes || undefined,
            status: data.status || 'confirmed',
            createdAt: data.createdAt || new Date().toISOString(),
            userId: data.userId || undefined,
          });
        });

        // Merge with local fallback if Firestore is currently empty to preserve demo data
        if (list.length === 0) {
          const local = getStoredBookings();
          onUpdate(local);
        } else {
          // Sort descending by date & time
          list.sort((a, b) => (b.date + ' ' + b.time).localeCompare(a.date + ' ' + a.time));
          // Keep local storage in sync
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
          } catch {
            // ignore
          }
          onUpdate(list);
        }
      },
      (error) => {
        console.warn('Firestore subscription error (using local storage fallback):', error);
        onUpdate(getStoredBookings());
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.warn('Failed to attach Firestore snapshot:', error);
    onUpdate(getStoredBookings());
    return () => {};
  }
}

/**
 * Persist an appointment to Firestore and localStorage
 */
export async function createAppointmentInFirestore(
  bookingInput: Omit<AppointmentBooking, 'id' | 'bookingRef' | 'createdAt'>
): Promise<AppointmentBooking> {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const docId = `book-${Date.now()}-${randomNum}`;
  const bookingRef = `AB-${randomNum}`;
  const createdAt = new Date().toISOString();

  const newBooking: AppointmentBooking = {
    ...bookingInput,
    id: docId,
    bookingRef,
    createdAt,
    userId: auth.currentUser?.uid || undefined,
  };

  // Always update localStorage first for immediate UI responsiveness
  try {
    const existing = getStoredBookings();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newBooking, ...existing]));
  } catch {
    // ignore
  }

  // Construct payload with exact field types matching Firestore Rules
  const payload: Record<string, unknown> = {
    bookingRef: newBooking.bookingRef,
    serviceIds: newBooking.serviceIds,
    serviceNames: newBooking.serviceNames,
    totalPrice: Number(newBooking.totalPrice),
    totalDurationMin: Number(newBooking.totalDurationMin),
    barberId: newBooking.barberId,
    barberName: newBooking.barberName,
    date: newBooking.date,
    time: newBooking.time,
    customerName: newBooking.customerName,
    customerPhone: newBooking.customerPhone,
    status: newBooking.status,
    createdAt: newBooking.createdAt,
  };

  if (newBooking.customerEmail) {
    payload.customerEmail = newBooking.customerEmail;
  }
  if (newBooking.notes) {
    payload.notes = newBooking.notes;
  }
  if (newBooking.userId) {
    payload.userId = newBooking.userId;
  }

  const docPath = `${COLLECTION_NAME}/${docId}`;

  try {
    await setDoc(doc(db, COLLECTION_NAME, docId), payload);
  } catch (error) {
    console.error('Failed to write to Firestore:', error);
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }

  return newBooking;
}

/**
 * Update an appointment status in Firestore
 */
export async function updateAppointmentStatusInFirestore(
  id: string,
  status: 'confirmed' | 'cancelled' | 'completed'
): Promise<void> {
  const docPath = `${COLLECTION_NAME}/${id}`;

  // Update local
  try {
    const all = getStoredBookings();
    const updated = all.map((b) => (b.id === id ? { ...b, status } : b));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), { status });
  } catch (error) {
    console.error(`Failed to update status on ${docPath}:`, error);
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

/**
 * Delete appointment from Firestore (Admin only)
 */
export async function deleteAppointmentInFirestore(id: string): Promise<void> {
  const docPath = `${COLLECTION_NAME}/${id}`;

  // Update local
  try {
    const all = getStoredBookings();
    const updated = all.filter((b) => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error(`Failed to delete appointment on ${docPath}:`, error);
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}
