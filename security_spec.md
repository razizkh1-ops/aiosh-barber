# Security Specification: AIOSH BARBER Firestore

## 1. Data Invariants
- Appointments can be created by clients or guests, provided all required fields (bookingRef, serviceIds, serviceNames, totalPrice, totalDurationMin, barberId, barberName, date, time, customerName, customerPhone, status, createdAt) are valid.
- Appointments status must be one of `confirmed`, `cancelled`, or `completed`.
- When updating an appointment:
  - An admin can update any non-immutable fields or update status to `cancelled` / `completed`.
  - The booking customer (if authenticated with `userId == request.auth.uid`) can cancel their appointment (`status: 'cancelled'`).
- Document IDs must satisfy `isValidId(appointmentId)` with length <= 128 matching `^[a-zA-Z0-9_-]+$`.
- Adjudicated admin identity is verified against `/admins/{uid}` or authenticated admin email `razi.z.kh1@gmail.com` with `email_verified == true`.

## 2. The "Dirty Dozen" Payloads
1. **Ghost Field Attack**: Client injects `isAdmin: true` into an appointment document.
2. **Huge ID Injection**: Client attempts write to `/appointments/` with a 2KB junk character string.
3. **Empty / Missing Required Fields**: Client attempts to create appointment without `customerPhone` or `date`.
4. **Invalid Status String**: Client attempts to write `status: "vip_approved"`.
5. **String Overflow**: Client injects 10,000 character string into `notes`.
6. **Price Tampering**: Client injects negative or non-number `totalPrice: -500`.
7. **Date Format Poisoning**: Client sends invalid date format `date: "not-a-date"`.
8. **Unverified Admin Spoof**: Client claims admin email without `email_verified == true`.
9. **Unauthorized Update**: Non-owner attempts to modify someone else's appointment details.
10. **Terminal State Bypass**: Attempting to alter an already completed appointment.
11. **Arbitrary Collection Write**: Attempting to write to `/admins/{anyId}` as unauthenticated user.
12. **Blanket Collection Scraping**: Unauthenticated non-admin attempting blanket read without constraints.

## 3. Test Runner
Verified against security rules definitions below.
