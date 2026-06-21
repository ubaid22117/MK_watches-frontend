import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const FeaturedSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/products`);
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const goNext = useCallback(() => {
    if (!products.length) return;
    setCurrentIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  useEffect(() => {
    if (products.length <= 1) return;
    intervalRef.current = setInterval(goNext, 2800);
    return () => clearInterval(intervalRef.current);
  }, [goNext, products.length]);

  const pauseAutoSlide = () => clearInterval(intervalRef.current);
  const resumeAutoSlide = () => {
    if (products.length <= 1) return;
    intervalRef.current = setInterval(goNext, 2800);
  };

  const goToIndex = (i) => {
    pauseAutoSlide();
    setCurrentIndex(i);
  };

  if (loading) return (
    <section className="featured-section">
      <div className="container"><div className="spinner" /></div>
    </section>
  );

  if (!products || products.length === 0) return (
    <section className="featured-section">
      <div className="container">
        <p className="section-label">✦ Explore Our Collection ✦</p>
        <h2 className="section-title">Our <span className="gold-text">Watches</span></h2>
        <div className="gold-divider" />
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#888' }}>No products available yet.</p>
        </div>
      </div>
    </section>
  );

  const product = products[currentIndex];

  if (!product) return null;

  const imgUrl = product.images?.[0]?.url;

  return (
    <section className="featured-section">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="section-label">✦ Explore Our Collection ✦</p>
          <h2 className="section-title">
            Our <span className="gold-text">Watches</span>
          </h2>
          <div className="gold-divider" />
          <p className="section-subtitle">
            Discover our exquisite range of luxury timepieces
          </p>
        </motion.div>

        <div
          className="lwf-wrap"
          onMouseEnter={pauseAutoSlide}
          onMouseLeave={resumeAutoSlide}
          onTouchStart={pauseAutoSlide}
          onTouchEnd={resumeAutoSlide}
        >
          <div className="lwf-stage">
            <div className="lwf-glow" />

            {/* Reflection */}
            {imgUrl && (
              <div className="lwf-reflect">
                <img src={imgUrl} alt="" />
                <div className="lwf-reflect-fade" />
              </div>
            )}

            {/* Main Frame */}
            <div className="lwf-frame" onClick={() => navigate(`/products/${product._id}`)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={product._id}
                  className="lwf-img"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                  {imgUrl ? (
                    <img src={imgUrl} alt={product.name} />
                  ) : (
                    <div className="lwf-img-placeholder">⌚</div>
                  )}
                </motion.div>
              </AnimatePresence>

              <span className="lwf-sweep" />
              <div className="lwf-frameline" />
              <span className="lwf-corner lwf-c-tl" />
              <span className="lwf-corner lwf-c-tr" />
              <span className="lwf-corner lwf-c-bl" />
              <span className="lwf-corner lwf-c-br" />
            </div>
          </div>

          {/* Caption */}
          <AnimatePresence mode="wait">
            <motion.div
              key={product._id + '-caption'}
              className="lwf-caption"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              <p className="lwf-cat">{product.category}</p>
              <p className="lwf-name">{product.name}</p>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="lwf-dots">
            {products.map((_, i) => (
              <button
                key={i}
                className={`lwf-dot ${i === currentIndex ? 'lwf-dot-active' : ''}`}
                onClick={() => goToIndex(i)}
              />
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link to="/products" className="btn-outline">View Full Collection</Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;