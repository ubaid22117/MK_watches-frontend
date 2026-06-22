import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('MKWishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        setWishlist(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Wishlist load error:', error);
      setWishlist([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('MKWishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Wishlist save error:', error);
    }
  }, [wishlist]);

  const addToWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const exists = safePrev.find((item) => item._id === product._id);
      if (exists) {
        toast('Already in wishlist!', { icon: '💛', id: 'wishlist-exists' });
        return safePrev;
      }
      toast.success('Added to wishlist!', { id: 'wishlist-add' });
      return [...safePrev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((id) => {
    setWishlist((prev) => (Array.isArray(prev) ? prev.filter((item) => item._id !== id) : []));
    toast.success('Removed from wishlist!', { id: 'wishlist-remove' });
  }, []);

  const isInWishlist = useCallback(
    (id) => (Array.isArray(wishlist) ? wishlist.some((item) => item._id === id) : false),
    [wishlist]
  );

  const safeWishlist = Array.isArray(wishlist) ? wishlist : [];

  return (
    <WishlistContext.Provider value={{
      wishlist: safeWishlist, addToWishlist, removeFromWishlist, isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);