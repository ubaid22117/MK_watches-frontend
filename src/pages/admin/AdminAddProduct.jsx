import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';
import { FiUpload } from 'react-icons/fi';

const AdminAddProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPrice: '',
    category: 'Luxury', brand: 'MK', stock: '',
    isFeatured: false, isNewArrival: false, isBestSeller: false,
    movement: '', caseMaterial: '', caseSize: '',
    waterResistance: '', strapMaterial: '', crystal: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) {
      toast.error('Name, price and stock are required!');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      const specKeys = ['movement', 'caseMaterial', 'caseSize', 'waterResistance', 'strapMaterial', 'crystal'];
      Object.keys(form).forEach((key) => {
        if (!specKeys.includes(key)) formData.append(key, form[key]);
      });
      formData.append('specifications', JSON.stringify({
        movement: form.movement, caseMaterial: form.caseMaterial,
        caseSize: form.caseSize, waterResistance: form.waterResistance,
        strapMaterial: form.strapMaterial, crystal: form.crystal,
      }));
      images.forEach((img) => formData.append('images', img));

      await axios.post('http://192.168.100.8:5000/api/products', formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Product added successfully!');
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Add New Product</h1>
      </div>

      <motion.form onSubmit={handleSubmit} className="admin-form-grid"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="admin-form-left">
          <div className="admin-card">
            <h3 className="admin-card-title">Product Information</h3>

            <div className="admin-form-group">
              <label>Product Name *</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="Watch name" required />
            </div>
            <div className="admin-form-group">
              <label>Description *</label>
              <textarea name="description" value={form.description}
                onChange={handleChange} rows={4}
                placeholder="Describe this watch..." required />
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Price (Rs.) *</label>
                <input type="number" name="price" value={form.price}
                  onChange={handleChange} placeholder="25000" required />
              </div>
              <div className="admin-form-group">
                <label>Discount Price (Rs.)</label>
                <input type="number" name="discountPrice" value={form.discountPrice}
                  onChange={handleChange} placeholder="20000" />
              </div>
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option>Luxury</option>
                  <option>Sport</option>
                  <option>Classic</option>
                  <option>Digital</option>
                  <option>Limited Edition</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>Stock Quantity *</label>
                <input type="number" name="stock" value={form.stock}
                  onChange={handleChange} placeholder="10" required />
              </div>
            </div>
            <div className="admin-checkboxes">
              {[
                { name: 'isFeatured', label: 'Featured Product' },
                { name: 'isNewArrival', label: 'New Arrival' },
                { name: 'isBestSeller', label: 'Best Seller' },
              ].map((cb) => (
                <label key={cb.name} className="admin-checkbox-label">
                  <input type="checkbox" name={cb.name}
                    checked={form[cb.name]} onChange={handleChange} />
                  <span>{cb.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="admin-card" style={{ marginTop: '1rem' }}>
            <h3 className="admin-card-title">Technical Specifications</h3>
            <div className="admin-form-row">
              {[
                { name: 'movement', label: 'Movement', placeholder: 'Automatic / Quartz' },
                { name: 'caseMaterial', label: 'Case Material', placeholder: 'Stainless Steel' },
                { name: 'caseSize', label: 'Case Size', placeholder: '42mm' },
                { name: 'waterResistance', label: 'Water Resistance', placeholder: '50m' },
                { name: 'strapMaterial', label: 'Strap Material', placeholder: 'Leather / Steel' },
                { name: 'crystal', label: 'Crystal Type', placeholder: 'Sapphire' },
              ].map((spec) => (
                <div key={spec.name} className="admin-form-group">
                  <label>{spec.label}</label>
                  <input name={spec.name} value={form[spec.name]}
                    onChange={handleChange} placeholder={spec.placeholder} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-form-right">
          <div className="admin-card">
            <h3 className="admin-card-title">Product Images</h3>
            <label className="admin-upload-area">
              <input type="file" multiple accept="image/*"
                onChange={handleImages} style={{ display: 'none' }} />
              <FiUpload size={32} color="#D4AF37" />
              <p>Click to select images</p>
              <span>PNG, JPG, WEBP — Max 5 images</span>
            </label>
            {previews.length > 0 && (
              <div className="admin-img-previews">
                {previews.map((url, i) => (
                  <img key={i} src={url} alt={`preview-${i}`} />
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="admin-submit-btn" disabled={loading}>
            {loading ? 'Adding Product...' : '✓ Add Product'}
          </button>
        </div>
      </motion.form>
    </AdminLayout>
  );
};

export default AdminAddProduct;