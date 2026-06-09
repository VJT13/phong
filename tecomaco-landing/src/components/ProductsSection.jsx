import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const products = [
  {
    id: 1,
    title: 'Staples',
    icon: '📎',
    image: '/images/factory/factory-2.jpg',
    videoUrl: '/videos/production-1.mp4',
    desc: 'Industrial staples for pneumatic fastening tools — precision wire forming for construction and packaging.',
    applications: ['Construction framing', 'Furniture assembly', 'Packaging', 'Insulation fastening'],
    materials: ['Low carbon steel', 'Stainless steel', 'Galvanized wire'],
    surfaces: ['Bright finish', 'Galvanized', 'Electro-zinc plated'],
    standards: ['DIN', 'ASTM', 'BS'],
    detail: 'TecoMaco staples are manufactured using precision wire-forming technology, ensuring consistent crown width, leg length, and point geometry. Suitable for use with all major pneumatic stapling systems.'
  },
  {
    id: 2,
    title: 'Brads',
    icon: '📌',
    image: '/images/factory/factory-4.jpg',
    videoUrl: '/videos/production-2.mp4',
    desc: 'Fine gauge brad nails for finish carpentry, trim work, and delicate woodworking applications.',
    applications: ['Trim & molding', 'Cabinet assembly', 'Finish carpentry', 'Decorative panels'],
    materials: ['Carbon steel', 'Stainless steel 304/316'],
    surfaces: ['Bright finish', 'Galvanized', 'Electro-plated'],
    standards: ['DIN', 'ISO', 'ANSI'],
    detail: 'Our precision brads feature consistent gauge dimensions and optimized point geometry for clean, splitting-free penetration in fine woodworking applications.'
  },
  {
    id: 3,
    title: 'Nails',
    icon: '🔨',
    image: '/images/factory/factory-5.jpg',
    videoUrl: '/videos/production-3.mp4',
    desc: 'Full range of industrial nails — coil nails, framing nails, roofing nails, and specialty fasteners.',
    applications: ['Structural framing', 'Roofing', 'Fencing', 'Pallet manufacturing'],
    materials: ['Carbon steel', 'Stainless steel', 'Hardened steel'],
    surfaces: ['Hot-dip galvanized', 'Electro-galvanized', 'Vinyl coated', 'Bright'],
    standards: ['DIN', 'ISO', 'ASTM', 'ANSI'],
    detail: 'From coil nails to strip nails, our full range covers every construction and industrial fastening need. Heat-treated for optimal hardness and withdrawal resistance.'
  },
  {
    id: 4,
    title: 'Screws',
    icon: '🔩',
    image: '/images/factory/factory-6.jpg',
    videoUrl: '/videos/production-4.mp4',
    desc: 'Self-tapping, drywall, machine, and specialty screws — precision thread rolling for superior holding power.',
    applications: ['Drywall installation', 'Metal framing', 'Machinery assembly', 'Automotive'],
    materials: ['Carbon steel C1022', 'Stainless steel 304/316', 'Alloy steel'],
    surfaces: ['Black phosphate', 'Zinc plated', 'Dacromet', 'Nickel plated'],
    standards: ['DIN', 'ISO', 'ASTM', 'ANSI', 'BS'],
    detail: 'Our screw manufacturing features cold heading, precision thread rolling, heat treatment, and advanced surface coating — delivering consistent torque performance and corrosion resistance.'
  },
  {
    id: 5,
    title: 'Bolts & Nuts',
    icon: '🔧',
    image: '/images/factory/factory-7.jpg',
    videoUrl: '/videos/production-1.mp4',
    desc: 'Hex bolts, carriage bolts, flange bolts with matching nuts — engineered for structural integrity.',
    applications: ['Structural steel', 'Machinery', 'Automotive', 'Infrastructure'],
    materials: ['Grade 4.8/8.8/10.9/12.9', 'Stainless A2/A4', 'Alloy steel'],
    surfaces: ['Hot-dip galvanized', 'Zinc flake', 'Dacromet', 'Black oxide'],
    standards: ['DIN 931/933', 'ISO 4014/4017', 'ASTM A325/A490', 'ANSI'],
    detail: 'Our bolt and nut production features multi-station cold forging, CNC precision machining, controlled heat treatment, and comprehensive dimensional inspection per international standards.'
  },
  {
    id: 6,
    title: 'Thread Rods',
    icon: '📏',
    image: '/images/factory/factory-8.jpg',
    videoUrl: '/videos/production-2.mp4',
    desc: 'Fully threaded rods and studs — continuous thread precision for structural and mechanical applications.',
    applications: ['Concrete anchoring', 'Pipe hanging', 'Structural connections', 'Chemical anchoring'],
    materials: ['Grade 4.8/8.8', 'Stainless steel 304/316', 'B7 alloy steel'],
    surfaces: ['Hot-dip galvanized', 'Zinc plated', 'Plain'],
    standards: ['DIN 975/976', 'ISO', 'ASTM A193'],
    detail: 'Thread rods are manufactured with continuous thread rolling for superior thread form accuracy. Available in lengths up to 3 meters with tight tolerance control.'
  },
  {
    id: 7,
    title: 'Rivets',
    icon: '🔘',
    image: '/images/factory/factory-9.jpg',
    videoUrl: '/videos/production-3.mp4',
    desc: 'Blind rivets, structural rivets, and solid rivets — reliable permanent fastening solutions.',
    applications: ['Sheet metal assembly', 'HVAC ductwork', 'Automotive', 'Aerospace'],
    materials: ['Aluminum 5050', 'Steel/steel', 'Stainless steel', 'Copper'],
    surfaces: ['Anodized', 'Painted', 'Zinc plated', 'Natural'],
    standards: ['DIN 7337', 'ISO 15983/15984', 'IFI'],
    detail: 'Our rivet range includes open-end, closed-end, multi-grip, and structural blind rivets. Manufactured with precise mandrel break-load control for consistent installation.'
  },
  {
    id: 8,
    title: 'Washers',
    icon: '⭕',
    image: '/images/factory/factory-10.jpg',
    videoUrl: '/videos/production-4.mp4',
    desc: 'Flat washers, spring washers, lock washers — essential load distribution and vibration resistance.',
    applications: ['General assembly', 'Structural connections', 'Vibration resistance', 'Sealing'],
    materials: ['Carbon steel', 'Stainless steel 304/316', 'Brass', 'Nylon'],
    surfaces: ['Zinc plated', 'Hot-dip galvanized', 'Black oxide', 'Dacromet'],
    standards: ['DIN 125/127/9021', 'ISO 7089/7090', 'ASTM F436'],
    detail: 'Our washer production features precision stamping and heat treatment, ensuring consistent flatness, hardness, and dimensional accuracy across the full size range.'
  },
  {
    id: 9,
    title: 'Springs',
    icon: '🔄',
    image: '/images/factory/factory-11.jpg',
    videoUrl: '/videos/production-1.mp4',
    desc: 'Compression, tension, and torsion springs — custom engineered for mechanical applications.',
    applications: ['Automotive', 'Industrial machinery', 'Electronics', 'Medical devices'],
    materials: ['Spring steel', 'Stainless steel 302/316', 'Music wire', 'Inconel'],
    surfaces: ['Zinc plated', 'Phosphate', 'Powder coated', 'Passivated'],
    standards: ['DIN 2098', 'ISO', 'ASTM'],
    detail: 'Custom spring manufacturing with CNC coiling, stress relieving, and comprehensive load testing. From micro springs to heavy-duty industrial springs.'
  },
];

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
