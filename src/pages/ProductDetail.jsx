import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Layout from '../layout/Layout';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { FiHeart, FiShoppingCart, FiArrowLeft, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import '../styles/productdetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/${id}`
        );
        setProduct(data.product);

        // Fetch related products
        const relatedRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products?category=${data.product.category}`
        );
        const filtered = relatedRes.data.products.filter(
          (p) => p._id !== id
        ).slice(0, 4);
        setRelatedProducts(filtered);
      } catch (error) {
        console.error('Product not found:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
    setSelectedImg(0);
    setQuantity(1);
  }, [id]);

  if (loading) return (
    <Layout>
      <div style={{ paddingTop: '150px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    </Layout>
  );

  if (!product) return (
    <Layout>
      <div style={{ paddingTop: '150px', textAlign: 'center', minHeight: '60vh' }}>
        <h2 style={{ color: '#D4AF37', fontFamily: 'Playfair Display, serif' }}>
          Product Not Found
        </h2>
        <button className="btn-outline" onClick={() => navigate('/products')}
          style={{ marginTop: '1rem' }}>
          Back to Collection
        </button>
      </div>
    </Layout>
  );

  const displayPrice = product.discountPrice || product.price;
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const specs = product.specifications || {};
  const hasSpecs = Object.values(specs).some(v => v && v.trim() !== '');

  return (
    <Layout>
      <div className="detail-page">
        <div className="container">

          {/* Breadcrumb */}
          <div className="detail-breadcrumb">
            <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
            <span className="breadcrumb-sep">›</span>
            <span onClick={() => navigate('/products')} className="breadcrumb-link">Collection</span>
            <span className="breadcrumb-sep">›</span>
            <span onClick={() => navigate(`/products?category=${product.category}`)}
              className="breadcrumb-link">{product.category}</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">{product.name}</span>
          </div>

          {/* Main Grid */}
          <div className="detail-grid">

            {/* Images */}
            <motion.div className="detail-images"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}>

              <div className="main-image-wrap">
                {/* Badges */}
                <div className="detail-badges">
                  {product.stock === 0 && <span className="badge badge-red">Out of Stock</span>}
                  {discountPercent > 0 && <span className="badge badge-gold">-{discountPercent}% OFF</span>}
                  {product.isNewArrival && <span className="badge badge-new">New Arrival</span>}
                  {product.isBestSeller && <span className="badge badge-best">Best Seller</span>}
                </div>

                <div className="main-image">
                  {product.images && product.images.length > 0 ? (
                    <motion.img
                      key={selectedImg}
                      src={product.images[selectedImg].url}
                      alt={product.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  ) : (
                    <div className="img-placeholder">⌚</div>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="thumb-images">
                  {product.images.map((img, i) => (
                    <motion.img
                      key={i}
                      src={img.url}
                      alt={`view-${i + 1}`}
                      className={`thumb ${selectedImg === i ? 'thumb-active' : ''}`}
                      onClick={() => setSelectedImg(i)}
                      whileHover={{ scale: 1.05 }}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div className="detail-info"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}>

              <p className="detail-category">{product.category}</p>
              <h1 className="detail-name">{product.name}</h1>

              {/* Rating Row */}
              <div className="detail-rating-row">
                <div className="detail-stars">
                  {[1,2,3,4,5].map((star) => (
                    <span key={star} style={{
                      color: star <= Math.round(product.rating || 0) ? '#D4AF37' : '#2a2a2a',
                      fontSize: '1rem'
                    }}>★</span>
                  ))}
                </div>
                <span className="detail-rating-text">
                  {product.rating ? product.rating.toFixed(1) : '0.0'}
                </span>
                <span className="detail-reviews-count">
                  ({product.numReviews || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="detail-price-block">
                <span className="detail-price-main">
                  Rs. {displayPrice.toLocaleString()}
                </span>
                {product.discountPrice > 0 && (
                  <>
                    <span className="detail-price-old">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    <span className="detail-price-save">
                      Save Rs. {(product.price - product.discountPrice).toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="detail-stock-badge">
                {product.stock > 5 ? (
                  <span className="stock-high">✓ In Stock ({product.stock} available)</span>
                ) : product.stock > 0 ? (
                  <span className="stock-low">⚠ Only {product.stock} left in stock!</span>
                ) : (
                  <span className="stock-out">✗ Out of Stock</span>
                )}
              </div>

              {/* Short Description */}
              <p className="detail-short-desc">
                {product.description?.slice(0, 150)}
                {product.description?.length > 150 ? '...' : ''}
              </p>

              {/* Quantity */}
              {product.stock > 0 && (
                <div className="detail-quantity-row">
                  <span className="qty-label">Quantity</span>
                  <div className="qty-controls">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >−</button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock}
                    >+</button>
                  </div>
                  <span className="qty-total">
                    Total: <strong style={{ color: '#D4AF37' }}>
                      Rs. {(displayPrice * quantity).toLocaleString()}
                    </strong>
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="detail-action-buttons">
                <button
                  className="detail-cart-btn"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <FiShoppingCart />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button
                  className={`detail-wish-btn ${isInWishlist(product._id) ? 'wished' : ''}`}
                  onClick={() => addToWishlist(product)}
                >
                  <FiHeart />
                  {isInWishlist(product._id) ? 'Saved' : 'Wishlist'}
                </button>
              </div>

              {/* Delivery Info */}
              <div className="detail-delivery-info">
                <div className="delivery-item">
                  <FiTruck className="delivery-icon" />
                  <div>
                    <p className="delivery-title">Free Delivery</p>
                    <p className="delivery-sub">On all orders nationwide</p>
                  </div>
                </div>
                <div className="delivery-item">
                  <FiShield className="delivery-icon" />
                  <div>
                    <p className="delivery-title">Authentic Product</p>
                    <p className="delivery-sub">100% genuine guarantee</p>
                  </div>
                </div>
                <div className="delivery-item">
                  <FiRefreshCw className="delivery-icon" />
                  <div>
                    <p className="delivery-title">Easy Returns</p>
                    <p className="delivery-sub">7-day return policy</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs Section */}
          <motion.div className="detail-tabs-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}>

            <div className="detail-tabs">
              {['description', 'specifications'].map((tab) => (
                <button
                  key={tab}
                  className={`detail-tab ${activeTab === tab ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="detail-tab-content">
              {activeTab === 'description' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="tab-description"
                >
                  <p>{product.description}</p>
                </motion.div>
              )}

              {activeTab === 'specifications' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="tab-specs"
                >
                  {hasSpecs ? (
                    <div className="specs-table">
                      {[
                        { label: 'Movement', value: specs.movement },
                        { label: 'Case Material', value: specs.caseMaterial },
                        { label: 'Case Size', value: specs.caseSize },
                        { label: 'Water Resistance', value: specs.waterResistance },
                        { label: 'Strap Material', value: specs.strapMaterial },
                        { label: 'Crystal', value: specs.crystal },
                      ].filter(s => s.value).map((spec, i) => (
                        <div key={i} className={`spec-row ${i % 2 === 0 ? 'spec-row-even' : ''}`}>
                          <span className="spec-key">{spec.label}</span>
                          <span className="spec-val">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#555', padding: '1rem 0' }}>
                      No specifications available for this product.
                    </p>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.div className="related-section"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}>
              <div className="related-header">
                <p className="section-label">✦ Same Category ✦</p>
                <h2 className="section-title">
                  Related <span className="gold-text">Watches</span>
                </h2>
                <div className="gold-divider" />
              </div>
              <div className="products-grid">
                {relatedProducts.map((p, i) => (
                  <motion.div key={p._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}>
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;