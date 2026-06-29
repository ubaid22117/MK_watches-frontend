import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminLayout from './AdminLayout';
import { FiUpload, FiX, FiSave } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL;

const CATEGORIES = ['Luxury', 'Sport', 'Classic', 'Digital', 'Limited Edition'];

const emptyForm = {
  name: '', description: '', price: '', discountPrice: '',
  category: 'Luxury', stock: '',
  isNewArrival: false, isBestSeller: false,
  specifications: {
    movement: '', caseMaterial: '', caseSize: '',
    waterResistance: '', strapMaterial: '', crystal: '',
  },
};

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminUser } = useAdminAuth();
  const [form, setForm] = useState(emptyForm);
  const [existingImages, setExistingImages] = useState([]);  // already uploaded
  const [newImages, setNewImages] = useState([]);            // new files to upload
  const [previews, setPreviews] = useState([]);              // preview for new files
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const headers = { Authorization: `Bearer ${adminUser?.token}` };

  // Fetch existing product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/products/${id}`);
        const p = data.product;
        setForm({
          name: p.name || '',
          description: p.description || '',
          price: p.price || '',
          discountPrice: p.discountPrice || '',
          category: p.category || 'Luxury',
          stock: p.stock || '',
          isNewArrival: p.isNewArrival || false,
          isBestSeller: p.isBestSeller || false,
          specifications: {
            movement: p.specifications?.movement || '',
            caseMaterial: p.specifications?.caseMaterial || '',
            caseSize: p.specifications?.caseSize || '',
            waterResistance: p.specifications?.waterResistance || '',
            strapMaterial: p.specifications?.strapMaterial || '',
            crystal: p.specifications?.crystal || '',
          },
        });
        setExistingImages(p.images || []);
      } catch (err) {
        toast.error('Failed to load product');
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      specifications: { ...prev.specifications, [name]: value },
    }));
  };

  const handleImageFiles = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeExistingImage = (publicId) => {
    setExistingImages(prev => prev.filter(img => img.public_id !== publicId));
  };

  const removeNewImage = (idx) => {
    setNewImages(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) {
      toast.error('Name, price and stock are required');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'specifications') {
          formData.append('specifications', JSON.stringify(val));
        } else {
          formData.append(key, val);
        }
      });

      // Existing images jo rakhni hain
      formData.append('existingImages', JSON.stringify(existingImages));

      // New images
      newImages.forEach(file => formData.append('images', file));

      await axios.put(`${API_URL}/api/products/${id}`, formData, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Product updated successfully!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="admin-loading"><div className="spinner" /></div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Edit Product</h1>
          <p className="admin-page-sub">{form.name}</p>
        </div>
        <button onClick={() => navigate('/admin/products')} className="admin-back-btn">
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-form-grid">

          {/* ── Left Column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Basic Info */}
            <motion.div className="admin-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="admin-card-title" style={{ marginBottom: '1.2rem' }}>Basic Information</h3>
              <div className="admin-form-field">
                <label>Product Name *</label>
                <input name="name" value={form.name} onChange={handleChange}
                  placeholder="e.g. Rolex Submariner Date" required />
              </div>
              <div className="admin-form-field">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  rows={4} placeholder="Describe the watch..." />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-field">
                  <label>Category *</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="admin-form-field">
                  <label>Stock *</label>
                  <input type="number" name="stock" value={form.stock} onChange={handleChange}
                    min="0" placeholder="0" required />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-field">
                  <label>Price (Rs.) *</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange}
                    min="0" placeholder="145000" required />
                </div>
                <div className="admin-form-field">
                  <label>Discount Price (Rs.)</label>
                  <input type="number" name="discountPrice" value={form.discountPrice}
                    onChange={handleChange} min="0" placeholder="Leave empty if no discount" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                <label className="admin-checkbox-label">
                  <input type="checkbox" name="isNewArrival" checked={form.isNewArrival}
                    onChange={handleChange} />
                  New Arrival
                </label>
                <label className="admin-checkbox-label">
                  <input type="checkbox" name="isBestSeller" checked={form.isBestSeller}
                    onChange={handleChange} />
                  Best Seller
                </label>
              </div>
            </motion.div>

            {/* Specifications */}
            <motion.div className="admin-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}>
              <h3 className="admin-card-title" style={{ marginBottom: '1.2rem' }}>Specifications</h3>
              <div className="admin-form-row">
                {[
                  { name: 'movement', label: 'Movement' },
                  { name: 'caseMaterial', label: 'Case Material' },
                  { name: 'caseSize', label: 'Case Size' },
                  { name: 'waterResistance', label: 'Water Resistance' },
                  { name: 'strapMaterial', label: 'Strap Material' },
                  { name: 'crystal', label: 'Crystal' },
                ].map(spec => (
                  <div key={spec.name} className="admin-form-field">
                    <label>{spec.label}</label>
                    <input name={spec.name} value={form.specifications[spec.name]}
                      onChange={handleSpecChange} placeholder={spec.label} />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right Column — Images ── */}
          <motion.div className="admin-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            style={{ alignSelf: 'start' }}>
            <h3 className="admin-card-title" style={{ marginBottom: '1.2rem' }}>Product Images</h3>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '8px' }}>
                  Current Images (click × to remove)
                </p>
                <div className="admin-images-grid">
                  {existingImages.map(img => (
                    <div key={img.public_id} className="admin-image-thumb">
                      <img src={img.url} alt="product" />
                      <button type="button" className="admin-image-remove"
                        onClick={() => removeExistingImage(img.public_id)}>
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New image previews */}
            {previews.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '8px' }}>
                  New Images (to be uploaded)
                </p>
                <div className="admin-images-grid">
                  {previews.map((src, idx) => (
                    <div key={idx} className="admin-image-thumb">
                      <img src={src} alt={`new-${idx}`} />
                      <button type="button" className="admin-image-remove"
                        onClick={() => removeNewImage(idx)}>
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload button */}
            <label className="admin-upload-label">
              <FiUpload size={20} />
              <span>Click to add images</span>
              <input type="file" multiple accept="image/*"
                onChange={handleImageFiles} style={{ display: 'none' }} />
            </label>
            <p style={{ color: '#555', fontSize: '0.76rem', marginTop: '8px', textAlign: 'center' }}>
              PNG, JPG, WEBP — multiple allowed
            </p>

            {/* Submit button */}
            <button type="submit" disabled={saving} className="admin-save-btn"
              style={{ marginTop: '1.5rem', width: '100%' }}>
              {saving ? 'Saving...' : <><FiSave /> Save Changes</>}
            </button>
          </motion.div>

        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminEditProduct;