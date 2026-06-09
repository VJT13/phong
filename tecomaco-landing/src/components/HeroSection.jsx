import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 4 + 2,
  duration: Math.random() * 15 + 10,
  delay: Math.random() * 10,
  opacity: Math.random() * 0.5 + 0.2,
}));

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function HeroSection() {
  return (
    <section id="home" className="hero">
      <div className="hero-bg">
        <img src="/images/factory/factory-1.jpg" alt="TecoMaco Factory" loading="eager" />
      </div>
      <div className="hero-overlay" />
      <div className="hero-particles">
        {particles.map(p => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>
      <div className="hero-content">
        <motion.div className="hero-left" initial="hidden" animate="visible">
          <motion.div className="hero-badge" variants={fadeUp} custom={0}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            Made in Vietnam — Trusted Worldwide
          </motion.div>
          
          <motion.h1 className="hero-title" variants={fadeUp} custom={1}>
            Precision{' '}
            <span className="highlight">Fastening</span>
            <br />Solutions
          </motion.h1>
          
          <motion.p className="hero-subtitle" variants={fadeUp} custom={2}>
            TecoMaco delivers world-class industrial fasteners, automotive fastening solutions,
            and custom manufacturing — engineered with precision, trusted by global partners.
          </motion.p>
          
          <motion.div className="hero-cta-group" variants={fadeUp} custom={3}>
            <a href="#products" className="btn btn-primary" onClick={(e) => { e.preventDefault(); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Explore Products
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
            <a href="#contact" className="btn btn-outline" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Contact Us
            </a>
          </motion.div>
          
          <motion.div className="hero-stats" variants={fadeUp} custom={4}>
            <div className="hero-stat">
              <div className="hero-stat-number"><AnimatedCounter end={30000} suffix="" /></div>
              <div className="hero-stat-label">m² Factory</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number"><AnimatedCounter end={300} suffix="+" /></div>
              <div className="hero-stat-label">Employees</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number"><AnimatedCounter end={20} suffix="+" /></div>
              <div className="hero-stat-label">Years Exp.</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number"><AnimatedCounter end={50} suffix="+" /></div>
              <div className="hero-stat-label">Countries</div>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div
          className="hero-right"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="hero-image-container">
            <div className="hero-image-main">
              <img src="/images/factory/factory-3.jpg" alt="TecoMaco Manufacturing" />
            </div>
            <div className="hero-floating-card card-1">
              <div className="card-icon">🏭</div>
              <div className="card-text">ISO 9001:2015</div>
            </div>
            <div className="hero-floating-card card-2">
              <div className="card-icon">🌍</div>
              <div className="card-text">Global Export</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
