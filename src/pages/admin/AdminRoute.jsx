import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminRoute = ({ children }) => {
  const { adminUser, adminLoading } = useAdminAuth();

  // Loading ke waqt kuch mat dikhao
  if (adminLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div className="spinner" />
      </div>
    );
  }

  // Admin nahi hai to login pe bhejo
  if (!adminUser || !adminUser.isAdmin || !adminUser.token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;