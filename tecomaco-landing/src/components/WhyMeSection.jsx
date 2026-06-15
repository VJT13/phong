import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

export default function WhyMeSection() {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  const points = [
    { title: "Direct access to the factory", desc: "Work directly with the production source in Vietnam for better pricing and faster technical clarifications." },
    { title: "Fast quotation support", desc: "Get quick responses and accurate RFQ estimations to keep your supply chain running smoothly." },
    { title: "Technical clarification", desc: "Ensure all standard tolerances (DIN 975, DIN 976, ASTM), grades, and dimensions are fully verified." },
    { title: "Export documentation support", desc: "Full assistance with Mill Test Certificates (EN 10204 3.1), Certificates of Origin, and REX statements." },
    { title: "Production follow-up", desc: "Receive regular progress updates, quality inspection checks, and custom packaging audits." },
    { title: "Shipment coordination", desc: "Hassle-free shipping management, container loading oversight, and logistics support." }
  ];

  return (
    <section id="why-me" className="section why-me-section" ref={ref}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          <div className="section-badge">🤝 PARTNERSHIP ADVANTAGES</div>
          <h2 className="section-title">Why Work With Me?</h2>
          <p className="section-subtitle">
            I act as your direct, responsive bridge to the factory, managing every step of the quotation, production, and shipment coordination.
          </p>
        </motion.div>

        <div className="why-me-grid">
          {points.map((p, i) => (
            <motion.div
              key={i}
              className="why-me-card"
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              custom={i}
              whileHover={{ y: -5, boxShadow: 'var(--shadow-md)' }}
            >
              <div className="why-me-icon-wrapper">
                <span className="why-me-check">✓</span>
              </div>
              <div className="why-me-content">
                <h3 className="why-me-card-title">{p.title}</h3>
                <p className="why-me-card-desc">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
