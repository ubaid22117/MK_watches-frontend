import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mkCart');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCartItems(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Cart load error:', error);
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('mkCart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Cart save error:', error);
    }
  }, [cartItems]);

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const exists = safePrev.find((item) => item._id === product._id);
      if (exists) {
        toast.success('Cart quantity updated!', { id: 'cart-update' });
        return safePrev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      toast.success('Added to cart!', { id: 'cart-add' });
      return [...safePrev, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => (Array.isArray(prev) ? prev.filter((item) => item._id !== id) : []));
    toast.success('Removed from cart!', { id: 'cart-remove' });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      Array.isArray(prev)
        ? prev.map((item) => (item._id === id ? { ...item, quantity } : item))
        : []
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('mkCart');
  }, []);

  // Used for "Buy Now" — replaces cart with just this one item
  const buyNow = useCallback((product, quantity = 1) => {
    setCartItems([{ ...product, quantity }]);
  }, []);

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const totalPrice = safeCartItems.reduce(
    (total, item) => total + (item.discountPrice || item.price || 0) * (item.quantity || 0), 0
  );

  const totalItems = safeCartItems.reduce(
    (total, item) => total + (item.quantity || 0), 0
  );

  return (
    <CartContext.Provider value={{
      cartItems: safeCartItems, addToCart, removeFromCart,
      updateQuantity, clearCart, totalPrice, totalItems, buyNow
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);