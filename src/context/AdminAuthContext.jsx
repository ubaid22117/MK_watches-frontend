import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAuthContext = createContext();

// Alag context — user AuthContext se bilkul alag
export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('adminUser');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.isAdmin) setAdminUser(parsed);
        else localStorage.removeItem('adminUser');
      } catch {
        localStorage.removeItem('adminUser');
      }
    }
    setAdminLoading(false);
  }, []);

  const adminLogout = () => {
    localStorage.removeItem('adminUser');
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, setAdminUser, adminLogout, adminLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);