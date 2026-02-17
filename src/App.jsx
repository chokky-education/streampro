import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ToastContainer from './components/ui/Toast';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import EquipmentPage from './pages/EquipmentPage';
import PaymentPage from './pages/PaymentPage';
import ReviewsPage from './pages/ReviewsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminNews from './pages/admin/AdminNews';
import AdminStats from './pages/admin/AdminStats';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <Navbar />
          <ToastContainer />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/payment/:bookingId" element={<PaymentPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/news" element={<AdminNews />} />
            <Route path="/admin/stats" element={<AdminStats />} />
          </Routes>
          <Footer />
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}
