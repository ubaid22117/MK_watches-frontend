import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers,
  FiLogOut, FiMenu, FiX, FiHome
} from 'react-icons/fi';

const NAV = [
  { to: '/admin/dashboard', icon: FiGrid,       label: 'Dashboard' },
  { to: '/admin/products',  icon: FiPackage,     label: 'Products' },
  { to: '/admin/orders',    icon: FiShoppingBag, label: 'Orders' },
  { to: '/admin/users',     icon: FiUsers,       label: 'Users' },
];

const AdminLayout = ({ children }) => {
  const { adminUser, adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">⚙️</span>
          <div>
            <p className="sidebar-logo-title">Sarvora</p>
            <p className="sidebar-logo-sub">Admin Panel</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a href="/" target="_blank" className="sidebar-link" style={{ marginBottom: '4px' }}>
            <FiHome size={18} />
            <span>View Store</span>
          </a>
          <button className="sidebar-logout" onClick={handleLogout}>
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
          <p className="sidebar-user">{adminUser?.name}</p>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main Content ── */}
      <main className="admin-main">
        {/* Top bar */}
        <div className="admin-topbar">
          <button className="admin-menu-btn" onClick={() => setSidebarOpen(p => !p)}>
            {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
          <p className="admin-topbar-title">Admin Panel</p>
          <div className="admin-topbar-avatar">
            {adminUser?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;