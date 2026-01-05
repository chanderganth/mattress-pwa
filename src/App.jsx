import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import CustomBuilder from './pages/CustomBuilder.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderTracking from './pages/OrderTracking.jsx';
import VIPDashboard from './pages/VIPDashboard.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import VerifyOTP from './pages/VerifyOTP.jsx';
import AdminLogin from './pages/admin/Login.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';
import ProductsManager from './pages/admin/ProductsManager.jsx';
import LayersManager from './pages/admin/LayersManager.jsx';
import OrdersManager from './pages/admin/OrdersManager.jsx';
import InventoryManager from './pages/admin/InventoryManager.jsx';
import VIPManager from './pages/admin/VIPManager.jsx';
import Settings from './pages/admin/Settings.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import RetailerLogin from './pages/retailer/Login.jsx';
import RetailerDashboard from './pages/retailer/Dashboard.jsx';
import RetailerProductList from './pages/retailer/ProductList.jsx';
import RetailerBuilder from './pages/retailer/Builder.jsx';
import RetailerBulkOrder from './pages/retailer/BulkOrder.jsx';
import RetailerOrders from './pages/retailer/Orders.jsx';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { getCartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const cartCount = getCartCount();

  if (location.pathname.startsWith('/admin/') || location.pathname.startsWith('/retailer/') || location.pathname === '/verify-otp') {
    return null;
  }

  return (
    <header className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 9V7c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v2c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2v1c0 .55.45 1 1 1s1-.45 1-1v-1h12v1c0 .55.45 1 1 1s1-.45 1-1v-1c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2zm-14-.5c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v.5H6v-.5zM4 14v-3c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v3H4z"/>
            </svg>
            <span className="font-bold text-xl hidden sm:block">Mattress & Foam</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className={'px-4 py-2 rounded-lg transition ' + (location.pathname === '/' ? 'bg-white/20' : 'hover:bg-white/10')}>Home</Link>
            <Link to="/products" className={'px-4 py-2 rounded-lg transition ' + (location.pathname.startsWith('/products') ? 'bg-white/20' : 'hover:bg-white/10')}>Products</Link>
            <Link to="/builder" className={'px-4 py-2 rounded-lg transition ' + (location.pathname === '/builder' ? 'bg-white/20' : 'hover:bg-white/10')}>Custom Builder</Link>
            <Link to="/orders" className={'px-4 py-2 rounded-lg transition ' + (location.pathname === '/orders' ? 'bg-white/20' : 'hover:bg-white/10')}>Track Order</Link>
            <Link to="/cart" className={'relative px-4 py-2 rounded-lg transition ' + (location.pathname === '/cart' ? 'bg-white/20' : 'hover:bg-white/10')}>
              <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Cart
              {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{cartCount > 9 ? '9+' : cartCount}</span>}
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/80">Hi, {user?.name || user?.email?.split('@')[0]}</span>
                <button onClick={logout} className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">Login</Link>
            )}
            <Link to="/vip" className="px-4 py-2 text-amber-300 hover:text-amber-200 transition">VIP</Link>
            <Link to="/retailer" className="px-4 py-2 hover:bg-white/10 rounded-lg transition">Retailer</Link>
            <Link to="/admin" className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">Admin</Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Link to="/cart" className="relative p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{cartCount > 9 ? '9+' : cartCount}</span>}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-white/10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col gap-1">
              <Link to="/" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg hover:bg-white/10">Home</Link>
              <Link to="/products" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg hover:bg-white/10">Products</Link>
              <Link to="/builder" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg hover:bg-white/10">Custom Builder</Link>
              <Link to="/orders" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg hover:bg-white/10">Track Order</Link>
              <Link to="/cart" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg hover:bg-white/10 flex items-center gap-2">
                Cart {cartCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{cartCount}</span>}
              </Link>
              <div className="border-t border-white/10 my-2"></div>
              {isAuthenticated ? (
                <>
                  <span className="px-4 py-2 text-white/70">Hi, {user?.name || user?.email?.split('@')[0]}</span>
                  <button onClick={() => { logout(); setIsOpen(false); }} className="px-4 py-3 rounded-lg hover:bg-white/10 text-left">Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg bg-white/10">Login / Register</Link>
              )}
              <Link to="/vip" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg text-amber-300">VIP Access</Link>
              <Link to="/retailer" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg hover:bg-white/10">Retailer Portal</Link>
              <Link to="/admin" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg bg-white/10">Admin Login</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/builder" element={<CustomBuilder />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<OrderTracking />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/vip" element={<ProtectedRoute><VIPDashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute role="ADMIN"><ProductsManager /></ProtectedRoute>} />
              <Route path="/admin/layers" element={<ProtectedRoute role="ADMIN"><LayersManager /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute role="ADMIN"><OrdersManager /></ProtectedRoute>} />
              <Route path="/admin/inventory" element={<ProtectedRoute role="ADMIN"><InventoryManager /></ProtectedRoute>} />
              <Route path="/admin/vip" element={<ProtectedRoute role="ADMIN"><VIPManager /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute role="ADMIN"><Settings /></ProtectedRoute>} />
              <Route path="/retailer" element={<RetailerLogin />} />
              <Route path="/retailer/dashboard" element={<ProtectedRoute role="RETAILER"><RetailerDashboard /></ProtectedRoute>} />
              <Route path="/retailer/products" element={<ProtectedRoute role="RETAILER"><RetailerProductList /></ProtectedRoute>} />
              <Route path="/retailer/builder" element={<ProtectedRoute role="RETAILER"><RetailerBuilder /></ProtectedRoute>} />
              <Route path="/retailer/bulk" element={<ProtectedRoute role="RETAILER"><RetailerBulkOrder /></ProtectedRoute>} />
              <Route path="/retailer/orders" element={<ProtectedRoute role="RETAILER"><RetailerOrders /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
