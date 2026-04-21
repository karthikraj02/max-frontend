import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './assets/styles/global.css';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrdersPage from './pages/OrdersPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';

// Admin
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminAnalytics from './pages/admin/AdminAnalytics';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // Avoid duplicate loading screens
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; 
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main style={{ minHeight: 'calc(100vh - 64px)', paddingTop: '64px' }}>{children}</main>
    <Footer />
  </>
);

const PageTransitionLoader = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200); 

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {loading && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(3px)', zIndex: 99999 }}>
          <img src="/loading-cat.gif" alt="Loading..." style={{ width: 150, objectFit: 'contain' }} />
        </div>
      )}
      {children}
    </>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
      <Route path="/products/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected */}
      <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} />
      <Route path="/checkout" element={<ProtectedRoute><PublicLayout><CheckoutPage /></PublicLayout></ProtectedRoute>} />
      <Route path="/order-success/:id" element={<ProtectedRoute><PublicLayout><OrderSuccessPage /></PublicLayout></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><PublicLayout><OrdersPage /></PublicLayout></ProtectedRoute>} />
      <Route path="/orders/:id/track" element={<ProtectedRoute><PublicLayout><OrderTrackingPage /></PublicLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><PublicLayout><ProfilePage /></PublicLayout></ProtectedRoute>} />
      <Route path="/wishlist" element={<ProtectedRoute><PublicLayout><WishlistPage /></PublicLayout></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/:id/edit" element={<AdminProductForm />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <PageTransitionLoader>
            <AppRoutes />
          </PageTransitionLoader>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#111', color: '#f5f5f7', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' },
              success: { iconTheme: { primary: '#30d158', secondary: '#111' } },
              error: { iconTheme: { primary: '#ff453a', secondary: '#111' } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
