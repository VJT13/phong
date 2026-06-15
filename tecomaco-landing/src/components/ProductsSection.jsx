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
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// Map title to icon
const categoryIcons = {
  "Product Range": "🔩",
  "Diameter Range": "📐",
  "Length Range": "📏",
  "Material Grades": "🏗️",
  "Surface Finishes": "✨",
  "Documentation Support": "📋"
};

export default function ProductsSection() {
  const { data, highlightedCategory } = usePortfolio();
  const { capabilities } = data;
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  if (!capabilities) return null;

  return (
    <section id="capabilities" className="section capabilities-section" ref={ref}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          <div className="section-badge">⚙️ Manufacturing Capabilities</div>
          <h2 className="section-title">{capabilities.headline}</h2>
          <p className="section-subtitle">{capabilities.subheadline}</p>
        </motion.div>

        <div className="capabilities-grid">
          {capabilities.categories.map((category, i) => (
            <motion.div
              key={i}
              className={`capability-card ${highlightedCategory === category.title ? 'highlight-pulse' : ''}`}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              custom={i}
              whileHover={{ y: -8, boxShadow: 'var(--shadow-lg)' }}
            >
              <div className="capability-card-header">
                <div className="capability-icon">
                  {categoryIcons[category.title] || "⚙️"}
                </div>
                <h3 className="capability-card-title">{category.title}</h3>
              </div>
              
              <div className="capability-card-body">
                <ul className="capability-list">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="capability-item">
                      <span className="bullet-check">✓</span>
                      <span className="item-text">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
