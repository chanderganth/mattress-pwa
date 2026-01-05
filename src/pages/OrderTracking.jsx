import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/apiClient.js';

// Helper to convert cm to inches
function cmToInch(cm) {
  return (cm / 2.54).toFixed(1);
}

export default function OrderTracking() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [filter, setFilter] = useState('all');

  async function loadOrders() {
    try {
      const r = await api.get('/orders');
      setOrders(r.data || []);
    } catch (e) {
      console.error('Failed to load orders:', e);
      setOrders([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  // Auto-refresh every 15 seconds to get status updates
  useEffect(() => {
    const interval = setInterval(loadOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    manufacturing: 'bg-blue-100 text-blue-700 border-blue-200',
    packed: 'bg-purple-100 text-purple-700 border-purple-200',
    shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    delivered: 'bg-green-100 text-green-700 border-green-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200'
  };

  const statusSteps = ['pending', 'manufacturing', 'packed', 'delivered'];

  const filteredOrders = orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (searchId && !o._id.toLowerCase().includes(searchId.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold">Track Your Orders</h1>
          <p className="mt-2 text-indigo-200">Monitor the status of all your orders in one place</p>
          <p className="mt-1 text-sm text-indigo-300">Auto-refreshes every 15 seconds</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by Order ID..."
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'manufacturing', 'packed', 'delivered'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={'px-4 py-2 rounded-xl text-sm font-medium transition ' +
                    (filter === status
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            {/* Refresh Button */}
            <button onClick={loadOrders} className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-12 text-center">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Orders Found</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchId || filter !== 'all'
                ? "No orders match your search criteria. Try adjusting your filters."
                : "You haven't placed any orders yet. Start shopping to see your orders here!"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition transform"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Browse Products
              </Link>
              <Link
                to="/builder"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Custom Builder
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => {
              const currentStepIndex = statusSteps.indexOf(order.status);

              return (
                <div key={order._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">Order ID:</span>
                        <span className="font-mono font-semibold text-gray-900">{order._id.slice(-8).toUpperCase()}</span>
                        <span className={'px-3 py-1 rounded-full text-xs font-semibold border ' + (statusColors[order.status] || 'bg-gray-100 text-gray-600')}>
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600">Rs.{Number(order.totalPrice || 0).toLocaleString()}</div>
                      <p className="text-sm text-gray-500">{cmToInch(order.lengthCm)}" x {cmToInch(order.widthCm)}"</p>
                    </div>
                  </div>

                  {/* Progress Tracker */}
                  {order.status !== 'cancelled' && (
                    <div className="px-6 py-6">
                      <div className="flex items-center justify-between relative">
                        {/* Progress Line */}
                        <div className="absolute left-0 right-0 top-4 h-1 bg-gray-200 rounded-full">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                            style={{ width: currentStepIndex >= 0 ? ((currentStepIndex / (statusSteps.length - 1)) * 100) + '%' : '0%' }}
                          />
                        </div>

                        {/* Steps */}
                        {statusSteps.map((step, idx) => {
                          const isCompleted = idx <= currentStepIndex;
                          const isCurrent = idx === currentStepIndex;

                          return (
                            <div key={step} className="relative z-10 flex flex-col items-center">
                              <div className={'w-8 h-8 rounded-full flex items-center justify-center text-sm transition ' +
                                (isCompleted
                                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                                  : 'bg-gray-200 text-gray-400')}>
                                {isCompleted ? (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (idx + 1)}
                              </div>
                              <span className={'text-xs mt-2 font-medium ' + (isCompleted ? 'text-indigo-600' : 'text-gray-400')}>
                                {step.charAt(0).toUpperCase() + step.slice(1)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Order Details */}
                  <div className="px-6 pb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Layers</h4>
                      <div className="space-y-2">
                        {(order.layers || []).length > 0 ? order.layers.map((layer, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-semibold">
                                {idx + 1}
                              </span>
                              <span className="font-medium">{layer.layerName || 'Layer'}</span>
                              <span className="text-gray-400">({layer.materialType})</span>
                            </div>
                            <span className="text-gray-600">{cmToInch(layer.thicknessCm)}"</span>
                          </div>
                        )) : (
                          <p className="text-sm text-gray-500">Standard product order</p>
                        )}
                      </div>
                    </div>

                    {/* Customer Info */}
                    {order.customerName && (
                      <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {order.customerName}
                        </span>
                        {order.customerPhone && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {order.customerPhone}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
