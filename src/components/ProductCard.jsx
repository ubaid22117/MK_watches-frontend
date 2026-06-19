import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const discountPercent = product.discountPrice && product.price
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const displayPrice = product.discountPrice || product.price;

  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  const handleCartClick = (e) => {
    e.stopPropagation();
    if (product.stock === 0) return;
    addToCart(product);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    addToWishlist(product);
  };

  return (
    <motion.div
      className="product-card"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Image */}
      <div className="product-img-wrap">
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0].url} alt={product.name} className="product-img" />
        ) : (
          <div className="product-img-placeholder"><span>⌚</span></div>
        )}

        {/* Badges */}
        <div className="product-badges">
          {product.stock === 0 && (
            <span className="badge badge-red">Out of Stock</span>
          )}
          {discountPercent > 0 && (
            <span className="badge badge-gold">-{discountPercent}%</span>
          )}
          {product.isNewArrival && (
            <span className="badge badge-new">New</span>
          )}
          {product.isBestSeller && (
            <span className="badge badge-best">Best Seller</span>
          )}
        </div>

        {/* Wishlist Button Only */}
        <button
          className="card-wishlist-btn"
          onClick={handleWishlistClick}
          title={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FiHeart
            className={isInWishlist(product._id) ? 'heart-filled' : 'heart-empty'}
          />
        </button>
      </div>

      {/* Info */}
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>

        {/* Rating */}
        <div className="product-rating">
          {[1,2,3,4,5].map((star) => (
            <span
              key={star}
              style={{
                color: star <= Math.round(product.rating || 0)
                  ? '#D4AF37' : '#2a2a2a',
                fontSize: '0.8rem'
              }}
            >★</span>
          ))}
          <span className="rating-count">({product.numReviews || 0})</span>
        </div>

        {/* Price */}
        <div className="product-price">
          <span className="price-main">Rs. {displayPrice.toLocaleString()}</span>
          {product.discountPrice > 0 && (
            <span className="price-old">Rs. {product.price.toLocaleString()}</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          className={`product-cart-btn ${product.stock === 0 ? 'btn-disabled' : ''}`}
          onClick={handleCartClick}
          disabled={product.stock === 0}
        >
          <FiShoppingCart size={14} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;