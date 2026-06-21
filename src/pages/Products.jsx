import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Layout from '../layout/Layout';
import ProductCard from '../components/ProductCard';
import '../styles/products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';

  const categories = ['', 'Luxury', 'Sport', 'Classic', 'Digital', 'Limited Edition'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '${import.meta.env.VITE_API_URL}/api/products?';
        if (keyword) url += `keyword=${keyword}&`;
        if (category) url += `category=${category}&`;
        if (sort) url += `sort=${sort}&`;
        const { data } = await axios.get(url);
        setProducts(data.products);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, category, sort]);

  const handleFilter = (key, value) => {
    const params = Object.fromEntries(searchParams);
    if (value) params[key] = value;
    else delete params[key];
    setSearchParams(params);
  };

  return (
    <Layout>
      <div className="products-page">
        <div className="container">
          <motion.div className="products-header"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="section-label">✦ Our Collection ✦</p>
            <h1 className="section-title">
              All <span className="gold-text">Watches</span>
            </h1>
            <div className="gold-divider" />
          </motion.div>

          <div className="filters-bar">
            <div className="filter-group">
              {categories.map((cat) => (
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

          <p className="results-count">
            {products.length} watches found
            {keyword && ` for "${keyword}"`}
            {category && ` in ${category}`}
          </p>

          {loading ? (
            <div className="spinner" />
          ) : products.length === 0 ? (
            <div className="no-products">
              <p>⌚</p>
              <h3>No Products Found</h3>
              <p>Try a different filter or check back later</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product, i) => (
                <motion.div key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Products;