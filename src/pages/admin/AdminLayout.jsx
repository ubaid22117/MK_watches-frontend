import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers,
  FiLogOut, FiHome
} from 'react-icons/fi';

const NAV = [
  { to: '/admin/dashboard', icon: FiGrid,        label: 'Dashboard' },
  { to: '/admin/products',  icon: FiPackage,      label: 'Products' },
  { to: '/admin/orders',    icon: FiShoppingBag,  label: 'Orders' },
  { to: '/admin/users',     icon: FiUsers,        label: 'Users' },
];

const AdminLayout = ({ children }) => {
  const { adminUser, adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">

      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">

        {/* Logo */}
        <div className="admin-sidebar-logo">
          <h2>MK</h2>
          <p>Admin Panel</p>
        </div>

        {/* Nav links */}
        <nav className="admin-nav">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? 'admin-nav-active' : ''}`
              }
            >
              <span className="admin-nav-icon"><Icon size={17} /></span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar-footer">
          {/* User info */}
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {adminUser?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div style={{ minWidth: 0 }}>
              <p className="admin-user-name">{adminUser?.name || 'Admin'}</p>
              <p className="admin-user-role">Administrator</p>
            </div>
          </div>

          {/* View store */}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="admin-nav-item"
            style={{ marginBottom: '6px', borderRadius: '8px' }}
          >
            <span className="admin-nav-icon"><FiHome size={17} /></span>
            View Store
          </a>

          {/* Logout */}
          <button className="admin-logout-btn" onClick={handleLogout}>
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="admin-main">
        <div className="admin-content">
          {children}
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;