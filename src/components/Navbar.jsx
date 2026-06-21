import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiSearch, FiLogOut } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import '../styles/navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartData = useCart();
  const wishlistData = useWishlist();
  const { user, logout } = useAuth();

  const totalItems = cartData?.totalItems || 0;
  const wishlist = wishlistData?.wishlist || [];

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${searchQuery}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <motion.nav
        className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-text">MK</span>
            <span className="logo-sub">WATCHES</span>
          </Link>

          <ul className="nav-links">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/products" className="nav-link">Collection</Link></li>
            <li><Link to="/products?category=Luxury" className="nav-link">Luxury</Link></li>
            <li><Link to="/products?category=Sport" className="nav-link">Sport</Link></li>
            <li><Link to="/products?isNewArrival=true" className="nav-link">New Arrivals</Link></li>
          </ul>

          <div className="nav-icons">
            <button onClick={() => setSearchOpen(!searchOpen)} className="nav-icon-btn">
              <FiSearch />
            </button>
            <Link to="/wishlist" className="nav-icon-btn nav-badge-wrap">
              <FiHeart />
              {wishlist.length > 0 && <span className="nav-badge">{wishlist.length}</span>}
            </Link>
            <Link to="/cart" className="nav-icon-btn nav-badge-wrap">
              <FiShoppingCart />
              {totalItems > 0 && <span className="nav-badge">{totalItems}</span>}
            </Link>
            {user ? (
              <div className="nav-user-menu">
                {user.isAdmin && (
                  <Link to="/admin" className="nav-icon-btn admin-btn">Admin</Link>
                )}
                <button onClick={handleLogout} className="nav-icon-btn">
                  <FiLogOut />
                </button>
              </div>
            ) : (
              <Link to="/login" className="nav-icon-btn"><FiUser /></Link>
            )}
            <button className="nav-icon-btn mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div className="search-bar"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Search watches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="search-input"
                />
                <button type="submit" className="search-submit"><FiSearch /></button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mobile-menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <ul className="mobile-nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Collection</Link></li>
              <li><Link to="/products?category=Luxury">Luxury</Link></li>
              <li><Link to="/products?category=Sport">Sport</Link></li>
              <li><Link to="/cart">Cart ({totalItems})</Link></li>
              <li><Link to="/wishlist">Wishlist ({wishlist.length})</Link></li>
              {user ? (
                <>
                  {user.isAdmin && <li><Link to="/admin">Admin Panel</Link></li>}
                  <li><button onClick={handleLogout}>Logout</button></li>
                </>
              ) : (
                <>
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/register">Register</Link></li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;