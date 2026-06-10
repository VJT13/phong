import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { usePortfolio } from '../context/PortfolioContext';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function AboutSection() {
  const { data } = usePortfolio();
  const { about, timeline } = data;
  const { ref: sectionRef, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: timelineRef, inView: timelineInView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="about" className="section" style={{ background: 'var(--surface)' }} ref={sectionRef}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          <div className="section-badge">{about.badge}</div>
          <h2 className="section-title">{about.title}</h2>
          <p className="section-subtitle">{about.subtitle}</p>
        </motion.div>

        <div className="about-grid">
          <motion.div
            className="about-content"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3>{about.heading}</h3>
            {about.paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
            <div className="about-features">
              {about.features.map((f, i) => (
                <motion.div
                  key={i}
                  className="about-feature"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <div className="about-feature-icon">{f.icon}</div>
                  <div className="about-feature-text">{f.text}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="about-gallery"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Swiper
              className="gallery-swiper"
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              loop
              spaceBetween={0}
              slidesPerView={1}
            >
              {about.gallery.map((img, i) => (
                <SwiperSlide key={i}>
                  <img src={img.src} alt={img.alt} loading="lazy" />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          ref={timelineRef}
          className="timeline"
          initial="hidden"
          animate={timelineInView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <div className="section-badge">📅 Our Journey</div>
            <h2 className="section-title" style={{ fontSize: '2rem' }}>Milestones of Growth</h2>
          </div>
          <div className="timeline-container">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                className={`timeline-item ${i % 2 === 0 ? 'timeline-left' : 'timeline-right'}`}
                initial={{ opacity: 0, y: 30 }}
                animate={timelineInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <div className="timeline-content">
                  <div className="timeline-year">{item.year}</div>
                  <div className="timeline-desc">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
