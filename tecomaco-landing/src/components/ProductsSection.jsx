import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { usePortfolio } from '../context/PortfolioContext';

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function ProductModal({ product, onClose }) {
  if (!product) return null;
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900" />
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <h2 className="modal-title">{product.title}</h2>
          <p className="modal-desc">{product.detail}</p>
          
          <div className="modal-grid">
            <div className="modal-info-card">
              <h4>Applications</h4>
              <ul>
                {product.applications.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
            <div className="modal-info-card">
              <h4>Materials</h4>
              <ul>
                {product.materials.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </div>
            <div className="modal-info-card">
              <h4>Surface Treatments</h4>
              <ul>
                {product.surfaces.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="modal-info-card">
              <h4>Standards</h4>
              <div className="modal-standards">
                {product.standards.map((s, i) => <span key={i} className="modal-standard">{s}</span>)}
              </div>
            </div>
          </div>

          {product.videoUrl && (
            <div className="video-container" style={{ marginTop: '2rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)', marginBottom: '0.75rem' }}>
                🎬 Factory Production Process
              </h4>
              <video controls autoPlay muted loop playsInline style={{ width: '100%', borderRadius: 'var(--radius-md)' }}>
                <source src={product.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProductsSection() {
  const { data } = usePortfolio();
  const { products } = data;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <section id="products" className="section" ref={ref}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          <div className="section-badge">🔩 Product Catalogue</div>
          <h2 className="section-title">Industrial Fastening Solutions</h2>
          <p className="section-subtitle">
            Comprehensive range of precision-engineered fasteners for automotive,
            construction, and industrial applications — manufactured to international standards.
          </p>
        </motion.div>

        <div className="products-grid">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              className="product-card"
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              custom={i}
              onClick={() => setSelectedProduct(product)}
              whileHover={{ y: -8 }}
            >
              <div className="product-card-image" style={{ position: 'relative', overflow: 'hidden' }}>
                <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.8) 0%, transparent 60%)' }} />
                <div className="product-icon" style={{
                  zIndex: 1,
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem'
                }}>{product.icon}</div>
              </div>
              <div className="product-card-body">
                <h3 className="product-card-title">{product.title}</h3>
                <p className="product-card-desc">{product.desc}</p>
                <div className="product-card-standards">
                  {product.standards.map((s, idx) => (
                    <span key={idx} className="standard-tag">{s}</span>
                  ))}
                </div>
                <div className="product-card-action">
                  View Production & Specs
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
