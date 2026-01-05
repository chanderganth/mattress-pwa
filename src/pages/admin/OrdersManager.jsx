import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/apiClient.js';

// Helper to convert cm to inches
function cmToInch(cm) {
  return (cm / 2.54).toFixed(1);
}

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  async function load() {
    try {
      const r = await api.get('/orders');
      setOrders(r.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  // Auto-refresh every 10 seconds to get new orders
  useEffect(() => {
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  async function updateStatus(id, status) {
    await api.put('/orders/' + id + '/status', { status });
    await load();
  }

  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);
  const statuses = ['pending', 'manufacturing', 'packed', 'delivered', 'cancelled'];
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    manufacturing: 'bg-blue-100 text-blue-800 border-blue-200',
    packed: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <div className="min-h-screen bg-gray-50 -m-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <nav className="text-sm text-indigo-200 mb-1">
                <Link to="/admin/dashboard" className="hover:text-white">Dashboard</Link>
                <span className="mx-2">/</span>Orders
              </nav>
              <h1 className="text-2xl font-bold">Order Management</h1>
            </div>
            <div className="flex gap-3">
              <button onClick={load} className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <Link to="/admin/dashboard" className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">Dashboard</Link>
              <Link to="/admin/products" className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">Products</Link>
              <Link to="/admin/inventory" className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">Inventory</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statuses.map(s => {
            const count = orders.filter(o => o.status === s).length;
            return (
              <div key={s} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="text-sm text-gray-500 capitalize">{s}</div>
                <div className="text-3xl font-bold text-gray-900">{count}</div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setFilter('ALL')} className={'px-4 py-2 rounded-lg font-medium transition ' + (filter === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50')}>
            All Orders ({orders.length})
          </button>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)} className={'px-4 py-2 rounded-lg font-medium capitalize transition ' + (filter === s ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50')}>
              {s} ({orders.filter(o => o.status === s).length})
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl h-40 animate-pulse"></div>)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
            <p className="text-gray-500">Orders will appear here when customers place them</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(o => (
              <div key={o._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-lg font-bold text-gray-900">Order #{o._id.slice(-8).toUpperCase()}</span>
                        <span className={'text-xs font-semibold px-3 py-1 rounded-full border capitalize ' + (statusColors[o.status] || 'bg-gray-100')}>
                          {o.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600">Rs.{Number(o.totalPrice || 0).toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{cmToInch(o.lengthCm)}" x {cmToInch(o.widthCm)}"</div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="grid md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide">Customer</div>
                      <div className="font-medium text-gray-900">{o.customerName || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide">Phone</div>
                      <div className="font-medium text-gray-900">{o.customerPhone || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide">Address</div>
                      <div className="font-medium text-gray-900 truncate">{o.customerAddress || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Layers */}
                  {o.layers && o.layers.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Layers ({o.layers.length})</div>
                      <div className="flex flex-wrap gap-2">
                        {o.layers.map((l, i) => (
                          <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                            {l.layerName || l.materialType} - {cmToInch(l.thicknessCm)}"
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status Actions */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <span className="text-sm text-gray-500 mr-2 self-center">Update Status:</span>
                    {statuses.map(s => (
                      <button
                        key={s}
                        onClick={() => updateStatus(o._id, s)}
                        disabled={o.status === s}
                        className={'px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ' + (o.status === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
