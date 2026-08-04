import {
  createContext,
  useCallback,
  useContext,
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
  const [search, setSearch] = useState<SearchParams | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [passengers, setPassengers] = useState<PassengerForm[]>([]);
  const [contact, setContact] = useState<ContactForm>(defaultContact);
  const [selectedSeats, setSelectedSeatsState] = useState<SelectedSeat[]>([]);
  const [payment, setPayment] = useState<PaymentMeta | null>(null);

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
  }, []);

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
