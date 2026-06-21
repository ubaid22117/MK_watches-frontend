import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';
import { FiTrash2, FiUser, FiShield } from 'react-icons/fi';

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('${import.meta.env.VITE_API_URL}/api/users', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setUsers(data.users);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user?.token) fetchUsers(); }, [user]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      toast.success('User deleted successfully!');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Users</h1>
          <p className="admin-page-sub">{users.length} registered users</p>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="spinner" /></div>
      ) : (
        <motion.div className="admin-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-small">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ color: '#888' }}>{u.email}</td>
                    <td>
                      {u.isAdmin ? (
                        <span className="role-admin"><FiShield /> Admin</span>
                      ) : (
                        <span className="role-user"><FiUser /> Customer</span>
                      )}
                    </td>
                    <td>
                      <span style={{
                        color: u.isVerified ? '#2ecc71' : '#e67e22',
                        fontSize: '0.78rem', fontWeight: 600
                      }}>
                        {u.isVerified ? '✓ Verified' : '⏳ Pending'}
                      </span>
                    </td>
                    <td style={{ color: '#666' }}>
                      {new Date(u.createdAt).toLocaleDateString('en-PK')}
                    </td>
                    <td>
                      {!u.isAdmin && (
                        <button className="admin-delete-btn"
                          onClick={() => handleDelete(u._id, u.name)}>
                          <FiTrash2 />
                        </button>
                      )}
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

export default AdminUsers;