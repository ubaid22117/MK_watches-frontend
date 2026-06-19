import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('MKWishlist');
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('MKWishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        toast('Already in wishlist!', { icon: '💛', id: 'wishlist-exists' });
        return prev;
      }
      toast.success('Added to wishlist!', { id: 'wishlist-add' });
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((id) => {
    setWishlist((prev) => prev.filter((item) => item._id !== id));
    toast.success('Removed from wishlist!', { id: 'wishlist-remove' });
  }, []);

  const isInWishlist = useCallback(
    (id) => wishlist.some((item) => item._id === id),
    [wishlist]
  );

  return (
    <WishlistContext.Provider value={{
      wishlist, addToWishlist, removeFromWishlist, isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);