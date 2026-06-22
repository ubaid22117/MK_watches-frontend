import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';

const API_URL = import.meta.env.VITE_API_URL;

const AdminOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setOrders(data.orders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user?.token) fetchOrders(); }, [user]);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await axios.put(`${API_URL}/api/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      toast.success(`Order status updated to: ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleVerifyPayment = async (orderId, action) => {
    try {
      await axios.put(`${API_URL}/api/orders/${orderId}/verify-payment`,
        { action },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      toast.success(action === 'verify' ? 'Payment verified! Order is now processing.' : 'Payment rejected. Order cancelled.');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update payment status');
    }
  };

  const getStatusColor = (status) => ({
    'Awaiting Payment': '#f39c12',
    Pending: '#e67e22',
    Processing: '#3498db',
    Shipped: '#9b59b6',
    Delivered: '#2ecc71',
    Cancelled: '#e74c3c',
  }[status] || '#888');

  const getPaymentColor = (method) => ({
    'Cash on Delivery': '#888',
    'EasyPaisa': '#00a651',
    'JazzCash': '#e6007e',
    'Card': '#3498db',
    'Bank Transfer': '#9b59b6',
  }[method] || '#888');

  const getPaymentStatusColor = (status) => ({
    'Awaiting Verification': '#e67e22',
    'Verified': '#2ecc71',
    'Rejected': '#e74c3c',
    'Not Required': '#888',
  }[status] || '#888');

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p className="admin-page-sub">{orders.length} total orders</p>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="spinner" /></div>
      ) : orders.length === 0 ? (
        <div className="admin-empty">
          <h3>No Orders Yet</h3>
          <p>Orders will appear here once customers start purchasing</p>
        </div>
      ) : (
        <div className="admin-orders-list">
          {orders.map((order, i) => (
            <motion.div key={order._id} className="admin-order-card admin-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}>
              <div className="order-card-header">
                <div>
                  <p className="order-id-text">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-PK', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                  <span className="order-source-tag">{order.orderSource || 'Website'}</span>
                </div>
                <div className="order-header-right">
                  <p className="order-total-text">Rs. {order.totalPrice?.toLocaleString()}</p>
                  <span className="status-badge" style={{
                    background: `${getStatusColor(order.status)}22`,
                    color: getStatusColor(order.status),
                    border: `1px solid ${getStatusColor(order.status)}44`,
                  }}>
                    {order.status}
                  </span>
                  <span className="status-badge" style={{
                    background: `${getPaymentColor(order.paymentMethod)}22`,
                    color: getPaymentColor(order.paymentMethod),
                    border: `1px solid ${getPaymentColor(order.paymentMethod)}44`,
                  }}>
                    {order.paymentMethod || 'Cash on Delivery'}
                  </span>
                </div>
              </div>

              <div className="order-card-body">
                <div className="order-customer-info">
                  <h4>Customer Details</h4>
                  <p><strong>Name:</strong> {order.customerInfo?.name}</p>
                  <p><strong>Phone:</strong> {order.customerInfo?.phone}</p>
                  <p><strong>Address:</strong> {order.customerInfo?.address}</p>
                  <p><strong>City:</strong> {order.customerInfo?.city}</p>
                  {order.customerInfo?.notes && (
                    <p><strong>Notes:</strong> {order.customerInfo.notes}</p>
                  )}
                  <p><strong>Payment:</strong> {order.paymentMethod || 'Cash on Delivery'}</p>
                  {order.paymentDetails?.transactionId && (
                    <p><strong>Transaction ID:</strong> {order.paymentDetails.transactionId}</p>
                  )}
                  {order.paymentDetails?.accountNumber && (
                    <p><strong>Payer Account:</strong> {order.paymentDetails.accountNumber}</p>
                  )}
                  {order.paymentDetails?.bankName && (
                    <p><strong>Bank:</strong> {order.paymentDetails.bankName}</p>
                  )}
                  {order.paymentDetails?.cardLastFour && (
                    <p><strong>Card ending:</strong> {order.paymentDetails.cardLastFour}</p>
                  )}
                  {order.paymentStatus !== 'Not Required' && (
                    <p>
                      <strong>Payment Status:</strong>{' '}
                      <span style={{ color: getPaymentStatusColor(order.paymentStatus), fontWeight: 600 }}>
                        {order.paymentStatus}
                      </span>
                    </p>
                  )}
                </div>

                <div className="order-items-list">
                  <h4>Order Items</h4>
                  {order.orderItems?.map((item, j) => (
                    <div key={j} className="order-item-row">
                      <span className="order-item-name">{item.name}</span>
                      <span className="order-item-qty">x{item.quantity}</span>
                      <span className="order-item-price">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="order-status-update">
                  {order.paymentStatus === 'Awaiting Verification' ? (
                    <>
                      <h4>Verify Payment</h4>
                      <div className="payment-verify-buttons">
                        <button
                          className="verify-payment-btn verify-btn-approve"
                          onClick={() => handleVerifyPayment(order._id, 'verify')}
                        >
                          ✓ Confirm Payment
                        </button>
                        <button
                          className="verify-payment-btn verify-btn-reject"
                          onClick={() => handleVerifyPayment(order._id, 'reject')}
                        >
                          ✗ Reject Payment
                        </button>
                      </div>
                      <p className="payment-pending-note">
                        Order is on hold until payment is verified.
                      </p>
                    </>
                  ) : (
                    <>
                      <h4>Update Status</h4>
                      <select value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="status-select"
                        style={{ borderColor: getStatusColor(order.status) }}>
                        <option>Pending</option>
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                    </>
                  )}
                  <a href={`https://wa.me/92${order.customerInfo?.phone?.replace(/^0/, '')}?text=Hello ${order.customerInfo?.name}! Your MK WATCHES order #${order._id.slice(-6).toUpperCase()} status has been updated to: *${order.status}*`}
                    target="_blank" rel="noreferrer" className="whatsapp-contact-btn">
                    📱 WhatsApp Customer
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;