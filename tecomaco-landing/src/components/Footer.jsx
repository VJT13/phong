export default function Footer() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div className="nav-logo-icon">TM</div>
            <div className="nav-logo-text">Teco<span>Maco</span></div>
          </div>
          <p>
            World-class industrial fastener manufacturer based in Vietnam.
            Precision engineering, trusted globally. From staples to custom
            automotive fasteners — we build what holds the world together.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="YouTube">▶</a>
            <a href="#" aria-label="Email">✉</a>
          </div>
        </div>

        <div>
          <h4 className="footer-title">Navigation</h4>
          <ul className="footer-links">
            <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollTo('home'); }}>Home</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>About Us</a></li>
            <li><a href="#products" onClick={(e) => { e.preventDefault(); scrollTo('products'); }}>Products</a></li>
            <li><a href="#certifications" onClick={(e) => { e.preventDefault(); scrollTo('certifications'); }}>Certifications</a></li>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Products</h4>
          <ul className="footer-links">
            <li><a href="#products">Screws & Bolts</a></li>
            <li><a href="#products">Nails & Staples</a></li>
            <li><a href="#products">Rivets & Washers</a></li>
            <li><a href="#products">Thread Rods</a></li>
            <li><a href="#products">Custom Solutions</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Contact</h4>
          <ul className="footer-links">
            <li><a href="#">xxx</a></li>
            <li><a href="#">xxx</a></li>
            <li><a href="#">xxx</a></li>
            <li><a href="#">Mon-Sat 8:00-17:30</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} TecoMaco Industrial. All rights reserved.</span>
        <span>Precision Fastening Solutions — Made in Vietnam</span>
      </div>
    </footer>
  );
}
