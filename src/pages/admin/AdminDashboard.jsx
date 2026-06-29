import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminLayout from './AdminLayout';
import {
  FiPackage, FiShoppingBag, FiUsers, FiTrendingUp,
  FiClock, FiCheckCircle, FiXCircle, FiAlertCircle
} from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL;

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <motion.div
    className="admin-stat-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="stat-icon" style={{ background: `${color}18`, color }}>
      <Icon size={22} />
    </div>
    <div className="stat-info">
      <p className="stat-label">{label}</p>
      <p className="stat-value" style={{ color }}>{value}</p>
      {sub && <p className="stat-sub">{sub}</p>}
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const { adminUser } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!adminUser?.token) return;
      const headers = { Authorization: `Bearer ${adminUser.token}` };

      try {
        // ── Step 1: Stats endpoint (tumhara existing route) ──
        const statsRes = await axios.get(
          `${API_URL}/api/orders/stats`,
          { headers }
        );
        const s = statsRes.data.stats || {};

        // ── Step 2: Products count ──
        const productsRes = await axios.get(
          `${API_URL}/api/products`,
          { headers }
        );
        const products = productsRes.data.products || [];

        // ── Step 3: All orders for recent table ──
        const ordersRes = await axios.get(
          `${API_URL}/api/orders`,
          { headers }
        );
        const orders = ordersRes.data.orders || [];

        // ── Step 4: Users count — try karo, fail hone par 0 ──
        let totalUsers = 0;
        try {
          const usersRes = await axios.get(
            `${API_URL}/api/auth/admin/users`,
            { headers }
          );
          totalUsers = usersRes.data.users?.length || 0;
        } catch {
          // users route nahi hai to 0 dikhao
        }

        setStats({
          totalOrders:    s.totalOrders    || orders.length,
          totalRevenue:   s.totalRevenue   || 0,
          pendingOrders:  s.pendingOrders  || 0,
          deliveredOrders: s.deliveredOrders || 0,
          awaitingPayment: s.awaitingPayment || 0,
          totalProducts:  products.length,
          outOfStock:     products.filter(p => p.stock === 0).length,
          lowStock:       products.filter(p => p.stock > 0 && p.stock <= 5).length,
          totalUsers,
        });

        // Recent 6 orders — safe sort
        const sorted = [...orders]
          .filter(o => o && o._id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);
        setRecentOrders(sorted);

      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [adminUser]);

  const statusColor = {
    Pending:          '#e67e22',
    'Awaiting Payment': '#e67e22',
    Processing:       '#3498db',
    Shipped:          '#9b59b6',
    Delivered:        '#2ecc71',
    Cancelled:        '#e74c3c',
  };

  // Safe ID display — crash nahi karega
  const safeId = (id) => {
    if (!id) return 'N/A';
    return String(id).slice(-8).toUpperCase();
  };

  if (loading) return (
    <AdminLayout>
      <div className="admin-loading"><div className="spinner" /></div>
    </AdminLayout>
  );

  if (error) return (
    <AdminLayout>
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: '#e74c3c', fontSize: '0.9rem' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '1rem', padding: '10px 20px',
            background: '#D4AF37', color: '#000',
            border: 'none', borderRadius: '8px',
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Retry
        </button>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub">Welcome back, {adminUser?.name} 👋</p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="admin-stats-grid">
        <StatCard
          icon={FiShoppingBag}
          label="Total Orders"
          value={stats?.totalOrders || 0}
          color="#D4AF37"
          sub={`${stats?.pendingOrders || 0} pending`}
        />
        <StatCard
          icon={FiTrendingUp}
          label="Total Revenue"
          value={`Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`}
          color="#2ecc71"
          sub="From all orders"
        />
        <StatCard
          icon={FiPackage}
          label="Total Products"
          value={stats?.totalProducts || 0}
          color="#3498db"
          sub={`${stats?.outOfStock || 0} out of stock`}
        />
        <StatCard
          icon={FiUsers}
          label="Total Users"
          value={stats?.totalUsers || 0}
          color="#9b59b6"
          sub="Registered customers"
        />
      </div>

      {/* ── Order Status Row ── */}
      <div className="admin-status-row">
        <div className="admin-status-card">
          <FiClock color="#e67e22" size={18} />
          <span style={{ color: '#e67e22', fontWeight: 600 }}>
            {stats?.pendingOrders || 0}
          </span>
          <span style={{ color: '#666', fontSize: '0.82rem' }}>Pending</span>
        </div>
        <div className="admin-status-card">
          <FiAlertCircle color="#f39c12" size={18} />
          <span style={{ color: '#f39c12', fontWeight: 600 }}>
            {stats?.awaitingPayment || 0}
          </span>
          <span style={{ color: '#666', fontSize: '0.82rem' }}>Awaiting Payment</span>
        </div>
        <div className="admin-status-card">
          <FiCheckCircle color="#2ecc71" size={18} />
          <span style={{ color: '#2ecc71', fontWeight: 600 }}>
            {stats?.deliveredOrders || 0}
          </span>
          <span style={{ color: '#666', fontSize: '0.82rem' }}>Delivered</span>
        </div>
        <div className="admin-status-card">
          <FiXCircle color="#e74c3c" size={18} />
          <span style={{ color: '#e74c3c', fontWeight: 600 }}>
            {stats?.lowStock || 0}
          </span>
          <span style={{ color: '#666', fontSize: '0.82rem' }}>Low Stock</span>
        </div>
      </div>

      {/* ── Recent Orders Table ── */}
      <motion.div
        className="admin-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ marginTop: '2rem' }}
      >
        <div className="admin-card-header">
          <h2 className="admin-card-title">Recent Orders</h2>
          <Link to="/admin/orders" className="admin-view-all">View All →</Link>
        </div>

        <div className="admin-table-wrap">
          {recentOrders.length === 0 ? (
            <p style={{ color: '#555', padding: '2rem', textAlign: 'center' }}>
              No orders yet
            </p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id}>
                    <td style={{
                      color: '#D4AF37',
                      fontFamily: 'monospace',
                      fontSize: '0.8rem'
                    }}>
                      #{safeId(order._id)}
                    </td>
                    <td style={{ color: '#ccc' }}>
                      {order.user?.name
                        || order.customerInfo?.name
                        || 'Guest'}
                    </td>
                    <td style={{ color: '#D4AF37', fontWeight: 600 }}>
                      Rs. {(order.totalPrice || 0).toLocaleString()}
                    </td>
                    <td style={{ color: '#888', fontSize: '0.8rem' }}>
                      {order.paymentMethod || 'N/A'}
                    </td>
                    <td>
                      <span className="order-status-badge" style={{
                        background: `${statusColor[order.status] || '#555'}18`,
                        color: statusColor[order.status] || '#555',
                        border: `1px solid ${statusColor[order.status] || '#555'}33`,
                      }}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td style={{ color: '#555', fontSize: '0.82rem' }}>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('en-PK', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboard;