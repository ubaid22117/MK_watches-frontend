import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiMail, FiArrowLeft, FiSend } from 'react-icons/fi';
import '../styles/auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://192.168.100.8:5000/api/auth/forgot-password', { email });
      setSent(true);
    } catch (error) {
      setSent(true); // Security: always show success
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-orb auth-bg-orb-1" />
        <div className="auth-bg-orb auth-bg-orb-2" />
        <div className="auth-bg-grid" />
      </div>

      <motion.div
        className="auth-success-screen"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link to="/login" className="forgot-back-btn">
          <FiArrowLeft /> Back to Login
        </Link>

        {!sent ? (
          <>
            <div className="auth-success-icon" style={{ background: 'rgba(212,175,55,0.15)' }}>
              <FiMail style={{ color: '#D4AF37' }} />
            </div>
            <h2>Forgot Password?</h2>
            <p style={{ color: '#888', marginBottom: '2rem', textAlign: 'center' }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <div className="auth-field">
                <label>Email Address</label>
                <div className="auth-input-wrap">
                  <FiMail className="auth-input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <span className="auth-btn-loading">
                    <span className="auth-spinner" /> Sending...
                  </span>
                ) : (
                  <><FiSend /> Send Reset Link</>
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="auth-success-icon"><FiMail /></div>
            <h2>Check Your Email</h2>
            <p style={{ color: '#888', textAlign: 'center', marginBottom: '1.5rem' }}>
              If an account exists for <strong style={{ color: '#D4AF37' }}>{email}</strong>,
              you'll receive a password reset link shortly.
            </p>
            <Link to="/login" className="auth-submit-btn"
              style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }}>
              Back to Login
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;