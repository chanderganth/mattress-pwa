import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../config/apiClient.js';

export default function RetailerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/orders').catch(() => ({ data: [] })),
      api.get('/products').catch(() => ({ data: [] }))
    ]).then(([ordersRes, productsRes]) => {
      const orders = ordersRes.data || [];
      setRecentOrders(orders.slice(0, 5));
      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        totalSpent: orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0),
        productsAvailable: (productsRes.data || []).length
      });
    }).finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    localStorage.removeItem('role');
    localStorage.removeItem('demoMode');
    localStorage.removeItem('userEmail');
    navigate('/retailer');
  }

  const navItems = [
    { path: '/retailer/dashboard', label: 'Dashboard', icon: '' },
    { path: '/retailer/products', label: 'Products', icon: '' },
    { path: '/retailer/builder', label: 'Custom Builder', icon: '' },
    { path: '/retailer/bulk', label: 'Bulk Orders', icon: '' },
    { path: '/retailer/orders', label: 'Order History', icon: '' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-800 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <span className="text-2xl"></span>
              <span className="font-bold text-xl hidden sm:block">Retailer Portal</span>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={'px-4 py-2 rounded-lg transition flex items-center gap-2 ' + 
                    (location.pathname === item.path ? 'bg-white/20' : 'hover:bg-white/10')}
                >
                  <span>{item.icon}</span>
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <span className="text-emerald-200 text-sm hidden sm:block">
                {localStorage.getItem('userEmail') || 'retailer@demo.com'}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="md:hidden bg-white border-b shadow-sm overflow-x-auto">
        <div className="flex p-2 gap-2">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={'px-4 py-2 rounded-lg whitespace-nowrap flex items-center gap-2 transition ' +
                (location.pathname === item.path 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'text-gray-600 hover:bg-gray-100')}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Welcome Back! </h1>
              <p className="mt-2 text-emerald-100">Manage your wholesale orders and access exclusive pricing</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/retailer/builder"
                className="px-6 py-3 bg-white text-emerald-700 rounded-xl font-semibold hover:shadow-lg transition"
              >
                 New Custom Order
              </Link>
              <Link
                to="/retailer/bulk"
                className="px-6 py-3 bg-white/20 rounded-xl font-semibold hover:bg-white/30 transition"
              >
                 Bulk Order
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.totalOrders || 0}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl"></span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.pendingOrders || 0}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl"></span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">₹{(stats?.totalSpent || 0).toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl"></span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Products Available</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.productsAvailable || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Orders */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span></span> Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  to="/retailer/products"
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:shadow-md transition"
                >
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl"></span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Browse Products</h3>
                    <p className="text-sm text-gray-500">View wholesale catalog</p>
                  </div>
                </Link>
                
                <Link
                  to="/retailer/builder"
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl"></span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Custom Builder</h3>
                    <p className="text-sm text-gray-500">Create custom mattresses</p>
                  </div>
                </Link>
                
                <Link
                  to="/retailer/bulk"
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl hover:shadow-md transition"
                >
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl"></span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Bulk Orders</h3>
                    <p className="text-sm text-gray-500">Order multiple items</p>
                  </div>
                </Link>
                
                <Link
                  to="/retailer/orders"
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl"></span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Order History</h3>
                    <p className="text-sm text-gray-500">Track all orders</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Retailer Benefits */}
            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl p-6 mt-6 border border-emerald-200">
              <h3 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                <span></span> Your Benefits
              </h3>
              <ul className="space-y-2 text-sm text-emerald-800">
                <li className="flex items-center gap-2"> 15-20% wholesale discount</li>
                <li className="flex items-center gap-2"> Priority manufacturing</li>
                <li className="flex items-center gap-2"> Dedicated support</li>
                <li className="flex items-center gap-2"> Net 30 payment terms</li>
              </ul>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span></span> Recent Orders
                </h2>
                <Link to="/retailer/orders" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                  View All 
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl"></span>
                  </div>
                  <h3 className="font-semibold text-gray-900">No Orders Yet</h3>
                  <p className="text-sm text-gray-500 mt-1">Place your first order to see it here</p>
                  <Link
                    to="/retailer/products"
                    className="inline-block mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map(order => (
                    <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg"></span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{order.lengthCm}x{order.widthCm} cm</p>
                          <p className="text-sm text-gray-500">{(order.layers || []).length} layers</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">₹{(order.totalPrice || 0).toLocaleString()}</p>
                        <span className={'text-xs px-2 py-1 rounded-full ' + 
                          (order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                           order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                           'bg-blue-100 text-blue-700')}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
