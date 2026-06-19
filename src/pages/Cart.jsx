import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import '../styles/cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) return (
    <Layout>
      <div className="empty-page">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="empty-icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>No watches in your cart yet</p>
          <Link to="/products" className="btn-primary">Explore Collection</Link>
        </motion.div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="cart-page">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button className="back-btn" onClick={() => navigate(-1)}>
              <FiArrowLeft /> Continue Shopping
            </button>
            <h1 className="page-title">
              My <span className="gold-text">Cart</span>
            </h1>
          </motion.div>

          <div className="cart-layout">
            <div className="cart-items">
              {cartItems.map((item, i) => (
                <motion.div key={item._id} className="cart-item glass-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  <div className="cart-item-img">
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0].url} alt={item.name} />
                    ) : (
                      <div className="cart-img-placeholder">⌚</div>
                    )}
                  </div>
                  <div className="cart-item-info">
                    <p className="cart-item-category">{item.category}</p>
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-price">
                      Rs. {(item.discountPrice || item.price).toLocaleString()}
                    </p>
                  </div>
                  <div className="cart-item-controls">
                    <div className="qty-controls">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                    </div>
                    <p className="cart-item-total">
                      Rs. {((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                    </p>
                    <button className="cart-remove-btn" onClick={() => removeFromCart(item._id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </motion.div>
              ))}
              <button className="clear-cart-btn" onClick={clearCart}>
                Clear Entire Cart
              </button>
            </div>

            <motion.div className="cart-summary glass-card"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h3 className="summary-title">Order Summary</h3>
              <div className="summary-row">
                <span>Items ({cartItems.length})</span>
                <span>Rs. {totalPrice.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="gold-text">Free</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-total">
                <span>Total</span>
                <span>Rs. {totalPrice.toLocaleString()}</span>
              </div>
              <button className="btn-primary checkout-btn" onClick={() => navigate('/checkout')}>
                <FiShoppingBag /> Proceed to Checkout
              </button>
              <Link to="/products" className="continue-shopping">
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;