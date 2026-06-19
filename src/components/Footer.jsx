import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiPhone, FiMail, FiMapPin, FiSend } from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Successfully subscribed to newsletter!');
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h2 className="footer-logo">MK</h2>
              <p className="footer-tagline">WATCHES</p>
              <p className="footer-desc">
                Luxury timepieces that define style, not just time.
                Every watch is a masterpiece crafted for the discerning collector.
              </p>
              <div className="footer-social">
                <a href="#" className="social-icon"><FiInstagram /></a>
                <a href="#" className="social-icon"><FiFacebook /></a>
                <a href="#" className="social-icon"><FiTwitter /></a>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">Collection</Link></li>
                <li><Link to="/products?category=Luxury">Luxury</Link></li>
                <li><Link to="/products?category=Sport">Sport</Link></li>
                <li><Link to="/products?isNewArrival=true">New Arrivals</Link></li>
                <li><Link to="/products?isBestSeller=true">Best Sellers</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Customer Service</h4>
              <ul className="footer-links">
                <li><Link to="/cart">My Cart</Link></li>
                <li><Link to="/wishlist">Wishlist</Link></li>
                <li><Link to="/login">My Account</Link></li>
                <li><a href="#">Return Policy</a></li>
                <li><a href="#">Shipping Info</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Contact Us</h4>
              <ul className="footer-contact">
                <li>
                  <FiPhone className="contact-icon" />
                  <a href="https://wa.me/923202645413" target="_blank" rel="noreferrer">
                    +92 314 2371705
                  </a>
                </li>
                <li>
                  <FiMail className="contact-icon" />
                  <a href="mailto:info@MK.com">info@MK.com</a>
                </li>
                <li>
                  <FiMapPin className="contact-icon" />
                  <span>Pakistan</span>
                </li>
              </ul>

              <h4 className="footer-heading" style={{ marginTop: '1.5rem' }}>Newsletter</h4>
              <form onSubmit={handleNewsletter} className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-btn"><FiSend /></button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© 2024 MK_Watches. All rights reserved.</p>
          <p>Made with ❤️ in Pakistan</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;