import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('MKUser');
      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        const parsed = JSON.parse(savedUser);
        setUser(parsed && typeof parsed === 'object' ? parsed : null);
      }
    } catch (error) {
      console.error('Auth load error:', error);
      localStorage.removeItem('MKUser');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem('MKUser', JSON.stringify(userData));
    } catch (error) {
      console.error('Auth save error:', error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('MKUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);