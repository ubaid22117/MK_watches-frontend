import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

// Admin protected route — sirf admin ja sakta hai
const AdminRoute = ({ children }) => {
  const { adminUser, adminLoading } = useAdminAuth();

  if (adminLoading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a0a',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div className="spinner" />
      </div>
    );
  }

  // Admin nahi hai? Admin login pe bhejo — user login pe nahi
  if (!adminUser || !adminUser.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;