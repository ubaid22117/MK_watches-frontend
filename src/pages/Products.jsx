import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Layout from '../layout/Layout';
import ProductCard from '../components/ProductCard';
import '../styles/products.css';

const API_URL = import.meta.env.VITE_API_URL;

const CATEGORIES = ['Luxury', 'Sport', 'Classic', 'Digital', 'Limited Edition'];

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get('keyword') || '';
  const sort    = searchParams.get('sort') || '';

  // Detect if we're on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${API_URL}/api/products?`;
        if (keyword) url += `keyword=${keyword}&`;
        if (sort)    url += `sort=${sort}&`;
        const { data } = await axios.get(url);
        setAllProducts(data.products || []);
      } catch (error) {
        console.error('Failed to load products:', error);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, sort]);

  const handleFilter = (key, value) => {
    const params = Object.fromEntries(searchParams);
    if (value) params[key] = value;
    else delete params[key];
    setSearchParams(params);
  };

  // Group products by category
  const grouped = CATEGORIES.reduce((acc, cat) => {
    const items = allProducts.filter(p => p.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  // For desktop: flat list with single category filter
  const category = searchParams.get('category') || '';
  const filteredDesktop = allProducts.filter(p =>
    category ? p.category === category : true
  );

  return (
    <Layout>
      <div className="products-page">
        <div className="container">

          <motion.div className="products-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}>
            <p className="section-label">✦ Our Collection ✦</p>
            <h1 className="section-title">
              All <span className="gold-text">Watches</span>
            </h1>
            <div className="gold-divider" />
          </motion.div>

          {/* ── Filters bar (shown always) ── */}
          <div className="filters-bar">
            {/* Category pills — hidden on mobile since we use rows */}
            <div className={`filter-group ${isMobile ? 'filter-group-hidden' : ''}`}>
              {['', ...CATEGORIES].map((cat) => (
                <button key={cat}
                  className={`filter-btn ${category === cat ? 'filter-active' : ''}`}
                  onClick={() => handleFilter('category', cat)}>
                  {cat || 'All'}
                </button>
              ))}
            </div>

            <select className="sort-select" value={sort}
              onChange={(e) => handleFilter('sort', e.target.value)}>
              <option value="">Sort By</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : allProducts.length === 0 ? (
            <div className="no-products">
              <p>⌚</p>
              <h3>No Products Found</h3>
              <p>Try a different filter or check back later</p>
            </div>
          ) : isMobile ? (
            /* ══ MOBILE: Netflix-style category rows ══ */
            <div className="category-rows">
              {Object.entries(grouped).map(([cat, items], rowIdx) => (
                <motion.div key={cat} className="category-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIdx * 0.08 }}>

                  <div className="category-row-header">
                    <h2 className="category-row-title">
                      <span className="gold-text">{cat}</span>
                    </h2>
                    <span className="category-row-count">{items.length} watches</span>
                  </div>

                  <div className="category-scroll-track">
                    {items.map((product, i) => (
                      <motion.div key={product._id}
                        className="category-scroll-item"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}>
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* ══ DESKTOP: Normal grid with filter ══ */
            <>
              <p className="results-count">
                {filteredDesktop.length} watches found
                {keyword && ` for "${keyword}"`}
                {category && ` in ${category}`}
              </p>
              <div className="products-grid">
                {filteredDesktop.map((product, i) => (
                  <motion.div key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default Products;