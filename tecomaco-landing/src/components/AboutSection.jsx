import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const factoryImages = [
  { src: '/images/factory/factory-2.jpg', alt: 'Factory Overview' },
  { src: '/images/factory/factory-4.jpg', alt: 'Production Line' },
  { src: '/images/factory/factory-5.jpg', alt: 'Manufacturing Equipment' },
  { src: '/images/factory/factory-6.jpg', alt: 'Quality Control' },
  { src: '/images/factory/factory-7.jpg', alt: 'Heat Treatment' },
  { src: '/images/factory/factory-8.jpg', alt: 'Surface Treatment' },
  { src: '/images/factory/factory-9.jpg', alt: 'Packaging Line' },
  { src: '/images/factory/factory-10.jpg', alt: 'Warehouse' },
  { src: '/images/factory/factory-11.jpg', alt: 'CNC Machining' },
  { src: '/images/factory/factory-12.jpg', alt: 'Assembly Area' },
];

const timeline = [
  { year: '2005', desc: 'Precision Machining Origins — founded in China with a focus on high-precision custom automotive components.' },
  { year: '2013', desc: 'Tianjin Factory Establishment — expanded production lines to meet growing domestic and international fastener demands.' },
  { year: '2019', desc: 'Vietnam Factory Construction — established our state-of-the-art 30,000m² manufacturing facility in Vietnam.' },
  { year: '2022', desc: 'Global Market Expansion — acquired international quality certifications and scaled exports to 50+ countries.' },
  { year: '2024', desc: 'Phase II Smart Automation — upgraded manufacturing lines with advanced German cold heading and robotic logistics.' },
];

const features = [
  { icon: '⚙️', text: 'Precision Engineering' },
  { icon: '🔬', text: 'R&D Innovation' },
  { icon: '✅', text: 'Quality Control' },
  { icon: '🌍', text: 'Global Export' },
  { icon: '🏭', text: '30,000m² Factory' },
  { icon: '📦', text: 'Custom Solutions' },
];

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function AboutSection() {
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
          <div className="section-badge">🏢 About TecoMaco</div>
          <h2 className="section-title">Building Industrial Excellence</h2>
          <p className="section-subtitle">
            From our origins in China to our world-class manufacturing facility in Vietnam,
            TecoMaco has grown into a trusted global partner for precision fastening solutions.
          </p>
        </motion.div>

        <div className="about-grid">
          <motion.div
            className="about-content"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3>Two Decades of Manufacturing Mastery</h3>
            <p>
              TecoMaco has evolved from a specialized machining workshop into a leading integrated
              industrial fastener manufacturer serving automotive, construction, and heavy industrial
              sectors worldwide.
            </p>
            <p>
              Our 30,000m² Vietnam facility features state-of-the-art cold heading, thread rolling,
              heat treatment, and surface finishing lines — enabling us to deliver over 500 tons
              of precision fasteners monthly to partners across 50+ countries.
            </p>
            <div className="about-features">
              {features.map((f, i) => (
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
              {factoryImages.map((img, i) => (
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
