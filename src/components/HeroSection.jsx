import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-overlay" />
        <div className="hero-circle hero-circle-1" />
        <div className="hero-circle hero-circle-2" />
        <div className="hero-circle hero-circle-3" />
      </div>

      <div className="hero-content container">
        <motion.p className="hero-label"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}>
          ✦ Luxury Timepieces Collection 2024 ✦
        </motion.p>

        <motion.h1 className="hero-title"
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}>
          Wear Time With
          <span className="hero-gold-text"> Luxury </span>
          <br />& Elegance
        </motion.h1>

        <motion.p className="hero-subtitle"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}>
          Discover the world's finest watches in one place.
          Every piece is a masterpiece that defines your personality and style.
        </motion.p>

        <motion.div className="hero-buttons"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}>
          <Link to="/products" className="btn-primary hero-btn">
            Explore Collection <FiArrowRight className="btn-icon" />
          </Link>
          <Link to="/products?category=Luxury" className="btn-outline hero-btn">
            Luxury Series
          </Link>
        </motion.div>

        <motion.div className="hero-stats"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}>
          {[
            { number: '500+', label: 'Watches' },
            { number: '10K+', label: 'Customers' },
            { number: '50+', label: 'Brands' },
            { number: '5★', label: 'Rating' },
          ].map((stat, i) => (
            <div key={i} className="hero-stat">
              <span className="stat-number">{stat.number}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div className="scroll-indicator"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}>
        <div className="scroll-dot" />
      </motion.div>
    </section>
  );
};

export default HeroSection;