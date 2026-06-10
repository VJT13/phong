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
    <section id="contact" className="section" style={{ background: 'var(--surface)' }} ref={ref}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          <div className="section-badge">{contact.badge}</div>
          <h2 className="section-title">{contact.title}</h2>
          <p className="section-subtitle">{contact.subtitle}</p>
        </motion.div>

        <div className="contact-grid">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3>Contact Information</h3>
            <p>Our team is ready to help you find the perfect fastening solution for your project.
               Reach out and we'll respond within 24 hours.</p>

            <div className="contact-details">
              <div className="contact-detail">
                <div className="contact-detail-icon">📍</div>
                <div className="contact-detail-text">
                  <strong>Factory Address</strong>
                  {contact.address}
                </div>
              </div>
              <div className="contact-detail">
                <div className="contact-detail-icon">📧</div>
                <div className="contact-detail-text">
                  <strong>Email</strong>
                  {contact.email}
                </div>
              </div>
              <div className="contact-detail">
                <div className="contact-detail-icon">📱</div>
                <div className="contact-detail-text">
                  <strong>Phone</strong>
                  {contact.phone}
                </div>
              </div>
              <div className="contact-detail">
                <div className="contact-detail-icon">🕐</div>
                <div className="contact-detail-text">
                  <strong>Working Hours</strong>
                  {contact.workingHours}
                </div>
              </div>
            </div>

            <div className="contact-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5!2d106.6!3d10.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ4JzAwLjAiTiAxMDbCsDM2JzAwLjAiRQ!5e0!3m2!1sen!2s!4v1600000000000!5m2!1sen!2s"
                title="Portfolio Location Map"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          <motion.div
            className="contact-form-wrapper"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="contact-form-title">Send Us an Inquiry</h3>
            <p className="contact-form-subtitle">Fill out the form and our team will get back to you shortly.</p>
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
                  <label className="form-label" htmlFor="contact-phone">Phone</label>
                  <input id="contact-phone" className="form-input" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+84 xxx xxx xxx" disabled={loading} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-subject">Subject</label>
                <input id="contact-subject" className="form-input" type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Quotation request, product inquiry..." required disabled={loading} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">Message</label>
                <textarea id="contact-message" className="form-textarea" name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your requirements..." required disabled={loading} />
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
                {loading ? 'Sending Inquiry...' : 'Send Inquiry →'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
