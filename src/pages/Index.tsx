import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import ServiceGallery from '@/components/ServiceGallery';
import ResultsShowcase from '@/components/ResultsShowcase';
import About from '@/components/About';
import BookingForm from '@/components/BookingForm';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <ServiceGallery />
      <ResultsShowcase />
      <About />
      <BookingForm />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
