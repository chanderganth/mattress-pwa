import { useState } from 'react';

export default function LayerEditor({ layers, onChange }) {
  const [localLayers, setLocalLayers] = useState(layers || []);

  function update(index, patch) {
    const next = localLayers.map((l, i) => i === index ? { ...l, ...patch } : l);
    setLocalLayers(next);
    onChange(next);
  }

  function addLayer() {
    const newLayer = { layerId: null, layerName: 'New Layer', materialType: 'Foam', density: 40, thicknessInch: 2, ratePerCubicCm: 0.02, orderSequence: localLayers.length };
    const next = [...localLayers, newLayer];
    setLocalLayers(next);
    onChange(next);
  }

  function removeLayer(index) {
    const next = localLayers.filter((_, i) => i !== index).map((l, i) => ({ ...l, orderSequence: i }));
    setLocalLayers(next);
    onChange(next);
  }

  function reorder(from, to) {
    const next = [...localLayers];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    const withSeq = next.map((l, i) => ({ ...l, orderSequence: i }));
    setLocalLayers(withSeq);
    onChange(withSeq);
  }

  return (
    <div className="space-y-4">
      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition" onClick={addLayer}>+ Add Layer</button>
      {localLayers.map((layer, idx) => (
        <div key={idx} className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Layer Name</label>
              <input className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500" value={layer.layerName} onChange={(e) => update(idx, { layerName: e.target.value })} placeholder="Layer name" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Material Type</label>
              <input className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500" value={layer.materialType} onChange={(e) => update(idx, { materialType: e.target.value })} placeholder="Material type" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Density (kg/m3)</label>
              <input className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500" type="number" value={layer.density} onChange={(e) => update(idx, { density: Number(e.target.value) })} placeholder="Density" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Thickness (inches)</label>
              <input className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500" type="number" value={layer.thicknessInch} onChange={(e) => update(idx, { thicknessInch: Number(e.target.value) })} placeholder="Thickness (inches)" step="0.5" min="0.5" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Rate per cm3 (Rs.)</label>
              <input className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500" type="number" value={layer.ratePerCubicCm} onChange={(e) => update(idx, { ratePerCubicCm: Number(e.target.value) })} placeholder="Rate per cubic cm" step="0.001" />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm" onClick={() => reorder(idx, Math.max(0, idx - 1))} disabled={idx === 0}>Move Up</button>
            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm" onClick={() => reorder(idx, Math.min(localLayers.length - 1, idx + 1))} disabled={idx === localLayers.length - 1}>Move Down</button>
            <button className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm" onClick={() => removeLayer(idx)}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
}
