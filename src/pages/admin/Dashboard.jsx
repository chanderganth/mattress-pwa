import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/apiClient.js';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics')
      .then(r => {
        setData(r.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Analytics error:', err);
        setError(err.response?.data?.error || err.message);
        setLoading(false);
        // Set default data for demo
        setData({
          productCount: 5,
          orderCounts: [
            { _id: 'PENDING', count: 3 },
            { _id: 'CONFIRMED', count: 2 },
            { _id: 'DELIVERED', count: 10 }
          ],
          lowInventory: [
            { _id: '1', name: 'Memory Foam', quantity: 15 },
            { _id: '2', name: 'Latex', quantity: 8 }
          ]
        });
      });
  }, []);

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-brand text-white p-4 shadow">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <nav className="space-x-4">
            <Link to="/admin/products" className="hover:underline">Products</Link>
            <Link to="/admin/layers" className="hover:underline">Layers</Link>
            <Link to="/admin/orders" className="hover:underline">Orders</Link>
            <Link to="/admin/inventory" className="hover:underline">Inventory</Link>
            <Link to="/admin/vip" className="hover:underline">VIP</Link>
            <Link to="/" className="hover:underline">Home</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {error && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
            Note: Running in demo mode with sample data
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="text-gray-500 text-sm font-medium">Total Products</div>
            <div className="text-3xl font-bold text-brand">{data?.productCount || 0}</div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="text-gray-500 text-sm font-medium">Total Orders</div>
            <div className="text-3xl font-bold text-brand">
              {data?.orderCounts?.reduce((sum, o) => sum + o.count, 0) || 0}
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="text-gray-500 text-sm font-medium">Low Stock Items</div>
            <div className="text-3xl font-bold text-red-600">{data?.lowInventory?.length || 0}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-4">Orders by Status</h3>
            <div className="space-y-2">
              {data?.orderCounts?.map(o => (
                <div key={o._id} className="flex justify-between items-center py-2 border-b">
                  <span className="capitalize">{o._id?.toLowerCase() || 'Unknown'}</span>
                  <span className="font-semibold bg-gray-100 px-3 py-1 rounded">{o.count}</span>
                </div>
              ))}
              {(!data?.orderCounts || data.orderCounts.length === 0) && (
                <p className="text-gray-500">No orders yet</p>
              )}
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-4">Low Inventory Alert</h3>
            <div className="space-y-2">
              {data?.lowInventory?.map(i => (
                <div key={i._id} className="flex justify-between items-center py-2 border-b">
                  <span>{i.name || i.materialType}</span>
                  <span className="font-semibold text-red-600 bg-red-50 px-3 py-1 rounded">{i.quantity} units</span>
                </div>
              ))}
              {(!data?.lowInventory || data.lowInventory.length === 0) && (
                <p className="text-green-600">All items well stocked!</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/products" className="p-4 bg-white rounded-lg shadow text-center hover:shadow-lg transition">
            <div className="text-2xl mb-2"></div>
            <div className="font-medium">Manage Products</div>
          </Link>
          <Link to="/admin/layers" className="p-4 bg-white rounded-lg shadow text-center hover:shadow-lg transition">
            <div className="text-2xl mb-2"></div>
            <div className="font-medium">Manage Layers</div>
          </Link>
          <Link to="/admin/orders" className="p-4 bg-white rounded-lg shadow text-center hover:shadow-lg transition">
            <div className="text-2xl mb-2"></div>
            <div className="font-medium">View Orders</div>
          </Link>
          <Link to="/admin/inventory" className="p-4 bg-white rounded-lg shadow text-center hover:shadow-lg transition">
            <div className="text-2xl mb-2"></div>
            <div className="font-medium">Inventory</div>
          </Link>
        </div>
      </main>
    </div>
  );
}
