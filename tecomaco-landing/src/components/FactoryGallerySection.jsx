import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { usePortfolio } from '../context/PortfolioContext';

// Helper: convert /images/factory/factory-1.jpg to /images/factory/thumb/factory-1.jpg
function toThumb(src) {
  return src.replace('/images/factory/', '/images/factory/thumb/');
}
function toFull(src) {
  return src.replace('/images/factory/', '/images/factory/full/');
}

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.04, duration: 0.4, ease: "easeOut" },
  }),
};

export default function FactoryGallerySection() {
  const { data } = usePortfolio();
  const { factory } = data;
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const INITIAL_COUNT = 8;

  if (!factory || !factory.gallery || factory.gallery.length === 0) return null;

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? factory.gallery.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === factory.gallery.length - 1 ? 0 : prev + 1));
  };

  const handleToggle = () => {
    if (isExpanded) {
      setIsExpanded(false);
      const element = document.getElementById("gallery");
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    } else {
      setIsExpanded(true);
      setTimeout(() => {
        const items = document.querySelectorAll(".gallery-item-wrapper");
        if (items && items.length > INITIAL_COUNT) {
          const targetItem = items[INITIAL_COUNT];
          const offset = 100; // Offset to keep some nice spacing above the newly shown row
          const bodyRect = document.body.getBoundingClientRect().top;
          const targetRect = targetItem.getBoundingClientRect().top;
          const targetPosition = targetRect - bodyRect;
          const offsetPosition = targetPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 100);
    }
  };

  const visibleImages = isExpanded ? factory.gallery : factory.gallery.slice(0, INITIAL_COUNT);

  return (
    <section id="gallery" className="section gallery-section" ref={ref}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          <div className="section-badge">🏭 Factory Tour</div>
          <h2 className="section-title">{factory.title || "FACTORY GALLERY"}</h2>
          <p className="section-subtitle">{factory.subtitle}</p>
        </motion.div>

        {/* Factory Info Stats */}
        <div className="factory-info-stats">
          <div className="factory-stat-box">
            <span className="stat-icon">🏢</span>
            <strong>3 Manufacturing Facilities</strong>
            <p>{factory.location || "Phu Tho Province, Vietnam"}</p>
          </div>
          <div className="factory-stat-box">
            <span className="stat-icon">⚙️</span>
            <strong>Full In-House Production</strong>
            <p>{factory.processType || "Dedicated to Threaded Rod Manufacturing"}</p>
          </div>
          <div className="factory-stat-box">
            <span className="stat-icon">📈</span>
            <strong>Stable Capacity</strong>
            <p>Up to 4,000 Tons per Month</p>
          </div>
        </div>

        {/* Gallery Image Grid */}
        <div className="gallery-grid">
          {visibleImages.map((img, index) => {
            const realIndex = factory.gallery.findIndex((g) => g.src === img.src);
            const actualIndex = realIndex !== -1 ? realIndex : index;
            return (
              <GalleryCard 
                key={actualIndex}
                img={img}
                i={actualIndex}
                openLightbox={openLightbox}
                imageVariants={imageVariants}
              />
            );
          })}
        </div>

        {factory.gallery.length > INITIAL_COUNT && (
          <div className="gallery-actions">
            <motion.button
              className="gallery-toggle-btn"
              onClick={handleToggle}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>
                {isExpanded ? "See Less" : `See More (+${factory.gallery.length - INITIAL_COUNT} Photos)`}
              </span>
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="toggle-arrow"
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </motion.svg>
            </motion.button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button className="lightbox-close" onClick={closeLightbox}>✕</button>
            <button className="lightbox-nav prev" onClick={prevImage}>⟨</button>
            <button className="lightbox-nav next" onClick={nextImage}>⟩</button>
            
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={toFull(factory.gallery[lightboxIndex].src)} 
                alt={factory.gallery[lightboxIndex].alt} 
                className="lightbox-img"
              />
              <div className="lightbox-caption">
                <h4>{factory.gallery[lightboxIndex].alt}</h4>
                <p>{lightboxIndex + 1} / {factory.gallery.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function GalleryCard({ img, i, openLightbox, imageVariants }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px', // Bắt đầu load trước khi cuộn tới 200px giúp người dùng thấy ảnh đã sẵn sàng
  });

  return (
    <motion.div
      ref={ref}
      className="gallery-item-wrapper"
      variants={imageVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      custom={i}
      onClick={() => openLightbox(i)}
      whileHover={{ scale: 1.02 }}
    >
      {!isLoaded && <div className="gallery-skeleton" />}
      {inView ? (
        <img 
          src={toThumb(img.src)} 
          alt={img.alt} 
          decoding="async"
          className={`gallery-thumbnail ${isLoaded ? 'loaded' : ''}`}
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        <div className="gallery-skeleton" />
      )}
      <div className="gallery-hover-overlay">
        <span className="zoom-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '32px', height: '32px', color: 'var(--white)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </span>
        <p className="image-caption">{img.alt}</p>
      </div>
    </motion.div>
  );
}
