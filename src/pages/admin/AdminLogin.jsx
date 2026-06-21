import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { FiLock, FiMail, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('${import.meta.env.VITE_API_URL}/api/auth/login', form);
      if (!data.isAdmin) {
        toast.error('Access denied. Admin privileges required.');
        return;
      }
      login(data);
      toast.success('Welcome to Admin Panel!');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Animated Background */}
      <div className="adm-bg">
        <div className="adm-bg-orb adm-orb-1" />
        <div className="adm-bg-orb adm-orb-2" />
        <div className="adm-bg-lines" />
      </div>

      <div className="adm-layout">
        {/* Left Branding */}
        <motion.div
          className="adm-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="adm-brand">
            <h1>MK</h1>
            <p>WATCHES</p>
          </div>

          <div className="adm-left-text">
            <h2>Admin Control Center</h2>
            <p>
              Manage your luxury watch store with full control over products, orders, and customers.
            </p>
          </div>

          <div className="adm-left-stats">
            {[
              { label: 'Products', value: 'Manage' },
              { label: 'Orders', value: 'Track' },
              { label: 'Customers', value: 'Serve' },
              { label: 'Revenue', value: 'Grow' },
            ].map((s, i) => (
              <div key={i} className="adm-stat">
                <span className="adm-stat-value">{s.value}</span>
                <span className="adm-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          <Link to="/" className="adm-visit-store">
            ← Visit Store
          </Link>
        </motion.div>

        {/* Right Form */}
        <motion.div
          className="adm-right"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="adm-form-card">
            {/* Shield Icon */}
            <div className="adm-shield-icon">
              <FiShield />
            </div>

            <h2 className="adm-form-title">Secure Access</h2>
            <p className="adm-form-sub">
              Authorized administrators only
            </p>

            <form onSubmit={handleSubmit} className="adm-form">
              <div className="adm-field">
                <label>Admin Email</label>
                <div className="adm-input-wrap">
                  <FiMail className="adm-input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@MK.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="adm-field">
                <label>Password</label>
                <div className="adm-input-wrap">
                  <FiLock className="adm-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter admin password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="adm-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="adm-submit-btn" disabled={loading}>
                {loading ? (
                  <span className="adm-btn-loading">
                    <span className="adm-spinner" />
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <FiShield />
                    Access Admin Panel
                  </>
                )}
              </button>
            </form>

            <div className="adm-security-note">
              <FiLock />
              <span>256-bit encrypted • Secure session</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;