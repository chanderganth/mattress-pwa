import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../config/apiClient.js';

// Helper to convert cm to inches
function cmToInch(cm) {
  return (cm / 2.54).toFixed(1);
}

function RetailerNav() {
  const location = useLocation();
  const navItems = [
    { path: '/retailer/dashboard', label: 'Dashboard' },
    { path: '/retailer/products', label: 'Products' },
    { path: '/retailer/builder', label: 'Custom Builder' },
    { path: '/retailer/bulk', label: 'Bulk Orders' },
    { path: '/retailer/orders', label: 'Order History' }
  ];

  return (
    <header className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="font-bold text-xl hidden sm:block">Retailer Portal</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link key={item.path} to={item.path}
                className={'px-4 py-2 rounded-lg transition ' + 
                  (location.pathname === item.path ? 'bg-white/20' : 'hover:bg-white/10')}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link to="/retailer" className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20">Logout</Link>
        </div>
      </div>
    </header>
  );
}

export default function RetailerBulkOrder() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });
  const [step, setStep] = useState(1);

  useEffect(() => {
    api.get('/products')
      .then(r => {
        // Filter only STANDARD products for bulk orders
        const standardProducts = (r.data || []).filter(p => p.type === 'STANDARD' && p.enabled);
        setProducts(standardProducts);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const product = products.find(p => p._id === id);
        return product ? { ...product, quantity: qty } : null;
      })
      .filter(Boolean);
  }, [cart, products]);

  const totalItems = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
  const totalPrice = useMemo(() => cartItems.reduce((sum, item) => sum + (item.retailerPrice || item.price) * item.quantity, 0), [cartItems]);
  const savings = useMemo(() => cartItems.reduce((sum, item) => sum + (item.price - (item.retailerPrice || item.price)) * item.quantity, 0), [cartItems]);

  function updateQty(productId, delta) {
    setCart(prev => {
      const newQty = Math.max(0, (prev[productId] || 0) + delta);
      return { ...prev, [productId]: newQty };
    });
  }

  function setQty(productId, qty) {
    setCart(prev => ({ ...prev, [productId]: Math.max(0, Number(qty) || 0) }));
  }

  async function placeOrder() {
    if (cartItems.length === 0) { alert('Add at least one product'); return; }
    setPlacing(true);
    try {
      const payload = {
        items: cartItems.map(item => ({ productId: item._id, quantity: item.quantity })),
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        type: 'bulk'
      };
      await api.post('/orders/bulk', payload);
      alert('Bulk order placed successfully! Total: Rs.' + totalPrice.toLocaleString());
      setCart({});
      window.location.href = '/retailer/orders';
    } catch (err) {
      alert('Failed to place order: ' + (err.response?.data?.error || err.message));
    } finally {
      setPlacing(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <RetailerNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bulk Order</h1>
          <p className="text-gray-500 mt-1">Order multiple ready-made mattresses at wholesale prices</p>
        </div>

        {/* Step Indicators */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
          <div className="flex items-center justify-center gap-4">
            {[1, 2].map(s => (
              <button key={s} onClick={() => setStep(s)}
                className={'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ' +
                  (step === s ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">{s}</span>
                {s === 1 ? 'Select Products' : 'Review & Order'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Product Selection */}
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Select Products ({products.length} available)
                </h2>

                {products.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="mt-3">No products available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map(product => (
                      <div key={product._id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-emerald-300 transition">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                          <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-500">
                            {cmToInch(product.size?.lengthCm || 0)}" x {cmToInch(product.size?.widthCm || 0)}" x {cmToInch(product.size?.thicknessCm || 0)}"
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-emerald-600 font-bold">Rs.{(product.retailerPrice || product.price || 0).toLocaleString()}</span>
                            {product.retailerPrice && product.retailerPrice < product.price && (
                              <span className="text-sm text-gray-400 line-through">Rs.{(product.price || 0).toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQty(product._id, -1)}
                            className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-xl font-bold flex items-center justify-center">-</button>
                          <input type="number" value={cart[product._id] || 0} onChange={e => setQty(product._id, e.target.value)}
                            className="w-16 h-10 text-center border border-gray-200 rounded-lg" min="0" />
                          <button onClick={() => updateQty(product._id, 1)}
                            className="w-10 h-10 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xl font-bold flex items-center justify-center">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button onClick={() => setStep(2)} disabled={cartItems.length === 0}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    Next: Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Review & Customer Info */}
            {step === 2 && (
              <>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Order Items ({totalItems})
                  </h2>
                  <div className="space-y-3">
                    {cartItems.map(item => (
                      <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">Rs.{(item.retailerPrice || item.price).toLocaleString()} × {item.quantity}</div>
                        </div>
                        <div className="font-bold text-emerald-600">
                          Rs.{((item.retailerPrice || item.price) * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Delivery Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                      <input type="text" value={customerInfo.name} onChange={e => setCustomerInfo(p => ({ ...p, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Full name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input type="tel" value={customerInfo.phone} onChange={e => setCustomerInfo(p => ({ ...p, phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="10-digit phone" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                      <textarea value={customerInfo.address} onChange={e => setCustomerInfo(p => ({ ...p, address: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" rows="3" placeholder="Full address" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setStep(1)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition">
                    Back
                  </button>
                  <button onClick={placeOrder} disabled={placing}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50">
                    {placing ? 'Placing Order...' : 'Place Bulk Order'}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Sidebar - Summary */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-emerald-100">Products</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-100">Total Items</span>
                  <span>{totalItems}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-emerald-200">
                    <span>Your Savings</span>
                    <span>Rs.{savings.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-white/20 my-3"></div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-100">Wholesale Total</span>
                  <span className="text-2xl font-bold">Rs.{totalPrice.toLocaleString()}</span>
                </div>
              </div>
              {savings > 0 && (
                <div className="mt-4 text-xs text-emerald-200 text-center">
                  You save Rs.{savings.toLocaleString()} with wholesale pricing!
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Bulk Order Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Order 10+ units for extra 5% discount</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free delivery on orders above Rs.50,000</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Delivery within 5-7 business days</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
