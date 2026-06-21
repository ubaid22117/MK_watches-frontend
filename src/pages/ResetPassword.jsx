import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import '../styles/auth.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`, {
        password: form.password,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset failed. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-orb auth-bg-orb-1" />
        <div className="auth-bg-orb auth-bg-orb-2" />
      </div>

      <motion.div
        className="auth-success-screen"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {!success ? (
          <>
            <div className="auth-success-icon" style={{ background: 'rgba(212,175,55,0.15)' }}>
              <FiLock style={{ color: '#D4AF37' }} />
            </div>
            <h2>Reset Password</h2>
            <p style={{ color: '#888', marginBottom: '2rem' }}>
              Create a new secure password for your account.
            </p>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <div className="auth-field">
                <label>New Password</label>
                <div className="auth-input-wrap">
                  <FiLock className="auth-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="New password (min 6 characters)"
                    required
                  />
                  <button type="button" className="auth-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="auth-field">
                <label>Confirm New Password</label>
                <div className="auth-input-wrap">
                  <FiLock className="auth-input-icon" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <span className="auth-btn-loading">
                    <span className="auth-spinner" /> Resetting...
                  </span>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="auth-success-icon"><FiCheck /></div>
            <h2>Password Reset!</h2>
            <p style={{ color: '#888', textAlign: 'center', marginBottom: '1.5rem' }}>
              Your password has been reset successfully. Redirecting to login...
            </p>
            <Link to="/login" className="auth-submit-btn"
              style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }}>
              Go to Login
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;