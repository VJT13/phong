import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function HeroSection() {
  const { data } = usePortfolio();
  const { hero } = data;

  if (!hero) return null;

  return (
    <section id="home" className="hero-split-section">
      <div className="hero-split-bg">
        <div className="hero-split-overlay" />
      </div>
      
      <div className="hero-split-container">
        {/* Left Half: Company Info */}
        <motion.div 
          className="hero-split-left"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          <div className="hero-company-badge">
            <span className="pulse-dot"></span>
            {hero.badge || "130+ khách tại EU"}
          </div>
          
          <h1 className="hero-company-title">
            {hero.companyHeading}
          </h1>
          
          <p className="hero-company-desc">
            {hero.companySubheading}
          </p>

          {hero.companyImage && (
            <div className="hero-company-image-container">
              <img 
                src={hero.companyImage} 
                alt="TecoMaco Sourcing Facility" 
                className="hero-company-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/factory/factory-2.jpg";
                }}
              />
            </div>
          )}

          <div className="hero-company-addresses">
            <div className="address-item">
              <span className="address-icon">🏢</span>
              <div className="address-details">
                <strong>Head Office</strong>
                <p>{hero.headOffice}</p>
              </div>
            </div>
            <div className="address-item">
              <span className="address-icon">🏭</span>
              <div className="address-details">
                <strong>Factory Address</strong>
                <p>{hero.factoryAddress}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Half: About Me (Orin Bui) */}
        <motion.div 
          className="hero-split-right"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
        >
          <div className="me-card">
            <div className="me-avatar-container">
              <img 
                src={hero.me?.photo || "/images/orin-bui.jpg"} 
                alt={hero.me?.name || "Orin Bui"} 
                className="me-avatar" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400";
                }}
              />
              <div className="avatar-status" title="Online"></div>
            </div>
            
            <div className="me-info">
              <h2 className="me-name">{hero.me?.name || "Orin Bui"}</h2>
              
              <div className="me-role">{hero.me?.role || "International Sales Manager"}</div>
              
              <div className="me-bio">
                {hero.me?.paragraphs ? hero.me.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                )) : (
                  <>
                    <p>Hello, I’m Orin Bui, International Sales Manager at TecoMaco Vietnam.</p>
                    <p>I work directly with importers, distributors, wholesalers, and industrial customers across Europe to support sourcing of threaded rods, studs, and fasteners from Vietnam.</p>
                    <p>My role is not only to provide quotations, but also to support customers throughout the sourcing process — including technical clarification, packaging requirements, export documentation, production follow-up, and shipment coordination.</p>
                  </>
                )}
              </div>
              
              <div className="me-contact-info">
                <a href={`https://wa.me/${(hero.me?.mobile || '84915601096').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="contact-item">
                  <span className="contact-icon-wrapper whatsapp">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M17.472 14.382c-.022-.015-.022-.015-.262-.136-.24-.12-1.414-.698-1.633-.778-.22-.08-.38-.12-.54.12-.16.24-.62.778-.76.94-.14.16-.28.18-.52.06-.24-.12-.992-.367-1.89-1.168-.7-.624-1.173-1.395-1.31-1.637-.14-.24-.015-.37.105-.49.108-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.785-.195-.47-.387-.407-.54-.415-.156-.008-.336-.01-.516-.01-.18 0-.472.068-.72.336-.247.267-.945.927-.945 2.261 0 1.335.97 2.625 1.105 2.805.135.18 1.9 2.9 4.6 4.075.64.28 1.14.448 1.53.573.645.205 1.23.176 1.696.107.52-.078 1.414-.578 1.614-1.138.2-.56.2-1.04.14-1.138-.06-.097-.22-.155-.427-.272m-5.46-9.356c-4.477 0-8.12 3.642-8.12 8.119 0 1.433.372 2.83 1.08 4.057l-1.148 4.195 4.29-1.127c1.176.64 2.5.98 3.86.98 4.478 0 8.12-3.643 8.12-8.12 0-4.477-3.642-8.119-8.12-8.119m0-1.6c5.362 0 9.71 4.348 9.71 9.719 0 5.362-4.348 9.71-9.71 9.71a9.647 9.647 0 0 1-4.945-1.353l-5.38 1.413 1.438-5.25a9.664 9.664 0 0 1-1.547-5.187c0-5.361 4.348-9.71 9.71-9.71"/>
                    </svg>
                  </span>
                  <div>
                    <strong>WhatsApp / Mobile</strong>
                    <p>{hero.me?.mobile || "+84 915601096"}</p>
                  </div>
                </a>

                <a href={`mailto:${hero.me?.email || 'orin.bui@tecomaco.com'}`} className="contact-item">
                  <span className="contact-icon-wrapper email">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <div>
                    <strong>Email Address</strong>
                    <p>{hero.me?.email || "orin.bui@tecomaco.com"}</p>
                  </div>
                </a>

                <a href={hero.me?.linkedin || "https://www.linkedin.com/in/orinbui-tecomaco/"} target="_blank" rel="noopener noreferrer" className="contact-item">
                  <span className="contact-icon-wrapper linkedin">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </span>
                  <div>
                    <strong>LinkedIn</strong>
                    <p>Connect with me</p>
                  </div>
                </a>
              </div>

              <div className="me-cta-group">
                <a 
                  href="#contact" 
                  className="btn btn-primary btn-glow"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Contact Me / Send Inquiry
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
