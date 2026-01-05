import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/apiClient.js';

export default function InventoryManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', materialType: 'Foam', quantity: 0, unit: 'sheets', lowStockThreshold: 20 });

  async function load() {
    try {
      const r = await api.get('/inventory');
      setItems(r.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function create() {
    await api.post('/inventory', form);
    setForm({ name: '', materialType: 'Foam', quantity: 0, unit: 'sheets', lowStockThreshold: 20 });
    setShowForm(false);
    await load();
  }

  async function updateQuantity(id, quantity) {
    await api.put('/inventory/' + id, { quantity });
    await load();
  }

  async function remove(id) {
    if (confirm('Delete this inventory item?')) {
      await api.delete('/inventory/' + id);
      await load();
    }
  }

  const lowStock = items.filter(i => i.quantity <= i.lowStockThreshold);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 -m-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <nav className="text-sm text-indigo-200 mb-1">
                <Link to="/admin/dashboard" className="hover:text-white">Dashboard</Link>
                <span className="mx-2">/</span>Inventory
              </nav>
              <h1 className="text-2xl font-bold">Inventory Management</h1>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition">
              {showForm ? 'Cancel' : '+ Add Item'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="text-sm text-gray-500">Total Items</div>
            <div className="text-3xl font-bold text-gray-900">{items.length}</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="text-sm text-gray-500">Total Stock</div>
            <div className="text-3xl font-bold text-indigo-600">{totalItems.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="text-sm text-gray-500">Low Stock Alerts</div>
            <div className="text-3xl font-bold text-red-600">{lowStock.length}</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="text-sm text-gray-500">Material Types</div>
            <div className="text-3xl font-bold text-gray-900">{[...new Set(items.map(i => i.materialType))].length}</div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStock.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl"></span>
              <h3 className="font-bold text-red-800">Low Stock Alert</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {lowStock.map(i => (
                <span key={i._id} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  {i.name}: {i.quantity} {i.unit}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Add Item Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Add Inventory Item</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Memory Foam Sheet" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Material Type</label>
                <select value={form.materialType} onChange={e => setForm({...form, materialType: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                  <option value="Foam">Foam</option>
                  <option value="Latex">Latex</option>
                  <option value="Natural">Natural</option>
                  <option value="Fabric">Fabric</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: Number(e.target.value)})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                  <option value="sheets">Sheets</option>
                  <option value="rolls">Rolls</option>
                  <option value="blocks">Blocks</option>
                  <option value="meters">Meters</option>
                  <option value="kg">Kilograms</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={create} className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition">Add Item</button>
              <button onClick={() => setShowForm(false)} className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition">Cancel</button>
            </div>
          </div>
        )}

        {/* Inventory Table */}
        {loading ? (
          <div className="bg-white rounded-2xl h-96 animate-pulse"></div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No inventory items</h3>
            <p className="text-gray-500 mb-4">Add items to track your inventory</p>
            <button onClick={() => setShowForm(true)} className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700">+ Add Item</button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map(item => {
                  const isLow = item.quantity <= item.lowStockThreshold;
                  return (
                    <tr key={item._id} className={'hover:bg-gray-50 transition ' + (isLow ? 'bg-red-50' : '')}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">Threshold: {item.lowStockThreshold} {item.unit}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">{item.materialType}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => updateQuantity(item._id, Math.max(0, item.quantity - 10))} className="w-8 h-8 bg-gray-100 rounded-lg hover:bg-gray-200 transition">-</button>
                          <span className={'text-lg font-bold ' + (isLow ? 'text-red-600' : 'text-gray-900')}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 10)} className="w-8 h-8 bg-gray-100 rounded-lg hover:bg-gray-200 transition">+</button>
                          <span className="text-sm text-gray-500">{item.unit}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isLow ? (
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">LOW STOCK</span>
                        ) : (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">IN STOCK</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => remove(item._id)} className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
