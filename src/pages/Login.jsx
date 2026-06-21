import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  FiMail, FiLock, FiEye, FiEyeOff,
  FiArrowRight, FiAlertCircle
} from 'react-icons/fi';
import '../styles/auth.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notVerified, setNotVerified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (notVerified) setNotVerified(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/auth/login`,
  form
);
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      if (data.isAdmin) navigate('/admin');
      else navigate('/');
    } catch (error) {
      const err = error.response?.data;
      if (err?.notVerified) {
        setNotVerified(true);
      } else {
        toast.error(err?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    try {
     await axios.post(
  `${import.meta.env.VITE_API_URL}/api/auth/resend-verification`,
  {
    email: form.email,
  }
);
      toast.success('Verification email sent! Check your inbox.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend email');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background */}
      <div className="auth-bg">
        <div className="auth-bg-orb auth-bg-orb-1" />
        <div className="auth-bg-orb auth-bg-orb-2" />
        <div className="auth-bg-grid" />
      </div>

      <div className="auth-container">
        {/* Left Panel */}
        <motion.div
          className="auth-left"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Link to="/" className="auth-brand">
            <h1>MK</h1>
            <p>WATCHES</p>
          </Link>
          <div className="auth-left-content">
            <h2>Timeless Luxury,<br />Redefined.</h2>
            <p>Access your personal account to explore our exclusive collection of luxury timepieces.</p>
            <div className="auth-features">
              {[
                'Exclusive member-only deals',
                'Track your orders in real-time',
                'Curated luxury recommendations',
                'Priority customer support',
              ].map((f, i) => (
                <div key={i} className="auth-feature-item">
                  <span className="auth-feature-dot" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="auth-left-footer">
            <p>© 2024 MK_Watches. All rights reserved.</p>
          </div>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          className="auth-right"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="auth-form-wrap">
            <div className="auth-form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your MK account</p>
            </div>

            {/* Not Verified Alert */}
            <AnimatePresence>
              {notVerified && (
                <motion.div
                  className="auth-alert"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <FiAlertCircle className="alert-icon" />
                  <div>
                    <p className="alert-title">Email Not Verified</p>
                    <p className="alert-text">
                      Please verify your email address before logging in.
                    </p>
                    <button
                      className="alert-resend-btn"
                      onClick={handleResendVerification}
                      disabled={resendLoading}
                    >
                      {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Email */}
              <div className="auth-field">
                <label>Email Address</label>
                <div className="auth-input-wrap">
                  <FiMail className="auth-input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="auth-field">
                <div className="auth-label-row">
                  <label>Password</label>
                  <Link to="/forgot-password" className="auth-forgot">
                    Forgot password?
                  </Link>
                </div>
                <div className="auth-input-wrap">
                  <FiLock className="auth-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <span className="auth-btn-loading">
                    <span className="auth-spinner" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    Sign In <FiArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <p className="auth-switch">
              Don't have an account?{' '}
              <Link to="/register">Create Account</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;