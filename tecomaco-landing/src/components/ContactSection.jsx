import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function ContactSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [formData, setFormData] = useState({ name: '', email: '', company: '', phone: '', subject: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your inquiry! We will respond within 24 hours.');
    setFormData({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
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
          <div className="section-badge">📞 Get In Touch</div>
          <h2 className="section-title">Let's Build Industrial Excellence Together</h2>
          <p className="section-subtitle">
            Ready to source world-class fasteners? Contact our team for quotes,
            technical support, or custom manufacturing inquiries.
          </p>
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
                  xxx
                </div>
              </div>
              <div className="contact-detail">
                <div className="contact-detail-icon">📧</div>
                <div className="contact-detail-text">
                  <strong>Email</strong>
                  xxx
                </div>
              </div>
              <div className="contact-detail">
                <div className="contact-detail-icon">📱</div>
                <div className="contact-detail-text">
                  <strong>Phone</strong>
                  xxx
                </div>
              </div>
              <div className="contact-detail">
                <div className="contact-detail-icon">🕐</div>
                <div className="contact-detail-text">
                  <strong>Working Hours</strong>
                  Mon - Sat: 8:00 AM - 5:30 PM (GMT+7)
                </div>
              </div>
            </div>

            <div className="contact-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5!2d106.6!3d10.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ4JzAwLjAiTiAxMDbCsDM2JzAwLjAiRQ!5e0!3m2!1sen!2s!4v1600000000000!5m2!1sen!2s"
                title="TecoMaco Factory Location"
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
                  <input id="contact-name" className="form-input" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">Email</label>
                  <input id="contact-email" className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-company">Company</label>
                  <input id="contact-company" className="form-input" type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company name" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-phone">Phone</label>
                  <input id="contact-phone" className="form-input" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+84 xxx xxx xxx" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-subject">Subject</label>
                <input id="contact-subject" className="form-input" type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Quotation request, product inquiry..." required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">Message</label>
                <textarea id="contact-message" className="form-textarea" name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your requirements..." required />
              </div>
              <button type="submit" className="form-submit">
                Send Inquiry →
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
