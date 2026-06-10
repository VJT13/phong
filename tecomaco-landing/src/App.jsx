import { useState, useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProductsSection from './components/ProductsSection';
import CertificationsSection from './components/CertificationsSection';
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
        <div className="loader-logo">Phong<span>Bui</span></div>
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
            <AboutSection />
            <ProductsSection />
            <CertificationsSection />
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

