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

function AppContent() {
  const { loading: dbLoading } = usePortfolio();
  const [loaderTimeDone, setLoaderTimeDone] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/');

  // Route listener for hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Minimum loader display duration for premium feeling
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaderTimeDone(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const showLoader = dbLoading || !loaderTimeDone;

  return (
    <>
      {/* Premium Page Loader */}
      <div className={`page-loader ${!showLoader ? 'loaded' : ''}`}>
        <div className="loader-logo">Orin<span>Bui</span></div>
        <div className="loader-bar">
          <div className="loader-bar-fill"></div>
        </div>
      </div>

      {/* Main Content Router */}
      {!showLoader && (
        currentRoute === '#/admin' ? (
          <AdminDashboard />
        ) : (
          <>
            <Navbar />
            <HeroSection />
            <ProductsSection />
            <AdvantagesSection />
            <FactoryGallerySection />
            <CertificationsSection />
            <ClientFlagsSection />
            <SourcingSupportSection />
            <ContactSection />
            <Footer />
            <FloatingContact />
          </>
        )
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
