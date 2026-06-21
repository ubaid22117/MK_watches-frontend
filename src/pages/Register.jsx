import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FiUser, FiMail, FiLock, FiEye,
  FiEyeOff, FiArrowRight, FiCheck
} from 'react-icons/fi';
import '../styles/auth.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getPasswordStrength = () => {
    const p = form.password;
    if (!p) return { strength: 0, label: '', color: '' };
    if (p.length < 6) return { strength: 1, label: 'Too Short', color: '#e74c3c' };
    if (p.length < 8) return { strength: 2, label: 'Weak', color: '#e67e22' };
    if (p.match(/[A-Z]/) && p.match(/[0-9]/)) return { strength: 4, label: 'Strong', color: '#2ecc71' };
    return { strength: 3, label: 'Good', color: '#D4AF37' };
  };

  const pwStrength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await axios.post('${import.meta.env.VITE_API_URL}/api/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setRegisteredEmail(form.email);
      setSuccess(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-bg">
          <div className="auth-bg-orb auth-bg-orb-1" />
          <div className="auth-bg-orb auth-bg-orb-2" />
        </div>
        <motion.div
          className="auth-success-screen"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="auth-success-icon">
            <FiCheck />
          </div>
          <h2>Check Your Email</h2>
          <p>
            We've sent a verification link to
          </p>
          <p className="auth-success-email">{registeredEmail}</p>
          <p className="auth-success-note">
            Please click the link in the email to verify your account. 
            Check your spam folder if you don't see it.
          </p>
          <Link to="/login" className="auth-submit-btn" style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none', marginTop: '1.5rem' }}>
            Go to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="auth-page">
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
            <h2>Join the World of Luxury Timepieces.</h2>
            <p>Become a member and unlock exclusive access to our curated collection of premium watches.</p>
            <div className="auth-features">
              {[
                'Early access to new arrivals',
                'Members-only exclusive deals',
                'Personalized watch recommendations',
                'Free shipping on all orders',
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
              <h2>Create Account</h2>
              <p>Start your luxury journey today</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label>Full Name</label>
                <div className="auth-input-wrap">
                  <FiUser className="auth-input-icon" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

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
                  />
                </div>
              </div>

              <div className="auth-field">
                <label>Password</label>
                <div className="auth-input-wrap">
                  <FiLock className="auth-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {form.password && (
                  <div className="password-strength">
                    <div className="strength-bars">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="strength-bar"
                          style={{
                            background: i <= pwStrength.strength
                              ? pwStrength.color
                              : 'rgba(255,255,255,0.1)',
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ color: pwStrength.color }}>
                      {pwStrength.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="auth-field">
                <label>Confirm Password</label>
                <div className="auth-input-wrap">
                  <FiLock className="auth-input-icon" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    required
                  />
                  {form.confirmPassword && (
                    <span className="auth-match-icon">
                      {form.password === form.confirmPassword ? (
                        <FiCheck style={{ color: '#2ecc71' }} />
                      ) : (
                        <span style={{ color: '#e74c3c', fontSize: '0.8rem' }}>✗</span>
                      )}
                    </span>
                  )}
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <span className="auth-btn-loading">
                    <span className="auth-spinner" /> Creating Account...
                  </span>
                ) : (
                  <> Create Account <FiArrowRight /> </>
                )}
              </button>
            </form>

            <div className="auth-divider"><span>or</span></div>

            <p className="auth-switch">
              Already have an account?{' '}
              <Link to="/login">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;