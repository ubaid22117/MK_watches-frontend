import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';
import { FiShoppingBag, FiClock, FiCheck, FiDollarSign } from 'react-icons/fi';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user?.token}` } };
        const [statsRes, ordersRes] = await Promise.all([
          axios.get('http://192.168.100.8:5000/api/orders/stats', config),
          axios.get('http://192.168.100.8:5000/api/orders', config),
        ]);
        setStats(statsRes.data.stats);
        setRecentOrders(ordersRes.data.orders.slice(0, 5));
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) fetchData();
  }, [user]);

  const statCards = [
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: <FiShoppingBag />, color: '#D4AF37' },
    { title: 'Pending Orders', value: stats?.pendingOrders || 0, icon: <FiClock />, color: '#e67e22' },
    { title: 'Delivered', value: stats?.deliveredOrders || 0, icon: <FiCheck />, color: '#2ecc71' },
    { title: 'Total Revenue', value: `Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`, icon: <FiDollarSign />, color: '#9b59b6' },
  ];

  const getStatusColor = (status) => ({
    Pending: '#e67e22', Processing: '#3498db',
    Shipped: '#9b59b6', Delivered: '#2ecc71', Cancelled: '#e74c3c',
  }[status] || '#888');

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-sub">Welcome back, {user?.name}!</p>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="spinner" /></div>
      ) : (
        <>
          <div className="admin-stats-grid">
            {statCards.map((card, i) => (
              <motion.div key={i} className="admin-stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}>
                <div className="admin-stat-icon"
                  style={{ background: `${card.color}22`, color: card.color }}>
                  {card.icon}
                </div>
                <div>
                  <p className="admin-stat-label">{card.title}</p>
                  <p className="admin-stat-value" style={{ color: card.color }}>{card.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className="admin-card"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}>
            <h3 className="admin-card-title">Recent Orders</h3>
            {recentOrders.length === 0 ? (
              <p style={{ color: '#666', padding: '1rem 0' }}>No orders yet</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td className="order-id">#{order._id.slice(-6).toUpperCase()}</td>
                        <td>{order.customerInfo?.name}</td>
                        <td style={{ color: '#D4AF37' }}>Rs. {order.totalPrice?.toLocaleString()}</td>
                        <td>
                          <span className="status-badge" style={{
                            background: `${getStatusColor(order.status)}22`,
                            color: getStatusColor(order.status),
                            border: `1px solid ${getStatusColor(order.status)}44`,
                          }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ color: '#666' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-PK')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;