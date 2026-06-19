import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiCheck, FiX } from 'react-icons/fi';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axios.get(
          `http://192.168.100.8:5000/api/auth/verify-email/${token}`
        );
        setStatus('success');
        setMessage(data.message);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed');
      }
    };
    verify();
  }, [token]);
      
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
        {status === 'loading' && (
          <>
            <div className="auth-spinner" style={{ width: 50, height: 50, borderWidth: 3 }} />
            <h2 style={{ marginTop: '1.5rem' }}>Verifying your email...</h2>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="auth-success-icon">
              <FiCheck />
            </div>
            <h2>Email Verified!</h2>
            <p style={{ color: '#888', marginBottom: '1.5rem' }}>{message}</p>
            <Link to="/login" className="auth-submit-btn"
              style={{ display: 'inline-flex', justifyContent: 'center', textDecoration: 'none' }}>
              Sign In Now
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="auth-success-icon" style={{ background: 'rgba(231,76,60,0.15)', color: '#e74c3c' }}>
              <FiX />
            </div>
            <h2>Verification Failed</h2>
            <p style={{ color: '#888', marginBottom: '1.5rem' }}>{message}</p>
            <Link to="/login" className="auth-submit-btn"
              style={{ display: 'inline-flex', justifyContent: 'center', textDecoration: 'none' }}>
              Back to Login
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;