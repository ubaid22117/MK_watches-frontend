import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import Layout from '../layout/Layout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiShoppingBag, FiCheck, FiTruck, FiSmartphone, FiCreditCard, FiHome } from 'react-icons/fi';
import '../styles/checkout.css';

const API_URL = import.meta.env.VITE_API_URL;

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', phone: '', address: '', city: '', notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [paymentDetails, setPaymentDetails] = useState({
    transactionId: '', accountNumber: '', cardLastFour: '', bankName: ''
  });
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePaymentDetailChange = (e) =>
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });

  const paymentOptions = [
    {
      id: 'Cash on Delivery',
      label: 'Cash on Delivery',
      desc: 'Pay with cash when your order arrives',
      icon: <FiTruck />,
    },
    {
      id: 'EasyPaisa',
      label: 'EasyPaisa',
      desc: 'Pay via EasyPaisa mobile account',
      icon: <FiSmartphone />,
    },
    {
      id: 'JazzCash',
      label: 'JazzCash',
      desc: 'Pay via JazzCash mobile account',
      icon: <FiSmartphone />,
    },
    {
      id: 'Card',
      label: 'Debit / Credit Card',
      desc: 'Pay using your card via bank transfer',
      icon: <FiCreditCard />,
    },
    {
      id: 'Bank Transfer',
      label: 'Bank Account Transfer',
      desc: 'Pay directly via online banking',
      icon: <FiHome />,
    },
  ];

  const validateForm = () => {
    if (!form.name || !form.phone || !form.address || !form.city) {
      toast.error('Please fill in all required fields!');
      return false;
    }
    if (paymentMethod !== 'Cash on Delivery') {
      if (!paymentDetails.transactionId) {
        toast.error('Please enter your transaction ID / reference number');
        return false;
      }
      if ((paymentMethod === 'Card' || paymentMethod === 'Bank Transfer') && !paymentDetails.bankName) {
        toast.error('Please enter your bank name');
        return false;
      }
    }
    return true;
  };
  // ── Order via Website ──
  const handleWebsiteOrder = async () => {
    if (!validateForm()) return;

    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    setPlacing(true);
    try {
      const orderItems = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.images?.[0]?.url || '',
        price: item.discountPrice || item.price,
        quantity: item.quantity,
      }));

      const { data } = await axios.post(
        `${API_URL}/api/orders`,
        {
          customerInfo: {
            name: form.name,
            phone: form.phone,
            address: form.address,
            city: form.city,
            notes: form.notes,
          },
          orderItems,
          itemsPrice: totalPrice,
          shippingPrice: 0,
          totalPrice: totalPrice,
          orderSource: 'Website',
          paymentMethod,
          paymentDetails: paymentMethod !== 'Cash on Delivery' ? paymentDetails : {},
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setOrderId(data.order._id.slice(-8).toUpperCase());
      setOrderPlaced(true);
      clearCart();
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  // ── Order via WhatsApp ──
  const generateWhatsAppMessage = () => {
    const itemsList = cartItems
      .map(item => `• ${item.name} x${item.quantity} = Rs. ${((item.discountPrice || item.price) * item.quantity).toLocaleString()}`)
      .join('\n');

    const paymentInfo = paymentMethod === 'Cash on Delivery'
      ? 'Cash on Delivery'
      : `${paymentMethod} (Transaction ID: ${paymentDetails.transactionId})`;

    const message = `
🕐 *MK_Watches — New Order*
━━━━━━━━━━━━━━━━━━━━━
👤 *Customer Information:*
Name: ${form.name}
Phone: ${form.phone}
Address: ${form.address}
City: ${form.city}
${form.notes ? `Notes: ${form.notes}` : ''}

🛒 *Order Items:*
${itemsList}

💳 *Payment Method:* ${paymentInfo}

━━━━━━━━━━━━━━━━━━━━━
💰 *Total: Rs. ${totalPrice.toLocaleString()}*
🚚 Shipping: FREE
━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    return encodeURIComponent(message);
  };

  const handleWhatsAppOrder = async () => {
    if (!validateForm()) return;

    if (user) {
      try {
        const orderItems = cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.images?.[0]?.url || '',
          price: item.discountPrice || item.price,
          quantity: item.quantity,
        }));

        await axios.post(
          `${API_URL}/api/orders`,
          {
            customerInfo: {
              name: form.name,
              phone: form.phone,
              address: form.address,
              city: form.city,
              notes: form.notes,
            },
            orderItems,
            itemsPrice: totalPrice,
            shippingPrice: 0,
            totalPrice: totalPrice,
            orderSource: 'WhatsApp',
            paymentMethod,
            paymentDetails: paymentMethod !== 'Cash on Delivery' ? paymentDetails : {},
          },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
      } catch (error) {
        console.error('Failed to save order record:', error);
      }
    }

    const message = generateWhatsAppMessage();
    window.open(`https://wa.me/923202645413?text=${message}`, '_blank');
    clearCart();
  };

  if (orderPlaced) {
    const needsVerification = paymentMethod !== 'Cash on Delivery';
    return (
      <Layout>
        <div className="checkout-page">
          <div className="container">
            <motion.div
              className="order-success-screen glass-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="order-success-icon"><FiCheck /></div>
              <h2>{needsVerification ? 'Order Received — Awaiting Payment Verification' : 'Order Placed Successfully!'}</h2>
              <p>
                {needsVerification
                  ? 'Your order has been received. It will be processed once we verify your payment.'
                  : 'Your order has been received and is being processed.'}
              </p>
              <p className="order-success-id">Order ID: #{orderId}</p>
              <p className="order-success-note">
                {needsVerification
                  ? 'We will verify your transaction within a few hours and confirm via WhatsApp.'
                  : 'Our team will contact you shortly to confirm delivery details.'}
              </p>
              <div className="order-success-buttons">
                <button className="btn-primary" onClick={() => navigate('/products')}>
                  Continue Shopping
                </button>
                <button className="btn-outline" onClick={() => navigate('/')}>
                  Go to Home
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }
  if (cartItems.length === 0) return (
    <Layout>
      <div className="empty-page">
        <div className="empty-icon">🛒</div>
        <h2>Your Cart is Empty</h2>
        <p>Please add some products to your cart first</p>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="checkout-page">
        <div className="container">
          <motion.h1 className="page-title"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Complete Your <span className="gold-text">Order</span>
          </motion.h1>

          <div className="checkout-layout">
            <motion.div className="checkout-form glass-card"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h3 className="form-title">Delivery Information</h3>

              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" name="name" value={form.name}
                  onChange={handleChange} placeholder="Enter your full name" className="form-input" />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="tel" name="phone" value={form.phone}
                  onChange={handleChange} placeholder="03XX XXXXXXX" className="form-input" />
              </div>
              <div className="form-group">
                <label>Delivery Address *</label>
                <textarea name="address" value={form.address}
                  onChange={handleChange} placeholder="Enter your complete home/office address"
                  className="form-input form-textarea" rows={3} />
              </div>
              <div className="form-group">
                <label>City *</label>
                <input type="text" name="city" value={form.city}
                  onChange={handleChange} placeholder="Enter your city" className="form-input" />
              </div>
              <div className="form-group">
                <label>Order Notes (Optional)</label>
                <textarea name="notes" value={form.notes}
                  onChange={handleChange} placeholder="Any special instructions..."
                  className="form-input form-textarea" rows={2} />
              </div>

              {/* Payment Method Section */}
              <h3 className="form-title" style={{ marginTop: '1.5rem' }}>Payment Method</h3>

              <div className="payment-options">
                {paymentOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`payment-option ${paymentMethod === option.id ? 'payment-option-active' : ''}`}
                    onClick={() => setPaymentMethod(option.id)}
                  >
                    <div className="payment-option-icon">{option.icon}</div>
                    <div className="payment-option-text">
                      <p className="payment-option-label">{option.label}</p>
                      <p className="payment-option-desc">{option.desc}</p>
                    </div>
                    <div className={`payment-radio ${paymentMethod === option.id ? 'payment-radio-active' : ''}`}>
                      {paymentMethod === option.id && <FiCheck />}
                    </div>
                  </div>
                ))}
              </div>

             {/* Payment Details */}
              <AnimatePresence>
                {paymentMethod !== 'Cash on Delivery' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="payment-details-box"
                  >
                    {/* Mobile Wallet Payment */}
                    {(paymentMethod === 'EasyPaisa' || paymentMethod === 'JazzCash') && (
                      <>
                        <div className="payment-instructions">
                          <p><strong>Send payment to:</strong></p>
                          <p className="payment-number">
                            03202645413
                            <span className="payment-account-name"> (MK WATCHES)</span>
                          </p>
                          <p className="payment-note">
                            After sending payment, enter your transaction ID below.
                            Your order will be processed once we verify your payment.
                          </p>
                        </div>

                        <div className="form-group">
                          <label>Transaction ID *</label>
                          <input
                            type="text"
                            name="transactionId"
                            value={paymentDetails.transactionId}
                            onChange={handlePaymentDetailChange}
                            placeholder="Enter transaction ID from your payment app"
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Your {paymentMethod} Account Number</label>
                          <input
                            type="text"
                            name="accountNumber"
                            value={paymentDetails.accountNumber}
                            onChange={handlePaymentDetailChange}
                            placeholder="03XX XXXXXXX"
                            className="form-input"
                          />
                        </div>
                      </>
                    )}

                    {/* Card Payment */}
                    {paymentMethod === 'Card' && (
                      <>
                        <div className="payment-instructions">
                          <p><strong>Bank transfer to our account:</strong></p>
                          <p className="payment-number">
                            PK00 ABCD 0000 0012 3456 7890
                            <span className="payment-account-name"> (MK WATCHES — Meezan Bank)</span>
                          </p>
                          <p className="payment-note">
                            Transfer using your card via your bank's app, then enter the reference number below.
                            Your order will be processed once we verify your payment.
                          </p>
                        </div>

                        <div className="form-group">
                          <label>Transaction / Reference Number *</label>
                          <input
                            type="text"
                            name="transactionId"
                            value={paymentDetails.transactionId}
                            onChange={handlePaymentDetailChange}
                            placeholder="Enter reference number from your bank"
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Your Bank Name *</label>
                          <input
                            type="text"
                            name="bankName"
                            value={paymentDetails.bankName}
                            onChange={handlePaymentDetailChange}
                            placeholder="e.g. HBL, UBL, Meezan Bank"
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Card Last 4 Digits</label>
                          <input
                            type="text"
                            name="cardLastFour"
                            value={paymentDetails.cardLastFour}
                            onChange={handlePaymentDetailChange}
                            placeholder="XXXX"
                            maxLength={4}
                            className="form-input"
                          />
                        </div>
                      </>
                    )}

                    {/* Bank Transfer */}
                    {paymentMethod === 'Bank Transfer' && (
                      <>
                        <div className="payment-instructions">
                          <p><strong>Transfer to our bank account:</strong></p>
                          <p className="payment-number">
                            PK00 ABCD 0000 0012 3456 7890
                            <span className="payment-account-name"> (MK WATCHES — Meezan Bank)</span>
                          </p>
                          <p className="payment-note">
                            After transferring, enter the transaction/reference number below.
                            Your order will be processed once we verify your payment.
                          </p>
                        </div>

                        <div className="form-group">
                          <label>Transaction / Reference Number *</label>
                          <input
                            type="text"
                            name="transactionId"
                            value={paymentDetails.transactionId}
                            onChange={handlePaymentDetailChange}
                            placeholder="Enter reference number"
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Your Bank Name *</label>
                          <input
                            type="text"
                            name="bankName"
                            value={paymentDetails.bankName}
                            onChange={handlePaymentDetailChange}
                            placeholder="e.g. HBL, UBL, Meezan Bank"
                            className="form-input"
                          />
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {!user && (
                <div className="checkout-login-notice">
                  <FiShoppingBag />
                  <span>
                    <strong>Note:</strong> You need to be logged in to place an order directly on the website.
                    You can still order via WhatsApp without logging in.
                  </span>
                </div>
              )}
            </motion.div>

            <motion.div className="checkout-summary"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                <h3 className="form-title">Order Summary</h3>
                {cartItems.map((item) => (
                  <div key={item._id} className="checkout-item">
                    <div className="checkout-item-img">
                      {item.images && item.images.length > 0 ? (
                        <img src={item.images[0].url} alt={item.name} />
                      ) : <span>⌚</span>}
                    </div>
                    <div className="checkout-item-info">
                      <p className="checkout-item-name">{item.name}</p>
                      <p className="checkout-item-qty">Qty: {item.quantity}</p>
                    </div>
                    <p className="checkout-item-price">
                      Rs. {((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
                <div className="checkout-divider" />
                <div className="checkout-total-row">
                  <span>Shipping</span>
                  <span className="gold-text">FREE</span>
                </div>
                <div className="checkout-total-row checkout-grand-total">
                  <span>Grand Total</span>
                  <span>Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <div className="checkout-payment-badge">
                  Payment: <strong>{paymentMethod}</strong>
                </div>
              </div>

              <button
                className="website-order-btn"
                onClick={handleWebsiteOrder}
                disabled={placing}
              >
                {placing ? (
                  <span className="btn-loading-inline">
                    <span className="btn-spinner-inline" /> Placing Order...
                  </span>
                ) : (
                  <>
                    <FiShoppingBag /> Place Order on Website
                  </>
                )}
              </button>

              <div className="checkout-or-divider">
                <span>or</span>
              </div>

              <button className="whatsapp-btn" onClick={handleWhatsAppOrder}>
                <span className="whatsapp-icon">📱</span>
                Order via WhatsApp
              </button>

              <p className="whatsapp-note">
                Place your order directly on our website, or send it via WhatsApp for instant confirmation.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;