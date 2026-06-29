import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminLayout from './AdminLayout';
import { FiPlus, FiEdit, FiTrash2, FiPackage, FiRefreshCw } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL;

const AdminProducts = () => {
  const { adminUser } = useAdminAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    if (!adminUser?.token) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(`${API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err.response?.data?.message || 'Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminUser?.token) fetchProducts();
  }, [adminUser]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await axios.delete(`${API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${adminUser?.token}` },
      });
      toast.success('Product deleted!');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  // ── Loading state ──
  if (loading) return (
    <AdminLayout>
      <div className="admin-loading">
        <div className="spinner" />
      </div>
    </AdminLayout>
  );

  // ── Error state ──
  if (error) return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
        </div>
        <Link to="/admin/products/add" className="admin-add-btn">
          <FiPlus /> Add New Product
        </Link>
      </div>
      <div style={{
        textAlign: 'center', padding: '3rem',
        background: '#111', borderRadius: '12px',
        border: '1px solid rgba(231,76,60,0.2)',
      }}>
        <p style={{ color: '#e74c3c', marginBottom: '1rem' }}>{error}</p>
        <button
          onClick={fetchProducts}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '10px 20px', background: 'rgba(212,175,55,0.1)',
            border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37',
            borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          <FiRefreshCw size={14} /> Retry
        </button>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-sub">{products.length} total products</p>
        </div>
        <Link to="/admin/products/add" className="admin-add-btn">
          <FiPlus /> Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="admin-empty">
          <FiPackage size={50} color="#444" />
          <h3>No Products Yet</h3>
          <p>Add your first luxury watch</p>
          <Link
            to="/admin/products/add"
            className="admin-add-btn"
            style={{ marginTop: '1rem', display: 'inline-flex' }}
          >
            <FiPlus /> Add Product
          </Link>
        </div>
      ) : (
        <motion.div
          className="admin-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="admin-product-img">
                        {product.images?.length > 0
                          ? <img src={product.images[0].url} alt={product.name} />
                          : <span>⌚</span>}
                      </div>
                    </td>
                    <td className="product-name-cell">{product.name}</td>
                    <td>
                      <span className="category-pill">{product.category}</span>
                    </td>
                    <td style={{ color: '#D4AF37', fontWeight: 600 }}>
                      Rs. {(product.discountPrice || product.price || 0).toLocaleString()}
                    </td>
                    <td>
                      {product.stock > 5 ? (
                        <span style={{ color: '#2ecc71', fontWeight: 600 }}>
                          {product.stock}
                        </span>
                      ) : product.stock > 0 ? (
                        <span style={{ color: '#e67e22', fontWeight: 600 }}>
                          Low ({product.stock})
                        </span>
                      ) : (
                        <span style={{ color: '#e74c3c', fontWeight: 600 }}>
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="admin-actions">
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="admin-edit-btn"
                          title="Edit"
                        >
                          <FiEdit size={15} />
                        </Link>
                        <button
                          className="admin-delete-btn"
                          onClick={() => handleDelete(product._id, product.name)}
                          title="Delete"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;