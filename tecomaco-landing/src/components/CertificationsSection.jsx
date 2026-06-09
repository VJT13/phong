import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AnimatedCounter from './AnimatedCounter';

const certifications = [
  {
    id: 1,
    icon: '🏆',
    title: 'ISO 9001:2015',
    pdfUrl: '/certs/ISO 90012015 - DRILLMACO INDUSTRIAL COMPANY LIMITED  (1).pdf',
    shortDesc: 'Quality Management System certificate validating that TecoMaco maintains strict manufacturing standards, quality controls, and customer-focused processes.',
    longDesc: 'The ISO 9001:2015 standard is the international benchmark for Quality Management Systems (QMS). For TecoMaco, this certification guarantees that every manufacturing step — from raw steel procurement to cold forging, thread rolling, heat treatment, and packaging — is governed by strict quality management procedures. This ensures high dimensional accuracy, consistent mechanical performance, and complete traceabilty of our fastener products.'
  },
  {
    id: 2,
    icon: '🌿',
    title: 'ISO 14001:2015',
    pdfUrl: '/certs/ISO 140012015 - DRILLMACO INDUSTRIAL COMPANY LIMITED.pdf',
    shortDesc: 'Environmental Management System certification validating TecoMaco\'s dedication to eco-friendly production, energy efficiency, and waste management.',
    longDesc: 'ISO 14001:2015 specifies the requirements for an environmental management system that an organization can use to enhance its environmental performance. TecoMaco is committed to minimizing the environmental footprint of our fastener manufacturing processes. This includes operating state-of-the-art closed-loop water treatment systems, optimizing energy efficiency in our heat treatment furnaces, and recycling 100% of steel scrap.'
  },
  {
    id: 3,
    icon: '🛡️',
    title: 'API Spec Q1 / Certificate Q1-2527',
    pdfUrl: '/certs/Certificate Q1-2527.pdf',
    shortDesc: 'American Petroleum Institute Specification Q1 certification, establishing our capability for high-strength energy infrastructure components.',
    longDesc: 'The API Spec Q1 certification is a prestigious quality management system standard designed specifically for manufacturing organizations in the petroleum and natural gas industry. This certification highlights TecoMaco\'s engineering capability to manufacture high-strength, high-integrity industrial fasteners capable of enduring extreme pressures, corrosive environments, and structural fatigue in critical energy infrastructure applications.'
  },
  {
    id: 4,
    icon: '📋',
    title: 'ISO standard compliance certificate',
    pdfUrl: '/certs/Certificate ISO-2660 (1).pdf',
    shortDesc: 'Conformity certification verifying structural fastener reliability and mechanical safety tolerances.',
    longDesc: 'This compliance certificate validates that TecoMaco fastener lines conform fully to international ISO mechanical safety and performance standards. It ensures that our tensile strength, yield strength, hardness, and corrosion-resistance specifications meet the safety requirements necessary for high-load industrial, construction, and automotive applications.'
  },
  {
    id: 5,
    icon: '🏢',
    title: 'TecoMaco Business Registration',
    pdfUrl: '/certs/TecoMaco Business Registration Certificate - Latest Version.pdf',
    shortDesc: 'Official business registration and manufacturing license for TecoMaco Vietnam operations.',
    longDesc: 'This document is the official business registration certificate issued by the Department of Planning and Investment of Vietnam. It validates TecoMaco as a legally registered enterprise authorized to conduct high-tech manufacturing, metal machining, chemical surface plating, and global exporting of industrial fasteners from our industrial zone facility.'
  },
  {
    id: 6,
    icon: '⚙️',
    title: 'TecoMaco PT Registration',
    pdfUrl: '/certs/TecoMaco PT Business Registration Certificate - Latest Version.pdf',
    shortDesc: 'Official business license for our specialized heat treatment and plating processing branch.',
    longDesc: 'This registration license authorizes operations for our specialized manufacturing branch. It covers advanced metal processing, including automated heat treatment furnaces, zinc plating lines, hot-dip galvanizing, and logistics management — ensuring our in-house capability covers the entire production lifecycle.'
  },
];

const stats = [
  { number: 50, suffix: '+', label: 'Export Countries' },
  { number: 500, suffix: 'T', label: 'Monthly Output' },
  { number: 10000, suffix: '+', label: 'Product SKUs' },
  { number: 99, suffix: '.5%', label: 'Quality Rate' },
];

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

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
          
          <div className="pdf-viewer-container">
            <iframe
              src={`${cert.pdfUrl}#toolbar=0`}
              title={`${cert.title} PDF Document`}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CertificationsSection() {
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
          <div className="section-badge">🏆 Certifications & Achievements</div>
          <h2 className="section-title">Trusted Worldwide</h2>
          <p className="section-subtitle">
            Our commitment to quality is backed by internationally recognized certifications
            and a proven track record of manufacturing excellence.
          </p>
        </motion.div>

        <div className="certs-grid">
          {certifications.map((cert, i) => (
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

        <div className="certs-stats">
          {stats.map((stat, i) => (
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
      </div>

      <AnimatePresence>
        {selectedCert && (
          <CertModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
