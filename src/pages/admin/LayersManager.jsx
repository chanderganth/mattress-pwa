import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/apiClient.js';

// Conversion: 1 cubic inch = 16.387 cubic cm
const CM3_TO_IN3 = 16.387;

function cmToInchRate(cmRate) {
  return (cmRate * CM3_TO_IN3).toFixed(2);
}

function inchToCmRate(inchRate) {
  return inchRate / CM3_TO_IN3;
}

export default function LayersManager() {
  const [layers, setLayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLayer, setEditingLayer] = useState(null);
  // Form uses inches for display
  const [form, setForm] = useState({ name: '', materialType: 'Foam', density: 50, ratePerCubicInch: 0.33, retailerRatePerCubicInch: 0.28, enabled: true });

  async function load() {
    try {
      const r = await api.get('/layers');
      setLayers(r.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function create() {
    // Convert inch rate to cm rate for backend
    const payload = {
      name: form.name,
      materialType: form.materialType,
      density: form.density,
      ratePerCubicCm: inchToCmRate(form.ratePerCubicInch),
      retailerRatePerCubicCm: inchToCmRate(form.retailerRatePerCubicInch),
      enabled: form.enabled
    };
    await api.post('/layers', payload);
    resetForm();
    await load();
  }

  async function saveEdit() {
    if (!editingLayer) return;
    const payload = {
      name: form.name,
      materialType: form.materialType,
      density: form.density,
      ratePerCubicCm: inchToCmRate(form.ratePerCubicInch),
      retailerRatePerCubicCm: inchToCmRate(form.retailerRatePerCubicInch),
      enabled: form.enabled
    };
    await api.put('/layers/' + editingLayer._id, payload);
    resetForm();
    await load();
  }

  function resetForm() {
    setForm({ name: '', materialType: 'Foam', density: 50, ratePerCubicInch: 0.33, retailerRatePerCubicInch: 0.28, enabled: true });
    setShowForm(false);
    setEditingLayer(null);
  }

  function startEdit(layer) {
    setEditingLayer(layer);
    setForm({
      name: layer.name,
      materialType: layer.materialType,
      density: layer.density,
      ratePerCubicInch: Number(cmToInchRate(layer.ratePerCubicCm)),
      retailerRatePerCubicInch: Number(cmToInchRate(layer.retailerRatePerCubicCm || layer.ratePerCubicCm * 0.85)),
      enabled: layer.enabled
    });
    setShowForm(true);
  }

  async function update(id, patch) { await api.put('/layers/' + id, patch); await load(); }
  async function remove(id) { if (confirm('Delete this layer?')) { await api.delete('/layers/' + id); await load(); } }

  const materialColors = {
    Foam: 'from-blue-400 to-blue-600',
    Latex: 'from-green-400 to-green-600',
    Natural: 'from-amber-400 to-amber-600',
    Other: 'from-gray-400 to-gray-600'
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
                <span className="mx-2">/</span>Layers
              </nav>
              <h1 className="text-2xl font-bold">Layer Management</h1>
            </div>
            <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition">
              {showForm ? 'Cancel' : '+ Add Layer'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Add/Edit Layer Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              {editingLayer ? 'Edit Layer Material' : 'Add New Layer Material'}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Layer Name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Memory Foam Premium" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Material Type</label>
                <select value={form.materialType} onChange={e => setForm({...form, materialType: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                  <option value="Foam">Foam</option>
                  <option value="Latex">Latex</option>
                  <option value="Natural">Natural (Coir/Cotton)</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Density (kg/m)</label>
                <input type="number" value={form.density} onChange={e => setForm({...form, density: Number(e.target.value)})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Rate per cubic inch (?)</label>
                <input type="number" step="0.01" value={form.ratePerCubicInch} onChange={e => setForm({...form, ratePerCubicInch: Number(e.target.value)})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                <p className="text-xs text-gray-400 mt-1">Rate charged to customers per cubic inch</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Retailer Rate per cubic inch (?)</label>
                <input type="number" step="0.01" value={form.retailerRatePerCubicInch} onChange={e => setForm({...form, retailerRatePerCubicInch: Number(e.target.value)})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                <p className="text-xs text-gray-400 mt-1">Wholesale rate for retailers per cubic inch</p>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.enabled} onChange={e => setForm({...form, enabled: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-sm font-medium text-gray-700">Layer Enabled</span>
                </label>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              {editingLayer ? (
                <button onClick={saveEdit} className="px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition">Save Changes</button>
              ) : (
                <button onClick={create} className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition">Create Layer</button>
              )}
              <button onClick={resetForm} className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition">Cancel</button>
            </div>
          </div>
        )}

        {/* Layers Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-48 animate-pulse"></div>)}
          </div>
        ) : layers.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No layers yet</h3>
            <p className="text-gray-500 mb-4">Add layer materials for custom mattress building</p>
            <button onClick={() => setShowForm(true)} className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700">+ Add Layer</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {layers.map(layer => (
              <div key={layer._id} className={'bg-white rounded-2xl shadow-sm border overflow-hidden transition-all hover:shadow-lg ' + (layer.enabled ? 'border-gray-100' : 'border-red-200 opacity-75')}>
                <div className={'h-24 bg-gradient-to-r ' + (materialColors[layer.materialType] || materialColors.Other) + ' flex items-center justify-center'}>
                  <span className="text-4xl"></span>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{layer.name}</h3>
                      <span className="text-sm text-gray-500">{layer.materialType}</span>
                    </div>
                    {!layer.enabled && <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700">Disabled</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-400">Density</div>
                      <div className="font-semibold">{layer.density} kg/m</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Customer Rate</div>
                      <div className="font-semibold text-indigo-600">?{cmToInchRate(layer.ratePerCubicCm)}/in</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-gray-400">Retailer Rate</div>
                      <div className="font-semibold text-green-600">?{cmToInchRate(layer.retailerRatePerCubicCm || layer.ratePerCubicCm * 0.85)}/in</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(layer)} className="flex-1 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition">
                      Edit
                    </button>
                    <button onClick={() => update(layer._id, { enabled: !layer.enabled })} className={'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ' + (layer.enabled ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200')}>
                      {layer.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button onClick={() => remove(layer._id)} className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
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
