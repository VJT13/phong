import { usePortfolio } from '../context/PortfolioContext';

export default function Footer() {
  const { data, triggerHighlight } = usePortfolio();
  const { contact } = data;

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleProductClick = (e) => {
    e.preventDefault();
    scrollTo('capabilities');
    triggerHighlight('Product Range');
  };

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div className="nav-logo-icon">OB</div>
            <div className="nav-logo-text">ORIN<span>BUI</span></div>
          </div>
          <p>
            Premier threaded rod and custom fastener manufacturing partner based in Vietnam.
            Precision engineering, global compliance, and stable supply chains for distributors worldwide.
          </p>
          <div className="footer-social">
            {contact.linkedinLink && (
              <a href={contact.linkedinLink} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
            )}
            {contact.whatsappLink && (
              <a href={contact.whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">wa</a>
            )}
            {contact.email && (
              <a href={`mailto:${contact.email}`} aria-label="Email">✉</a>
            )}
          </div>
        </div>

        <div>
          <h4 className="footer-title">Navigation</h4>
          <ul className="footer-links">
            <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollTo('home'); }}>Home</a></li>
            <li><a href="#capabilities" onClick={(e) => { e.preventDefault(); scrollTo('capabilities'); }}>Capabilities</a></li>
            <li><a href="#advantages" onClick={(e) => { e.preventDefault(); scrollTo('advantages'); }}>Advantages</a></li>
            <li><a href="#gallery" onClick={(e) => { e.preventDefault(); scrollTo('gallery'); }}>Factory Gallery</a></li>
            <li><a href="#certifications" onClick={(e) => { e.preventDefault(); scrollTo('certifications'); }}>Certifications</a></li>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Products</h4>
          <ul className="footer-links">
            <li><a href="#capabilities" onClick={handleProductClick}>Threaded Rods (DIN 975/976)</a></li>
            <li><a href="#capabilities" onClick={handleProductClick}>Threaded Studs</a></li>
            <li><a href="#capabilities" onClick={handleProductClick}>Stud Bolts</a></li>
            <li><a href="#capabilities" onClick={handleProductClick}>Fully Threaded Rods</a></li>
            <li><a href="#capabilities" onClick={handleProductClick}>Custom Threaded Solutions</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Contact</h4>
          <ul className="footer-links">
            <li><span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>📍 {contact.address}</span></li>
            <li><span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>📧 {contact.email}</span></li>
            <li><span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>📱 {contact.phone}</span></li>
            <li><span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>🕐 {contact.workingHours}</span></li>
          </ul>
        </div>
      </div>

      {/* <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} ORINBUI. All rights reserved.
          <a href="#/admin" style={{ color: 'var(--accent)', marginLeft: '1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            ⚙️ Dashboard
          </a>
        </span>
        <span>Precision Fastening Solutions — Made in Vietnam</span>
      </div> */}
    </footer>
  );
}
