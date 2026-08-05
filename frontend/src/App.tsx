import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { BookingProvider } from "./context/BookingContext";
import { HomePage } from "./pages/HomePage";
import { ResultsPage } from "./pages/ResultsPage";
import { PassengersPage } from "./pages/PassengersPage";
import { ReviewPage } from "./pages/ReviewPage";
import { SeatsPage } from "./pages/SeatsPage";
import { PaymentPage } from "./pages/PaymentPage";
import { ConfirmationPage } from "./pages/ConfirmationPage";
import { HotelsPage } from "./pages/HotelsPage";
import { BusesPage } from "./pages/BusesPage";
import { PackagesPage } from "./pages/PackagesPage";
import { PackageDetailPage } from "./pages/PackageDetailPage";
import { VisaPage } from "./pages/VisaPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminBookingRequestsPage } from "./pages/admin/AdminBookingRequestsPage";
import { AdminPackagesPage } from "./pages/admin/AdminPackagesPage";
import { AdminProtectedRoute } from "./components/admin/AdminProtectedRoute";

export default function App() {
  return (
    <BookingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/buses" element={<BusesPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/packages/:packageId" element={<PackageDetailPage />} />
          <Route path="/visa" element={<VisaPage />} />
          <Route path="/flights" element={<ResultsPage />} />
          <Route path="/booking/passengers" element={<PassengersPage />} />
          <Route path="/booking/review" element={<ReviewPage />} />
          <Route path="/booking/seats" element={<SeatsPage />} />
          <Route path="/booking/payment" element={<PaymentPage />} />
          <Route path="/booking/confirmation/:bookingId" element={<ConfirmationPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <AdminProtectedRoute>
                <AdminBookingRequestsPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/packages"
            element={
              <AdminProtectedRoute>
                <AdminPackagesPage />
              </AdminProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </BookingProvider>
  );
}
