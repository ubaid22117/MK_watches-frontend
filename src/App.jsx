import { Routes, Route } from 'react-router-dom';

// ── User Pages ──────────────────────────────────────────────────
import Home           from './pages/Home';
import Products       from './pages/Products';
import ProductDetail  from './pages/ProductDetail';
import Cart           from './pages/Cart';
import Checkout       from './pages/Checkout';
import Wishlist       from './pages/Wishlist';
import Login          from './pages/Login';
import Register       from './pages/Register';
import VerifyEmail    from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword  from './pages/ResetPassword';

// ── Admin Pages ─────────────────────────────────────────────────
import AdminLogin       from './pages/admin/AdminLogin';
import AdminDashboard   from './pages/admin/AdminDashboard';
import AdminProducts    from './pages/admin/AdminProducts';
import AdminAddProduct  from './pages/admin/AdminAddProduct';
import AdminEditProduct from './pages/admin/AdminEditProduct';
import AdminOrders      from './pages/admin/AdminOrders';
import AdminUsers       from './pages/admin/AdminUsers';

// ── Admin Auth (alag context — user se alag) ────────────────────
import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminRoute            from './pages/admin/AdminRoute';

function App() {
  return (
    <AdminAuthProvider>
      <Routes>

        {/* ── Public / User Routes ── */}
        <Route path="/"                      element={<Home />} />
        <Route path="/products"              element={<Products />} />
        <Route path="/products/:id"          element={<ProductDetail />} />
        <Route path="/cart"                  element={<Cart />} />
        <Route path="/checkout"              element={<Checkout />} />
        <Route path="/wishlist"              element={<Wishlist />} />
        <Route path="/login"                 element={<Login />} />
        <Route path="/register"              element={<Register />} />
        <Route path="/verify-email/:token"   element={<VerifyEmail />} />
        <Route path="/forgot-password"       element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ── Admin Login — bilkul alag, user login se alag ── */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ── Admin Protected Routes ── */}
        {/* AdminRoute check karta hai: admin logged in hai? Nahi to /admin/login */}
        <Route path="/admin" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />
        <Route path="/admin/dashboard" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />
        <Route path="/admin/products" element={
          <AdminRoute><AdminProducts /></AdminRoute>
        } />
        <Route path="/admin/products/add" element={
          <AdminRoute><AdminAddProduct /></AdminRoute>
        } />
        <Route path="/admin/products/edit/:id" element={
          <AdminRoute><AdminEditProduct /></AdminRoute>
        } />
        <Route path="/admin/orders" element={
          <AdminRoute><AdminOrders /></AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute><AdminUsers /></AdminRoute>
        } />

      </Routes>
    </AdminAuthProvider>
  );
}

export default App;