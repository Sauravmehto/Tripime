import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { BookingProvider } from "./context/BookingContext";
import { AdminProtectedRoute } from "./components/admin/AdminProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { ResultsPage } from "./pages/ResultsPage";
import { PassengersPage } from "./pages/PassengersPage";
import { ReviewPage } from "./pages/ReviewPage";
import { SeatsPage } from "./pages/SeatsPage";
import { PaymentPage } from "./pages/PaymentPage";
import { ConfirmationPage } from "./pages/ConfirmationPage";
import { MyBookingPage } from "./pages/MyBookingPage";
import { HotelsPage } from "./pages/HotelsPage";
import { BusesPage } from "./pages/BusesPage";
import { PackagesPage } from "./pages/PackagesPage";
import { PackageDetailPage } from "./pages/PackageDetailPage";
import { VisaPage } from "./pages/VisaPage";
import { AboutPage } from "./pages/legal/AboutPage";
import { ContactPage } from "./pages/legal/ContactPage";
import { PrivacyPage } from "./pages/legal/PrivacyPage";
import { TermsPage } from "./pages/legal/TermsPage";
import { RefundPolicyPage } from "./pages/legal/RefundPolicyPage";

// Admin pages are only needed by staff, so they're split into their own
// chunk instead of bloating the bundle every customer downloads.
const AdminLoginPage = lazy(() =>
  import("./pages/admin/AdminLoginPage").then((m) => ({ default: m.AdminLoginPage })),
);
const AdminDashboardPage = lazy(() =>
  import("./pages/admin/AdminDashboardPage").then((m) => ({ default: m.AdminDashboardPage })),
);
const AdminBookingRequestsPage = lazy(() =>
  import("./pages/admin/AdminBookingRequestsPage").then((m) => ({
    default: m.AdminBookingRequestsPage,
  })),
);
const AdminPackagesPage = lazy(() =>
  import("./pages/admin/AdminPackagesPage").then((m) => ({ default: m.AdminPackagesPage })),
);
const AdminEnquiriesPage = lazy(() =>
  import("./pages/admin/AdminEnquiriesPage").then((m) => ({ default: m.AdminEnquiriesPage })),
);

function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="size-8 animate-spin rounded-full border-[3px] border-neutral-200 border-t-primary-600" />
    </div>
  );
}

function LazyAdmin({ children }: { children: ReactNode }) {
  return <Suspense fallback={<AdminFallback />}>{children}</Suspense>;
}

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
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/flights" element={<ResultsPage />} />
          <Route path="/booking/passengers" element={<PassengersPage />} />
          <Route path="/booking/review" element={<ReviewPage />} />
          <Route path="/booking/seats" element={<SeatsPage />} />
          <Route path="/booking/payment" element={<PaymentPage />} />
          <Route path="/booking/confirmation/:bookingId" element={<ConfirmationPage />} />
          <Route path="/my-booking" element={<MyBookingPage />} />
          <Route
            path="/admin/login"
            element={
              <LazyAdmin>
                <AdminLoginPage />
              </LazyAdmin>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <LazyAdmin>
                <AdminProtectedRoute>
                  <AdminDashboardPage />
                </AdminProtectedRoute>
              </LazyAdmin>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <LazyAdmin>
                <AdminProtectedRoute>
                  <AdminBookingRequestsPage />
                </AdminProtectedRoute>
              </LazyAdmin>
            }
          />
          <Route
            path="/admin/packages"
            element={
              <LazyAdmin>
                <AdminProtectedRoute>
                  <AdminPackagesPage />
                </AdminProtectedRoute>
              </LazyAdmin>
            }
          />
          <Route
            path="/admin/enquiries"
            element={
              <LazyAdmin>
                <AdminProtectedRoute>
                  <AdminEnquiriesPage />
                </AdminProtectedRoute>
              </LazyAdmin>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </BookingProvider>
  );
}
