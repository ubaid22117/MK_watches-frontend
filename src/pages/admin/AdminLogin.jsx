import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAdminAuth } from '../../context/AdminAuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminUser, setAdminUser } = useAdminAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Pehle se logged in hai to dashboard pe bhejo
  useEffect(() => {
    if (adminUser?.isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [adminUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Email and password required');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, form);

      if (!data.isAdmin) {
        toast.error('Access denied. Admin credentials required.');
        setLoading(false);
        return;
      }

      // ── Context update karo, localStorage mein bhi save karo ──
      localStorage.setItem('adminUser', JSON.stringify(data));
      setAdminUser(data);  // ← yeh context update karta hai

      toast.success(`Welcome, ${data.name}!`);

      // Thoda delay do taake context update ho jaye
      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true });
      }, 300);

    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#111',
          border: '1px solid rgba(212,175,55,0.15)',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg, #D4AF37, #A0820A)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.5rem',
          }}>⚙️</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            color: 'white', fontSize: '1.6rem', margin: '0 0 6px',
          }}>Admin Panel</h1>
          <p style={{ color: '#555', fontSize: '0.85rem', margin: 0 }}>
            MK Watches — Admin Only
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{
              display: 'block', color: '#888',
              fontSize: '0.78rem', marginBottom: '6px', letterSpacing: '0.5px',
            }}>
              ADMIN EMAIL
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="admin@email.com"
              style={{
                width: '100%', padding: '12px 14px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: '8px', color: 'white',
                fontSize: '0.9rem', outline: 'none',
                fontFamily: "'Poppins', sans-serif",
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#D4AF37'}
              onBlur={e => e.target.style.borderColor = 'rgba(212,175,55,0.2)'}
            />
          </div>

          <div>
            <label style={{
              display: 'block', color: '#888',
              fontSize: '0.78rem', marginBottom: '6px', letterSpacing: '0.5px',
            }}>
              ADMIN PASSWORD
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="••••••••"
              style={{
                width: '100%', padding: '12px 14px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: '8px', color: 'white',
                fontSize: '0.9rem', outline: 'none',
                fontFamily: "'Poppins', sans-serif",
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#D4AF37'}
              onBlur={e => e.target.style.borderColor = 'rgba(212,175,55,0.2)'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading ? '#333' : 'linear-gradient(135deg, #D4AF37, #A0820A)',
              color: loading ? '#666' : '#000',
              border: 'none', borderRadius: '8px',
              fontSize: '0.9rem', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Poppins', sans-serif",
              marginTop: '0.5rem', transition: 'all 0.3s',
            }}
          >
            {loading ? 'Verifying...' : 'Login to Admin Panel'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', color: '#333',
          fontSize: '0.75rem', marginTop: '1.5rem',
        }}>
          This page is for administrators only.<br />
          <a href="/" style={{ color: '#555', textDecoration: 'none' }}>← Back to Store</a>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;