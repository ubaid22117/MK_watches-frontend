import { useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiLogOut, FiPlus, FiHome } from 'react-icons/fi';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user || !user.isAdmin) navigate('/admin/login');
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', icon: <FiGrid />, label: 'Dashboard' },
    { path: '/admin/products', icon: <FiPackage />, label: 'Products' },
    { path: '/admin/products/add', icon: <FiPlus />, label: 'Add Product' },
    { path: '/admin/orders', icon: <FiShoppingBag />, label: 'Orders' },
    { path: '/admin/users', icon: <FiUsers />, label: 'Users' },
  ];

  if (!user || !user.isAdmin) return null;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <h2>MK</h2>
          <p>Admin Panel</p>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'admin-nav-active' : ''}`}>
              <span className="admin-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-item" style={{ marginBottom: '8px', color: '#555' }}>
            <FiHome /> <span>Visit Store</span>
          </Link>
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="admin-user-name">{user?.name}</p>
              <p className="admin-user-role">Administrator</p>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <FiLogOut /> Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;