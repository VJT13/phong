import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { usePortfolio } from '../context/PortfolioContext';

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const faqVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

export default function SourcingSupportSection() {
  const { data } = usePortfolio();
  const { sourcing } = data;
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });
  const [activeIndex, setActiveIndex] = useState(null);

  if (!sourcing || sourcing.length === 0) return null;

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="sourcing" className="section sourcing-support-section" ref={ref}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          <div className="section-badge">❓ Sourcing FAQs</div>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Find quick answers to common questions about sourcing threaded rods and fasteners from Vietnam.
          </p>
        </motion.div>

        <div className="faq-container">
          {sourcing.map((item, i) => (
            <motion.div
              key={i}
              className={`faq-item ${activeIndex === i ? 'active' : ''}`}
              variants={faqVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              custom={i}
            >
              <button 
                className="faq-question-btn" 
                onClick={() => toggleFAQ(i)}
                aria-expanded={activeIndex === i}
              >
                <span className="faq-question-text">{item.title}</span>
                <span className="faq-icon-wrapper">
                  <svg 
                    width="12" 
                    height="12" 
                    viewBox="0 0 12 12" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{ transition: 'transform 0.3s ease', transform: activeIndex === i ? 'rotate(180deg)' : 'none' }}
                  >
                    {activeIndex === i ? (
                      <line x1="2" y1="6" x2="10" y2="6" />
                    ) : (
                      <>
                        <line x1="6" y1="2" x2="6" y2="10" />
                        <line x1="2" y1="6" x2="10" y2="6" />
                      </>
                    )}
                  </svg>
                </span>
              </button>

              <AnimatePresence initial={false}>
                {activeIndex === i && (
                  <motion.div
                    className="faq-answer-container"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="faq-answer-content">
                      <p>{item.desc}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
