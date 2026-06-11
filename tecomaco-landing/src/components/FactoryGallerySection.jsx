import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { usePortfolio } from '../context/PortfolioContext';

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
          {factory.gallery.map((img, i) => (
            <GalleryCard 
              key={i}
              img={img}
              i={i}
              openLightbox={openLightbox}
              imageVariants={imageVariants}
            />
          ))}
        </div>
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
                src={factory.gallery[lightboxIndex].src} 
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
          src={img.src} 
          alt={img.alt} 
          decoding="async"
          className={`gallery-thumbnail ${isLoaded ? 'loaded' : ''}`}
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        <div className="gallery-skeleton" />
      )}
      <div className="gallery-hover-overlay">
        <span className="zoom-icon">🔍</span>
        <p className="image-caption">{img.alt}</p>
      </div>
    </motion.div>
  );
}
