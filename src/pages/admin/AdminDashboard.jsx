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

// ── CSS classes tumhari existing file se match hain ──
const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <motion.div
    className="admin-stat-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="admin-stat-icon" style={{ background: `${color}18`, color }}>
      <Icon size={22} />
    </div>
    <div>
      <p className="admin-stat-label">{label}</p>
      <p className="admin-stat-value" style={{ color }}>{value}</p>
      {sub && <p style={{ color: '#555', fontSize: '0.72rem', margin: '4px 0 0' }}>{sub}</p>}
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const { adminUser } = useAdminAuth();
  const [stats, setStats]           = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!adminUser?.token) return;
      const headers = { Authorization: `Bearer ${adminUser.token}` };
      try {
        // ── 1. Stats — tumhara existing route ──
        const statsRes = await axios.get(`${API_URL}/api/orders/stats`, { headers });
        const s = statsRes.data.stats || {};

        // ── 2. Products ──
        const productsRes = await axios.get(`${API_URL}/api/products`, { headers });
        const products = productsRes.data.products || [];

        // ── 3. All orders for recent table ──
        const ordersRes = await axios.get(`${API_URL}/api/orders`, { headers });
        const orders = ordersRes.data.orders || [];

        // ── 4. Users — fail ho to 0 ──
        let totalUsers = 0;
        try {
          const usersRes = await axios.get(`${API_URL}/api/auth/admin/users`, { headers });
          totalUsers = usersRes.data.users?.length || 0;
        } catch { /* users route nahi hai to ignore */ }

        setStats({
          totalOrders:     s.totalOrders    || orders.length,
          totalRevenue:    s.totalRevenue   || 0,
          pendingOrders:   s.pendingOrders  || 0,
          deliveredOrders: s.deliveredOrders || 0,
          awaitingPayment: s.awaitingPayment || 0,
          totalProducts:   products.length,
          outOfStock:      products.filter(p => p.stock === 0).length,
          lowStock:        products.filter(p => p.stock > 0 && p.stock <= 5).length,
          totalUsers,
        });

        // Recent 6 — safe filter
        setRecentOrders(
          [...orders]
            .filter(o => o?._id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 6)
        );
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [adminUser]);

  const statusColor = {
    Pending:           '#e67e22',
    'Awaiting Payment':'#e67e22',
    Processing:        '#3498db',
    Shipped:           '#9b59b6',
    Delivered:         '#2ecc71',
    Cancelled:         '#e74c3c',
  };

  const safeId = (id) => id ? String(id).slice(-8).toUpperCase() : 'N/A';

  if (loading) return (
    <AdminLayout>
      <div className="admin-loading"><div className="spinner" /></div>
    </AdminLayout>
  );

  if (error) return (
    <AdminLayout>
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: '#e74c3c', marginBottom: '1rem' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="admin-add-btn"
        >
          Retry
        </button>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>

      {/* ── Page Header ── */}
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

      {/* ── Status Mini Cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {[
          { icon: FiClock,       color: '#e67e22', count: stats?.pendingOrders   || 0, label: 'Pending' },
          { icon: FiAlertCircle, color: '#f39c12', count: stats?.awaitingPayment || 0, label: 'Awaiting Payment' },
          { icon: FiCheckCircle, color: '#2ecc71', count: stats?.deliveredOrders || 0, label: 'Delivered' },
          { icon: FiXCircle,     color: '#e74c3c', count: stats?.lowStock        || 0, label: 'Low Stock' },
        ].map(({ icon: Icon, color, count, label }) => (
          <div key={label} style={{
            background: '#111',
            border: `1px solid ${color}22`,
            borderRadius: '10px',
            padding: '1rem 1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <Icon color={color} size={18} />
            <div>
              <p style={{ color, fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>{count}</p>
              <p style={{ color: '#555', fontSize: '0.72rem', margin: 0 }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Recent Orders ── */}
      <motion.div
        className="admin-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="admin-card-title">Recent Orders</h2>
          <Link
            to="/admin/orders"
            style={{ color: '#D4AF37', fontSize: '0.82rem', textDecoration: 'none' }}
          >
            View All →
          </Link>
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
                    <td className="order-id">#{safeId(order._id)}</td>
                    <td>{order.user?.name || order.customerInfo?.name || 'Guest'}</td>
                    <td style={{ color: '#D4AF37', fontWeight: 600 }}>
                      Rs. {(order.totalPrice || 0).toLocaleString()}
                    </td>
                    <td style={{ color: '#888', fontSize: '0.8rem' }}>
                      {order.paymentMethod || 'N/A'}
                    </td>
                    <td>
                      <span className="status-badge" style={{
                        background: `${statusColor[order.status] || '#555'}18`,
                        color: statusColor[order.status] || '#555',
                        border: `1px solid ${statusColor[order.status] || '#555'}33`,
                      }}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td style={{ color: '#555', fontSize: '0.8rem' }}>
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