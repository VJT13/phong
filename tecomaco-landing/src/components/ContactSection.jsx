import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { usePortfolio } from '../context/PortfolioContext';

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function ContactSection() {
  const { data } = usePortfolio();
  const { contact } = data;
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [formData, setFormData] = useState({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  if (!contact) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: '', text: '' });
    
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      if (response.ok) {
        setStatusMsg({ type: 'success', text: 'Cảm ơn bạn! Lời nhắn của bạn đã được gửi thành công.' });
        setFormData({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
      } else {
        setStatusMsg({ type: 'error', text: result.error || 'Có lỗi xảy ra khi gửi tin nhắn.' });
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'error', text: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.' });
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMsg({ type: '', text: '' }), 5000);
    }
  };

  return (
    <section id="contact" className="section contact-section" style={{ background: 'var(--surface)' }} ref={ref}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          <div className="section-badge">{contact.badge || "📩 Send Your RFQ Today"}</div>
          <h2 className="section-title">{contact.title || "READY FOR A QUOTATION?"}</h2>
          <p className="section-subtitle">{contact.subtitle}</p>
        </motion.div>

        <div className="contact-grid">
          {/* Left Side: RFQ Guidance and Orin's Info */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3>Information We Typically Need</h3>
            <p className="rfq-guidance-intro">To provide an accurate and rapid quotation, please include as much of the following details as possible in your message:</p>
            
            <ul className="info-needed-list">
              {contact.infoNeeded && contact.infoNeeded.map((item, idx) => (
                <li key={idx}>
                  <span className="bullet-point">📌</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="manager-contact-card">
              <h4>Contact Sourcing Manager</h4>
              <div className="manager-contact-details">
                <div className="manager-name">Orin Bui</div>
                <div className="manager-role">International Sales Manager</div>
                
                <div className="manager-links">
                  <a href={`mailto:${contact.email}`} className="manager-link-item">
                    <span className="icon">📧</span>
                    <span>{contact.email}</span>
                  </a>
                  <a href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="manager-link-item">
                    <span className="icon">📱</span>
                    <span>WhatsApp: {contact.phone}</span>
                  </a>
                  <a href="https://www.linkedin.com/in/orinbui-tecomaco/" target="_blank" rel="noopener noreferrer" className="manager-link-item">
                    <span className="icon">🔗</span>
                    <span>LinkedIn Profile</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Contact/RFQ Submission Form */}
          <motion.div
            className="contact-form-wrapper"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="contact-form-title">Send Your RFQ Today</h3>
            <p className="contact-form-subtitle">Fill out the form below and we look forward to supporting your next project.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Full Name</label>
                  <input id="contact-name" className="form-input" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required disabled={loading} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">Email</label>
                  <input id="contact-email" className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required disabled={loading} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-company">Company</label>
                  <input id="contact-company" className="form-input" type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company name" disabled={loading} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-phone">Phone / WhatsApp</label>
                  <input id="contact-phone" className="form-input" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. +84 915 601 096" disabled={loading} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-subject">Subject / Project Title</label>
                <input id="contact-subject" className="form-input" type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="e.g. DIN 975 Threaded Rod RFQ" required disabled={loading} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">RFQ Message & Specifications</label>
                <textarea id="contact-message" className="form-textarea" name="message" value={formData.message} onChange={handleChange} placeholder="Please detail sizes, grades, surface treatment, quantity, and packaging requirements..." required disabled={loading} />
              </div>
              
              {statusMsg.text && (
                <div className={`form-status-message ${statusMsg.type}`} style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  marginBottom: '1.25rem',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  background: statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: statusMsg.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                  color: statusMsg.type === 'success' ? '#10b981' : '#ef4444'
                }}>
                  {statusMsg.type === 'success' ? '✅' : '⚠️'} {statusMsg.text}
                </div>
              )}

              <button type="submit" className="form-submit" disabled={loading}>
                {loading ? 'Sending Request...' : 'Send Your RFQ Today →'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
