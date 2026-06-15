import { usePortfolio } from '../context/PortfolioContext';

export default function FloatingContact() {
  const { data } = usePortfolio();
  const { contact } = data;

  if (!contact) return null;

  const mailtoLink = `mailto:${contact.email}?subject=${encodeURIComponent(contact.emailSubject || '')}&body=${encodeURIComponent(contact.emailBody || '')}`;
  const whatsappUrl = contact.whatsappLink || 'https://wa.me/84915601096';
  const linkedinUrl = contact.linkedinLink || 'https://www.linkedin.com/in/orinbui-tecomaco/';

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
        <svg viewBox="0 0 24 24" className="floating-icon" fill="currentColor">
          <path d="M17.472 14.382c-.022-.015-.022-.015-.262-.136-.24-.12-1.414-.698-1.633-.778-.22-.08-.38-.12-.54.12-.16.24-.62.778-.76.94-.14.16-.28.18-.52.06-.24-.12-.992-.367-1.89-1.168-.7-.624-1.173-1.395-1.31-1.637-.14-.24-.015-.37.105-.49.108-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.785-.195-.47-.387-.407-.54-.415-.156-.008-.336-.01-.516-.01-.18 0-.472.068-.72.336-.247.267-.945.927-.945 2.261 0 1.335.97 2.625 1.105 2.805.135.18 1.9 2.9 4.6 4.075.64.28 1.14.448 1.53.573.645.205 1.23.176 1.696.107.52-.078 1.414-.578 1.614-1.138.2-.56.2-1.04.14-1.138-.06-.097-.22-.155-.427-.272m-5.46-9.356c-4.477 0-8.12 3.642-8.12 8.119 0 1.433.372 2.83 1.08 4.057l-1.148 4.195 4.29-1.127c1.176.64 2.5.98 3.86.98 4.478 0 8.12-3.643 8.12-8.12 0-4.477-3.642-8.119-8.12-8.119m0-1.6c5.362 0 9.71 4.348 9.71 9.719 0 5.362-4.348 9.71-9.71 9.71a9.647 9.647 0 0 1-4.945-1.353l-5.38 1.413 1.438-5.25a9.664 9.664 0 0 1-1.547-5.187c0-5.361 4.348-9.71 9.71-9.71" />
        </svg>
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
