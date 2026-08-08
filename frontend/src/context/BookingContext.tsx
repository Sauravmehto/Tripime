import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  ContactForm,
  Flight,
  PassengerForm,
  PaymentMeta,
  SearchParams,
  SelectedSeat,
} from "../types";

const STORAGE_KEY = "tripime_booking_v1";

interface PersistedBookingState {
  search: SearchParams | null;
  selectedFlight: Flight | null;
  passengers: PassengerForm[];
  contact: ContactForm;
  selectedSeats: SelectedSeat[];
  payment: PaymentMeta | null;
}

/**
 * Booking-in-progress is kept in sessionStorage (not localStorage) so a page
 * refresh mid-checkout doesn't lose progress, but it clears when the tab closes.
 */
function loadPersisted(): PersistedBookingState | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedBookingState) : null;
  } catch {
    return null;
  }
}

function persist(state: PersistedBookingState) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // sessionStorage unavailable (private mode, quota, etc.) — booking still works, just not persisted.
  }
}

function clearPersisted() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

interface BookingState {
  search: SearchParams | null;
  selectedFlight: Flight | null;
  passengers: PassengerForm[];
  contact: ContactForm;
  selectedSeats: SelectedSeat[];
  seatCharges: number;
  payment: PaymentMeta | null;
  setSearch: (search: SearchParams) => void;
  setSelectedFlight: (flight: Flight) => void;
  setPassengers: (passengers: PassengerForm[]) => void;
  setContact: (contact: ContactForm) => void;
  setSelectedSeats: (seats: SelectedSeat[]) => void;
  setPayment: (payment: PaymentMeta | null) => void;
  reset: () => void;
}

const defaultContact: ContactForm = { email: "", phone: "" };

const BookingContext = createContext<BookingState | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [restored] = useState(() => loadPersisted());
  const [search, setSearch] = useState<SearchParams | null>(restored?.search ?? null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(
    restored?.selectedFlight ?? null,
  );
  const [passengers, setPassengers] = useState<PassengerForm[]>(restored?.passengers ?? []);
  const [contact, setContact] = useState<ContactForm>(restored?.contact ?? defaultContact);
  const [selectedSeats, setSelectedSeatsState] = useState<SelectedSeat[]>(
    restored?.selectedSeats ?? [],
  );
  const [payment, setPayment] = useState<PaymentMeta | null>(restored?.payment ?? null);

  const setSelectedSeats = useCallback((seats: SelectedSeat[]) => {
    setSelectedSeatsState(seats);
  }, []);

  const seatCharges = useMemo(
    () => selectedSeats.reduce((sum, seat) => sum + seat.price, 0),
    [selectedSeats],
  );

  const reset = useCallback(() => {
    setSearch(null);
    setSelectedFlight(null);
    setPassengers([]);
    setContact(defaultContact);
    setSelectedSeatsState([]);
    setPayment(null);
    clearPersisted();
  }, []);

  useEffect(() => {
    persist({ search, selectedFlight, passengers, contact, selectedSeats, payment });
  }, [search, selectedFlight, passengers, contact, selectedSeats, payment]);

  const value = useMemo(
    () => ({
      search,
      selectedFlight,
      passengers,
      contact,
      selectedSeats,
      seatCharges,
      payment,
      setSearch,
      setSelectedFlight,
      setPassengers,
      setContact,
      setSelectedSeats,
      setPayment,
      reset,
    }),
    [
      search,
      selectedFlight,
      passengers,
      contact,
      selectedSeats,
      seatCharges,
      payment,
      setSelectedSeats,
      reset,
    ],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
