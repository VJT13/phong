import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProductsSection from './components/ProductsSection';
import CertificationsSection from './components/CertificationsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Premium Page Loader */}
      <div className={`page-loader ${!loading ? 'loaded' : ''}`}>
        <div className="loader-logo">Teco<span>Maco</span></div>
        <div className="loader-bar">
          <div className="loader-bar-fill"></div>
        </div>
      </div>

      {/* Main Content */}
      {!loading && (
        <>
          <Navbar />
          <HeroSection />
          <AboutSection />
          <ProductsSection />
          <CertificationsSection />
          <ContactSection />
          <Footer />
        </>
      )}
    </>
  );
}
