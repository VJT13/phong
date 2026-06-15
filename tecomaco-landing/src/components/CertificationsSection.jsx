import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { usePortfolio } from '../context/PortfolioContext';
import AnimatedCounter from './AnimatedCounter';

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

function getDownloadUrl(url) {
  if (!url) return '';
  const driveRegex = /\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return url;
}

function CertModal({ cert, onClose }) {
  if (!cert) return null;
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
        style={{ maxWidth: '1000px' }}
      >
        <div className="modal-header" style={{ height: '100px', background: 'var(--primary-dark)' }}>
          <h3 style={{ color: 'var(--white)', margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{cert.title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ padding: '2rem' }}>
          <p style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '1rem' }}>
            {cert.shortDesc}
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            {cert.longDesc}
          </p>
          
          {cert.pdfUrl && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <a 
                  href={getDownloadUrl(cert.pdfUrl)} 
                  download 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="modal-body-download-btn"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download Document
                </a>
              </div>
              <div className="pdf-viewer-container">
                <iframe
                  src={`${cert.pdfUrl}#toolbar=0`}
                  title={`${cert.title} Document`}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CertificationsSection() {
  const { data } = usePortfolio();
  const { certifications } = data;
  const [selectedCert, setSelectedCert] = useState(null);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="certifications" className="section certs-section" ref={ref}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          <div className="section-badge">{certifications.badge}</div>
          <h2 className="section-title">{certifications.title}</h2>
          <p className="section-subtitle">{certifications.subtitle}</p>
        </motion.div>

        <div className="certs-grid">
          {certifications.list.map((cert, i) => (
            <motion.div
              key={cert.id}
              className="cert-card"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              onClick={() => setSelectedCert(cert)}
              style={{ cursor: 'pointer' }}
            >
              <div className="cert-icon">{cert.icon}</div>
              <h3 className="cert-title">{cert.title}</h3>
              <p className="cert-desc">{cert.shortDesc}</p>
              <div style={{ marginTop: '1rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)' }}>
                View Certificate Document →
              </div>
            </motion.div>
          ))}
        </div>

        {certifications.stats && (
          <div className="certs-stats">
            {certifications.stats.map((stat, i) => (
              <motion.div
                key={i}
                className="cert-stat"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
              >
                <div className="cert-stat-number">
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                </div>
                <div className="cert-stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCert && (
          <CertModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
