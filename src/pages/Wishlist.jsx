import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '../layout/Layout';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
import '../styles/wishlist.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) return (
    <Layout>
      <div className="empty-page">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="empty-icon">❤️</div>
          <h2>Your Wishlist is Empty</h2>
          <p>Save your favorite watches here</p>
          <Link to="/products" className="btn-primary">Explore Collection</Link>
        </motion.div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="wishlist-page">
        <div className="container">
          <motion.h1 className="page-title"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            My <span className="gold-text">Wishlist</span>
          </motion.h1>
          <div className="products-grid">
            {wishlist.map((product, i) => (
              <motion.div key={product._id} className="product-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}>
                <div className="product-img-wrap">
                  {product.images && product.images?.length > 0 ? (
                    <img src={product.images[0].url} alt={product.name} className="product-img" />
                  ) : (
                    <div className="product-img-placeholder"><span>⌚</span></div>
                  )}
                </div>
                <div className="product-info">
                  <p className="product-category">{product.category}</p>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="price-main">Rs. {(product.discountPrice || product.price).toLocaleString()}</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button className="product-cart-btn" onClick={() => addToCart(product)} style={{ flex: 1 }}>
                      <FiShoppingCart style={{ marginRight: '6px' }} /> Add to Cart
                    </button>
                    <button className="product-cart-btn"
                      onClick={() => removeFromWishlist(product._id)}
                      style={{ padding: '10px 14px', color: '#e74c3c', borderColor: '#e74c3c' }}>
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;