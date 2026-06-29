import { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUserState] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);

  // App start hone par localStorage check karo
  useEffect(() => {
    try {
      const stored = localStorage.getItem('adminUser');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.isAdmin && parsed?.token) {
          setAdminUserState(parsed);
        } else {
          localStorage.removeItem('adminUser');
        }
      }
    } catch {
      localStorage.removeItem('adminUser');
    } finally {
      setAdminLoading(false);
    }
  }, []);

  // setAdminUser — context + localStorage dono update karo
  const setAdminUser = (userData) => {
    if (userData) {
      localStorage.setItem('adminUser', JSON.stringify(userData));
      setAdminUserState(userData);
    } else {
      localStorage.removeItem('adminUser');
      setAdminUserState(null);
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('adminUser');
    setAdminUserState(null);
  };

  return (
    <AdminAuthContext.Provider value={{
      adminUser,
      setAdminUser,
      adminLogout,
      adminLoading,
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};