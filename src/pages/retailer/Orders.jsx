import { useEffect, useState } from 'react';
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
                className={'px-4 py-2 rounded-lg transition flex items-center gap-2 ' + 
                  (location.pathname === item.path ? 'bg-white/20' : 'hover:bg-white/10')}>
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            ))}
          </nav>
          <Link to="/retailer" className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20">Logout</Link>
        </div>
      </div>
    </header>
  );
}

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  confirmed: { color: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
  manufacturing: { color: 'bg-purple-100 text-purple-800', label: 'Manufacturing' },
  packed: { color: 'bg-orange-100 text-orange-800', label: 'Packed' },
  delivered: { color: 'bg-emerald-100 text-emerald-800', label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
};

export default function RetailerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  async function loadOrders() {
    try {
      const r = await api.get('/orders');
      setOrders(r.data || []);
    } catch (e) {
      setOrders([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(loadOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter(order => {
    if (filter !== 'all' && order.status !== filter) return false;
    if (search && !order._id?.toLowerCase().includes(search.toLowerCase()) && 
        !order.customerName?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => ['confirmed', 'manufacturing', 'packed'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'delivered').length
  };

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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Order History</h1>
            <p className="text-gray-500 mt-1">Track and manage all your orders (auto-refreshes)</p>
          </div>
          <button onClick={loadOrders} className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-500">Total Orders</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-500">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-500">In Progress</div>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-500">Completed</div>
            <div className="text-2xl font-bold text-emerald-600">{stats.completed}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                placeholder="Search by Order ID or Customer..." />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {[
                { key: 'all', label: 'All' },
                { key: 'pending', label: 'Pending' },
                { key: 'manufacturing', label: 'Manufacturing' },
                { key: 'delivered', label: 'Delivered' }
              ].map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)}
                  className={'px-4 py-2 rounded-lg whitespace-nowrap transition ' +
                    (filter === f.key ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">No orders found</h3>
            <p className="text-gray-500 mt-2">
              {orders.length === 0 ? "You haven't placed any orders yet" : "No orders match your filters"}
            </p>
            <Link to="/retailer/builder" className="inline-block mt-6 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700">
              Create Custom Order
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const isExpanded = expandedOrder === order._id;
              
              return (
                <div key={order._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-6 cursor-pointer" onClick={() => setExpandedOrder(isExpanded ? null : order._id)}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                          <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Order #{order._id?.slice(-8)}</div>
                          <div className="text-sm text-gray-500">{order.customerName || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-bold text-emerald-600">Rs.{(order.totalPrice || 0).toLocaleString()}</div>
                          <div className="text-sm text-gray-500">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                        <span className={'px-3 py-1 rounded-full text-sm font-medium ' + status.color}>
                          {status.label}
                        </span>
                        <svg className={'w-5 h-5 transform transition ' + (isExpanded ? 'rotate-180' : '')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-6 bg-gray-50">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Order Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Dimensions</span>
                              <span>{cmToInch(order.lengthCm)}" x {cmToInch(order.widthCm)}"</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Layers</span>
                              <span>{order.layers?.length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Type</span>
                              <span className="capitalize">{order.type || 'custom'}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Delivery Info</h4>
                          <div className="space-y-2 text-sm">
                            <div><span className="text-gray-500">Phone:</span> {order.customerPhone || 'N/A'}</div>
                            <div><span className="text-gray-500">Address:</span> {order.customerAddress || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                      
                      {order.layers && order.layers.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Layers</h4>
                          <div className="flex flex-wrap gap-2">
                            {order.layers.map((layer, idx) => (
                              <span key={idx} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-sm">
                                {layer.layerName || layer.name} ({cmToInch(layer.thicknessCm)}")
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Progress Timeline */}
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Progress</h4>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                          {['pending', 'manufacturing', 'packed', 'delivered'].map((step, idx) => {
                            const stepIndex = ['pending', 'manufacturing', 'packed', 'delivered'].indexOf(order.status);
                            const isPast = idx <= stepIndex;
                            return (
                              <div key={step} className="flex items-center">
                                <div className={'w-8 h-8 rounded-full flex items-center justify-center text-sm ' +
                                  (isPast ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500')}>
                                  {isPast ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : idx + 1}
                                </div>
                                {idx < 3 && (
                                  <div className={'w-8 h-1 ' + (isPast && idx < stepIndex ? 'bg-emerald-600' : 'bg-gray-200')}></div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
