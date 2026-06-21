import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';
import { FiPlus, FiEdit, FiTrash2, FiPackage } from 'react-icons/fi';

const AdminProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('${import.meta.env.VITE_API_URL}/api/products');
      setProducts(data.products);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      toast.success('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

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

      {loading ? (
        <div className="admin-loading"><div className="spinner" /></div>
      ) : products.length === 0 ? (
        <div className="admin-empty">
          <FiPackage size={50} color="#444" />
          <h3>No Products Yet</h3>
          <p>Add your first luxury watch</p>
          <Link to="/admin/products/add" className="admin-add-btn" style={{ marginTop: '1rem' }}>
            <FiPlus /> Add Product
          </Link>
        </div>
      ) : (
        <motion.div className="admin-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
                        {product.images?.length > 0 ? (
                          <img src={product.images[0].url} alt={product.name} />
                        ) : <span>⌚</span>}
                      </div>
                    </td>
                    <td className="product-name-cell">{product.name}</td>
                    <td><span className="category-pill">{product.category}</span></td>
                    <td style={{ color: '#D4AF37' }}>
                      Rs. {(product.discountPrice || product.price).toLocaleString()}
                    </td>
                    <td>
                      <span style={{ color: product.stock > 0 ? '#2ecc71' : '#e74c3c', fontWeight: 600 }}>
                        {product.stock > 0 ? product.stock : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <Link to={`/admin/products/edit/${product._id}`} className="admin-edit-btn">
                          <FiEdit />
                        </Link>
                        <button className="admin-delete-btn"
                          onClick={() => handleDelete(product._id, product.name)}>
                          <FiTrash2 />
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