import { usePortfolio } from '../context/PortfolioContext';

export default function FloatingContact() {
  const { data } = usePortfolio();
  const { contact } = data;

  if (!contact) return null;

  const email = contact.email;
  const subject = encodeURIComponent(contact.emailSubject || '');
  const body = encodeURIComponent(contact.emailBody || '');
  
  const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
  
  const whatsappUrl = contact.whatsappLink || 'https://wa.me/84915601096';
  const linkedinUrl = contact.linkedinLink || 'https://www.linkedin.com/in/orinbui-tecomaco/';

  const handleMailClick = (e) => {
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) {
      e.preventDefault();
      window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="floating-contact-container">
      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-contact-btn whatsapp-btn"
        aria-label="Chat via WhatsApp"
      >
        <img src="/images/icon_whatsapp.png" alt="WhatsApp" className="whatsapp-png" />
        <span className="tooltip">WhatsApp Orin Directly</span>
      </a>

      {/* LinkedIn Button */}
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-contact-btn linkedin-btn"
        aria-label="Connect via LinkedIn"
      >
        <svg viewBox="0 0 24 24" className="floating-icon" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
        <span className="tooltip">Connect with Orin on LinkedIn</span>
      </a>

      {/* Mail Button */}
      {contact.email && (
        <a
          href={mailtoLink}
          onClick={handleMailClick}
          className="floating-contact-btn email-btn"
          aria-label="Send Email"
        >
          <svg viewBox="0 0 24 24" className="floating-icon" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <span className="tooltip">Send RFQ to Orin</span>
        </a>
      )}
    </div>
  );
}
