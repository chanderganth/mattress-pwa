import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import api from '../../config/apiClient.js';
import PaymentQR from '../../components/PaymentQR';

function calcTotal(layers, length, width) {
  const lengthCm = (Number(length) || 0) * 2.54;
  const widthCm = (Number(width) || 0) * 2.54;
  return (layers || []).reduce((sum, l) => {
    const thicknessCm = (Number(l.thicknessInch) || 0) * 2.54;
    return sum + lengthCm * widthCm * thicknessCm * (Number(l.ratePerCubicCm) || 0);
  }, 0);
}

export default function RetailerBuilder() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Redirect to login if not authenticated
  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/retailer/login" replace />;
  }

  const [length, setLength] = useState(75);
  const [width, setWidth] = useState(36);
  const [layers, setLayers] = useState([]);
  const [availableLayers, setAvailableLayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [success, setSuccess] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });
  const [orderId, setOrderId] = useState('');

  const total = useMemo(() => calcTotal(layers, length, width), [layers, length, width]);
  const totalThickness = useMemo(() => layers.reduce((sum, l) => sum + (l.thicknessInch || 0), 0), [layers]);

  useEffect(() => {
    api.get('/layers').then(r => {
      setAvailableLayers(r.data || []);
      const defaults = (r.data || []).slice(0, 2).map((lay, i) => ({
        layerId: lay._id,
        layerName: lay.name,
        materialType: lay.materialType,
        density: lay.density,
        thicknessInch: 2,
        ratePerCubicCm: lay.retailerRatePerCubicCm || lay.ratePerCubicCm,
        orderSequence: i
      }));
      setLayers(defaults);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  function addLayer() {
    if (availableLayers.length === 0) return;
    const lay = availableLayers[0];
    setLayers([...layers, {
      layerId: lay._id,
      layerName: lay.name,
      materialType: lay.materialType,
      density: lay.density,
      thicknessInch: 1,
      ratePerCubicCm: lay.retailerRatePerCubicCm || lay.ratePerCubicCm,
      orderSequence: layers.length
    }]);
  }

  function updateLayer(index, field, value) {
    const updated = [...layers];
    if (field === 'layerId') {
      const lay = availableLayers.find(l => l._id === value);
      if (lay) {
        updated[index] = { ...updated[index], layerId: lay._id, layerName: lay.name, materialType: lay.materialType, density: lay.density, ratePerCubicCm: lay.retailerRatePerCubicCm || lay.ratePerCubicCm };
      }
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setLayers(updated);
  }

  function removeLayer(index) {
    setLayers(layers.filter((_, i) => i !== index));
  }

  function proceedToPayment() {
    if (!customerInfo.name || !customerInfo.phone) {
      alert('Please enter customer name and phone number');
      return;
    }
    if (layers.length === 0) {
      alert('Please add at least one layer');
      return;
    }
    setOrderId(`VB-R-${Date.now()}`);
    setShowPayment(true);
  }

  async function confirmPaymentAndPlaceOrder() {
    setPlacing(true);
    try {
      const lengthCm = Math.round(length * 2.54);
      const widthCm = Math.round(width * 2.54);
      const layersForBackend = layers.map(l => ({
        ...l,
        thicknessCm: Math.round(l.thicknessInch * 2.54)
      }));

      await api.post('/orders/custom', {
        lengthCm, widthCm, layers: layersForBackend,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        isRetailerOrder: true,
        paymentStatus: 'paid'
      });
      setSuccess(true);
      setShowPayment(false);
    } catch (e) {
      alert('Error placing order. Please try again.');
    }
    setPlacing(false);
  }

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen -m-4 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-lg w-full">
          <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-2">Payment received and order confirmed.</p>
          <p className="text-sm text-gray-500 mb-6">Order ID: {orderId}</p>
          <div className="space-y-3">
            <Link to="/retailer/orders" className="block w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700">
              View Orders
            </Link>
            <Link to="/retailer/dashboard" className="block w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Payment screen
  if (showPayment) {
    return (
      <div className="min-h-screen -m-4 bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h2>
            <p className="text-gray-600">Scan the QR code to pay Rs.{total.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
            <p className="text-sm text-orange-600 mt-1">Retailer Price Applied</p>
          </div>
          
          <PaymentQR amount={total} orderId={orderId} hideConfirmButton={true} />
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <p className="text-sm text-yellow-800 text-center">
              <strong>Important:</strong> After completing payment, click the button below to confirm the order.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={confirmPaymentAndPlaceOrder}
              disabled={placing}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              {placing ? 'Placing Order...' : 'I Have Paid - Confirm Order'}
            </button>
            <button
              onClick={() => setShowPayment(false)}
              className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen -m-4 bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-orange-100 mb-4">
            <Link to="/retailer/dashboard" className="hover:text-white">Dashboard</Link> <span className="mx-2">/</span> Custom Builder
          </nav>
          <h1 className="text-4xl font-bold mb-2">Retailer Custom Builder</h1>
          <p className="text-orange-100">Build custom mattresses at wholesale prices</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Builder Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dimensions */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mr-3 text-sm font-bold">1</span>
                Set Dimensions
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Length (inches)</label>
                  <input type="number" value={length} onChange={e => setLength(Number(e.target.value))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Width (inches)</label>
                  <input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg" />
                </div>
              </div>
              <div className="mt-4 flex gap-4 flex-wrap">
                {[{l:75,w:36,n:'Single (75x36)'},{l:75,w:48,n:'Double (75x48)'},{l:78,w:60,n:'Queen (78x60)'},{l:78,w:72,n:'King (78x72)'}].map(s => (
                  <button key={s.n} onClick={() => {setLength(s.l);setWidth(s.w);}} className={'px-4 py-2 rounded-lg text-sm font-medium transition-all ' + (length===s.l && width===s.w ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                    {s.n}
                  </button>
                ))}
              </div>
            </div>

            {/* Layers */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mr-3 text-sm font-bold">2</span>
                  Configure Layers
                </h3>
                <button onClick={addLayer} className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                  + Add Layer
                </button>
              </div>

              {loading ? (
                <div className="space-y-4">{[1,2].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>)}</div>
              ) : layers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p>No layers added yet. Click "Add Layer" to start building.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {layers.map((layer, idx) => {
                    const thicknessCm = layer.thicknessInch * 2.54;
                    const layerCost = length * 2.54 * width * 2.54 * thicknessCm * layer.ratePerCubicCm;
                    return (
                      <div key={idx} className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-bold text-gray-500">Layer {idx + 1}</span>
                          <button onClick={() => removeLayer(idx)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Material</label>
                            <select value={layer.layerId} onChange={e => updateLayer(idx, 'layerId', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500">
                              {availableLayers.map(al => <option key={al._id} value={al._id}>{al.name}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Thickness (inches)</label>
                            <input type="number" value={layer.thicknessInch} onChange={e => updateLayer(idx, 'thicknessInch', Number(e.target.value))} min="0.5" max="8" step="0.5" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500" />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Layer Cost</label>
                            <div className="px-3 py-2 bg-white rounded-lg text-sm font-semibold text-green-600">
                              Rs.{layerCost.toLocaleString(undefined, {maximumFractionDigits: 0})}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-400">
                          {layer.materialType} | Density: {layer.density} kg/m3 | Retailer Rate: Rs.{layer.ratePerCubicCm}/cm3
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mr-3 text-sm font-bold">3</span>
                Customer Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                  <input type="text" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500" placeholder="Enter customer name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input type="tel" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500" placeholder="Enter phone number" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                  <textarea value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500" rows="2" placeholder="Enter delivery address"></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>
                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-semibold">Retailer Price</span>
              </div>

              {/* Visual Preview */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-orange-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  <div className="text-sm text-gray-600">{length}" x {width}"</div>
                  <div className="text-xs text-gray-400">{totalThickness}" thick | {layers.length} layers</div>
                </div>
                <div className="mt-4 space-y-1">
                  {layers.map((l, i) => (
                    <div key={i} className="h-4 rounded bg-gradient-to-r from-orange-400 to-amber-400 relative" style={{opacity: 0.5 + (i * 0.15)}}>
                      <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">{l.layerName}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Dimensions</span>
                  <span className="font-medium">{length}" x {width}"</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Thickness</span>
                  <span className="font-medium">{totalThickness}"</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Layers</span>
                  <span className="font-medium">{layers.length}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Subtotal (Retailer)</span>
                    <span>Rs.{total.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Delivery</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-orange-600">Rs.{total.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={proceedToPayment}
                disabled={layers.length === 0}
                className="w-full py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Payment
              </button>

              <p className="text-xs text-gray-400 text-center mt-4">
                Retailer wholesale pricing applied
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

