import { useState, useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductsSection from './components/ProductsSection';
import AdvantagesSection from './components/AdvantagesSection';
import FactoryGallerySection from './components/FactoryGallerySection';
import CertificationsSection from './components/CertificationsSection';
import ClientFlagsSection from './components/ClientFlagsSection';
import SourcingSupportSection from './components/SourcingSupportSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import FloatingContact from './components/FloatingContact';

import WhyMeSection from './components/WhyMeSection';

function AppContent() {
  const { isSiteReady } = usePortfolio();
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/');

  // Route listener for hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showLoader = !isSiteReady;

  return (
    <>
      {currentRoute === '#/admin' ? (
        <AdminDashboard />
      ) : (
        <>
          {/* Premium Page Loader */}
          <div className={`page-loader ${!showLoader ? 'loaded' : ''}`}>
            <div className="loader-logo">Orin<span>Bui</span></div>
            <div className="loader-bar">
              <div className="loader-bar-fill"></div>
            </div>
          </div>

          {/* Main Landing Page mounted in background */}
          <Navbar />
          <HeroSection />
          <ProductsSection />
          <AdvantagesSection />
          <FactoryGallerySection />
          <WhyMeSection />
          <CertificationsSection />
          <ClientFlagsSection />
          <SourcingSupportSection />
          <ContactSection />
          <Footer />
          <FloatingContact />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
}
