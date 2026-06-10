import { usePortfolio } from '../context/PortfolioContext';

export default function FloatingContact() {
  const { data } = usePortfolio();
  const { contact } = data;

  if (!contact) return null;

  const mailtoLink = `mailto:${contact.email}?subject=${encodeURIComponent(contact.emailSubject || '')}&body=${encodeURIComponent(contact.emailBody || '')}`;

  return (
    <div className="floating-contact-container">
      {/* Zalo Button */}
      {contact.zaloLink && (
        <a 
          href={contact.zaloLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="floating-contact-btn zalo-btn"
          aria-label="Chat via Zalo"
        >
          <svg viewBox="0 0 24 24" className="floating-icon">
            <path d="M12 2C6.48 2 2 5.58 2 10c0 2.5 1.43 4.71 3.66 6.07l-.91 2.73a.5.5 0 0 0 .73.57l3.22-1.93c1.05.37 2.17.56 3.3.56 5.52 0 10-3.58 10-8s-4.48-8-10-8z" fill="currentColor" />
            <text x="12" y="13.5" fontSize="9" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" textAnchor="middle" fill="#0068FF">Zalo</text>
          </svg>
          <span className="tooltip">Chat Zalo</span>
        </a>
      )}

      {/* Mail Button */}
      {contact.email && (
        <a 
          href={mailtoLink} 
          className="floating-contact-btn email-btn"
          aria-label="Send pre-filled Email"
        >
          <svg viewBox="0 0 24 24" className="floating-icon" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <span className="tooltip">Gửi Email</span>
        </a>
      )}
    </div>
  );
}
