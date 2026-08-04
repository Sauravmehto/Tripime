export interface Airline {
  name: string;
  code: string;
}

export interface Airport {
  city: string;
  airport: string;
  code: string;
}

export interface Fare {
  baseFare: number;
  taxes: number;
  totalFare: number;
  currency: string;
}

export interface Baggage {
  cabin: string;
  checkIn: string;
}

export interface Flight {
  id: string;
  airline: Airline;
  flightNumber: string;
  origin: Airport;
  destination: Airport;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  durationMinutes: number;
  aircraft: string;
  cabinClass: string;
  fare: Fare;
  availableSeats: number;
  baggage: Baggage;
  refundable: boolean;
  status: string;
}

export interface FlightSearchResponse {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
  count: number;
  flights: Flight[];
}

export interface SearchParams {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
}

export interface PassengerForm {
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
}

export interface ContactForm {
  email: string;
  phone: string;
}

export type SeatType = "standard" | "window" | "preferred" | "extra_legroom";

export interface SelectedSeat {
  passengerIndex: number;
  seatNumber: string;
  seatType: SeatType;
  price: number;
}

export type PaymentMethod = "upi" | "qr" | "card";

export interface PaymentMeta {
  paymentId: string;
  transactionId: string;
  method: PaymentMethod;
  amount: number;
  currency: string;
  status: string;
  paidAt: string;
}

export interface BookingPassenger extends PassengerForm {
  seatNumber?: string;
}

export interface Booking {
  bookingId: string;
  pnr: string;
  status: string;
  createdAt: string;
  confirmedAt?: string | null;
  flight: Flight;
  passengers: BookingPassenger[];
  contact: ContactForm;
  passengerCount: number;
  seats: SelectedSeat[];
  fare: Fare;
  seatCharges: number;
  totalAmount: number;
  payment: PaymentMeta;
}

export interface BookingCreatePayload {
  flightId: string;
  passengers: PassengerForm[];
  contact: ContactForm;
  seats: SelectedSeat[];
  payment: PaymentMeta;
}

export interface MockPaymentRequest {
  amount: number;
  currency: string;
  method: PaymentMethod;
  upiId?: string;
  cardLast4?: string;
}

export interface AdminLoginResponse {
  token: string;
  expiresAt: string;
}

export interface AdminStats {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  bookingsToday: number;
  totalRevenue: number;
}
