import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingForm from '@/components/BookingForm';

const Booking = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Header />
      <BookingForm />
      <Footer />
    </div>
  );
};

export default Booking;