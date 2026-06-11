import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { usePortfolio } from '../context/PortfolioContext';

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const flagVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};



export default function ClientFlagsSection() {
  const { data } = usePortfolio();
  const { clients } = data;
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  if (!clients) return null;

  return (
    <section id="clients" className="section clients-flags-section" style={{ background: 'var(--surface-alt)' }} ref={ref}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          <div className="section-badge">{clients.badge || "🌍 European Market Presence"}</div>
          <h2 className="section-title">{clients.title || "Over 130+ Clients in Europe"}</h2>
          <p className="section-subtitle">
            {clients.subtitle || "Supplying threaded rods for importers and distributors across Europe."}
          </p>
        </motion.div>

        <div className="clients-flags-grid">
          {clients.countries.map((country, i) => (
            <motion.div
              key={i}
              className="country-flag-card"
              variants={flagVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              custom={i}
              whileHover={{ scale: 1.05, translateY: -5 }}
            >
              <img 
                src={`https://flagcdn.com/w160/${country.code.toLowerCase()}.png`} 
                alt={`${country.name} flag`} 
                className="country-flag-emoji"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://flagcdn.com/w160/eu.png";
                }}
              />
              <h3 className="country-flag-name">{country.name}</h3>
              <span className="country-flag-code">{country.code}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
