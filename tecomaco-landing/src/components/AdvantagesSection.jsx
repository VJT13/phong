import { motion } from 'framer-motion';
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
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// Map title to an appropriate emoji icon
const advantageIcons = {
  "Avoid Up To 60% EU Anti-Dumping Duty": "🇪🇺",
  "Factory-Direct Communication": "🗣️",
  "Specialized in Threaded Rod Manufacturing": "🎯",
  "Complete Export Documentation Support": "📋",
  "OEM Packaging & Private Label Solutions": "📦",
  "Experience Supporting European Importers & Distributors": "🤝",
  "Stable Supply Capacity": "📈",
  "Responsive Quotation & Project Follow-Up": "⚡",
  "Flexible Manufacturing Solutions": "⚙️",
  "Long-Term Partnership Mindset": "🌱"
};

export default function AdvantagesSection() {
  const { data } = usePortfolio();
  const { advantages } = data;
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  if (!advantages || advantages.length === 0) return null;

  // Split out the first (Anti-Dumping Duty) advantage to feature it prominently
  const featuredAdvantage = advantages[0];
  const gridAdvantages = advantages.slice(1);

  return (
    <section id="advantages" className="section advantages-section" ref={ref}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          <div className="section-badge">🏆 Competitive Edge</div>
          <h2 className="section-title">Why Choose TecoMaco Vietnam?</h2>
          <p className="section-subtitle">
            Leveraging Vietnam's manufacturing strengths to deliver commercial benefits,
            direct cooperation, and complete trade compliance for European buyers.
          </p>
        </motion.div>

        {/* Featured Card: Anti-Dumping Duty */}
        {featuredAdvantage && (
          <motion.div
            className="advantage-featured-card"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="featured-badge">🔥 Key Trade Advantage</div>
            <div className="featured-card-content">
              <div className="featured-icon">
                {advantageIcons[featuredAdvantage.title] || "🇪🇺"}
              </div>
              <div className="featured-text">
                <h3 className="featured-title">{featuredAdvantage.title}</h3>
                <p className="featured-desc">{featuredAdvantage.desc}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Grid for other 9 advantages */}
        <div className="advantages-grid">
          {gridAdvantages.map((adv, i) => (
            <motion.div
              key={i}
              className="advantage-card"
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              custom={i}
              whileHover={{ y: -6 }}
            >
              <div className="advantage-card-header">
                <span className="advantage-icon">
                  {advantageIcons[adv.title] || "⚡"}
                </span>
                <h3 className="advantage-title">{adv.title}</h3>
              </div>
              <p className="advantage-desc">{adv.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
