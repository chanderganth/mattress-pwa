import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/apiClient.js';

// Helper to convert cm to inches
function cmToInch(cm) {
  return (cm / 2.54).toFixed(1);
}

// Helper to convert inches to cm
function inchToCm(inch) {
  return Math.round(inch * 2.54);
}

// Default variant templates
const DEFAULT_VARIANTS = [
  { density: 28, variantName: 'Standard Comfort', comfortLevel: 'Basic', materialType: '28 Density Foam', price: 0, retailerPrice: 0, colorImages: [], description: 'Basic comfort at an economical rate' },
  { density: 32, variantName: 'Premium Comfort – Epic Series', comfortLevel: 'Balanced', materialType: '32 Density Foam', price: 0, retailerPrice: 0, colorImages: [], description: 'Balanced support and durability' },
  { density: 40, variantName: 'High Support Comfort', comfortLevel: 'Firm', materialType: '40 Density Foam', price: 0, retailerPrice: 0, colorImages: [], description: 'Firm support for long-term use' },
  { density: null, variantName: 'Luxury Top-Level', comfortLevel: 'Premium', materialType: 'Premium Materials', price: 0, retailerPrice: 0, colorImages: [], description: 'Superior comfort, elegant design, rich colour finishes' }
];

export default function ProductsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: 'STANDARD',
    name: '',
    description: '',
    price: 0,
    retailerPrice: 0,
    lengthInch: 75,
    widthInch: 36,
    thicknessInch: 6,
    enabled: true,
    colorImages: [],
    hasVariants: false,
    variants: JSON.parse(JSON.stringify(DEFAULT_VARIANTS))
  });
  const [uploading, setUploading] = useState(false);
  const [expandedVariant, setExpandedVariant] = useState(null);
  const fileInputRef = useRef({});
  const variantFileInputRefs = useRef({});

  async function load() {
    try {
      const r = await api.get('/products');
      setItems(r.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleColorImageUpload(e, colorIndex) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const response = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const uploadedUrls = response.data.files.map(f => f.url);
      setForm(prev => {
        const newColorImages = [...prev.colorImages];
        newColorImages[colorIndex] = {
          ...newColorImages[colorIndex],
          images: [...(newColorImages[colorIndex].images || []), ...uploadedUrls]
        };
        return { ...prev, colorImages: newColorImages };
      });
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload images: ' + (err.response?.data?.error || err.message));
    }
    setUploading(false);
    e.target.value = '';
  }

  async function handleVariantColorImageUpload(e, variantIndex, colorIndex) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const response = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const uploadedUrls = response.data.files.map(f => f.url);
      setForm(prev => {
        const newVariants = [...prev.variants];
        const newColorImages = [...(newVariants[variantIndex].colorImages || [])];
        newColorImages[colorIndex] = {
          ...newColorImages[colorIndex],
          images: [...(newColorImages[colorIndex].images || []), ...uploadedUrls]
        };
        newVariants[variantIndex] = { ...newVariants[variantIndex], colorImages: newColorImages };
        return { ...prev, variants: newVariants };
      });
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload images: ' + (err.response?.data?.error || err.message));
    }
    setUploading(false);
    e.target.value = '';
  }

  function addColor() {
    setForm(prev => ({
      ...prev,
      colorImages: [...prev.colorImages, { colorName: '', colorCode: '#3B82F6', images: [] }]
    }));
  }

  function removeColor(index) {
    setForm(prev => ({
      ...prev,
      colorImages: prev.colorImages.filter((_, i) => i !== index)
    }));
  }

  function updateColor(index, field, value) {
    setForm(prev => {
      const newColorImages = [...prev.colorImages];
      newColorImages[index] = { ...newColorImages[index], [field]: value };
      return { ...prev, colorImages: newColorImages };
    });
  }

  function removeColorImage(colorIndex, imageIndex) {
    setForm(prev => {
      const newColorImages = [...prev.colorImages];
      newColorImages[colorIndex] = {
        ...newColorImages[colorIndex],
        images: newColorImages[colorIndex].images.filter((_, i) => i !== imageIndex)
      };
      return { ...prev, colorImages: newColorImages };
    });
  }

  function addVariantColor(variantIndex) {
    setForm(prev => {
      const newVariants = [...prev.variants];
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        colorImages: [...(newVariants[variantIndex].colorImages || []), { colorName: '', colorCode: '#3B82F6', images: [] }]
      };
      return { ...prev, variants: newVariants };
    });
  }

  function removeVariantColor(variantIndex, colorIndex) {
    setForm(prev => {
      const newVariants = [...prev.variants];
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        colorImages: newVariants[variantIndex].colorImages.filter((_, i) => i !== colorIndex)
      };
      return { ...prev, variants: newVariants };
    });
  }

  function updateVariantColor(variantIndex, colorIndex, field, value) {
    setForm(prev => {
      const newVariants = [...prev.variants];
      const newColorImages = [...(newVariants[variantIndex].colorImages || [])];
      newColorImages[colorIndex] = { ...newColorImages[colorIndex], [field]: value };
      newVariants[variantIndex] = { ...newVariants[variantIndex], colorImages: newColorImages };
      return { ...prev, variants: newVariants };
    });
  }

  function removeVariantColorImage(variantIndex, colorIndex, imageIndex) {
    setForm(prev => {
      const newVariants = [...prev.variants];
      const newColorImages = [...(newVariants[variantIndex].colorImages || [])];
      newColorImages[colorIndex] = {
        ...newColorImages[colorIndex],
        images: newColorImages[colorIndex].images.filter((_, i) => i !== imageIndex)
      };
      newVariants[variantIndex] = { ...newVariants[variantIndex], colorImages: newColorImages };
      return { ...prev, variants: newVariants };
    });
  }

  function updateVariant(index, field, value) {
    setForm(prev => {
      const newVariants = [...prev.variants];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return { ...prev, variants: newVariants };
    });
  }

  function resetForm() {
    setForm({
      type: 'STANDARD',
      name: '',
      description: '',
      price: 0,
      retailerPrice: 0,
      lengthInch: 75,
      widthInch: 36,
      thicknessInch: 6,
      enabled: true,
      colorImages: [],
      hasVariants: false,
      variants: JSON.parse(JSON.stringify(DEFAULT_VARIANTS))
    });
    setExpandedVariant(null);
  }

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function create() {
    if (!form.name.trim()) {
      setError('Product name is required');
      return;
    }
    
    setSaving(true);
    setError('');
    
    try {
      const firstImage = form.colorImages.length > 0 && form.colorImages[0].images?.length > 0
        ? form.colorImages[0].images[0]
        : null;

      await api.post('/products', {
        type: form.type,
        name: form.name,
        description: form.description,
        price: form.price,
        retailerPrice: form.retailerPrice,
        colorImages: form.colorImages.filter(c => c.colorName.trim()),
        images: firstImage ? [firstImage] : [],
        variants: form.hasVariants ? form.variants.map(v => ({
          ...v,
          colorImages: (v.colorImages || []).filter(c => c.colorName.trim())
        })) : [],
        size: {
          lengthCm: inchToCm(form.lengthInch),
          widthCm: inchToCm(form.widthInch),
          thicknessCm: inchToCm(form.thicknessInch)
        }
      });

      resetForm();
      setShowForm(false);
      await load();
    } catch (err) {
      console.error('Create product failed:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again as Admin.');
      } else {
        setError(err.response?.data?.error || err.message || 'Failed to create product');
      }
    } finally {
      setSaving(false);
    }
  }

  async function update(id, patch) { await api.put('/products/' + id, patch); await load(); }
  async function remove(id) { if (confirm('Delete this product?')) { await api.delete('/products/' + id); await load(); } }

  const getLowestPrice = (product) => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map(v => v.price).filter(p => p > 0);
      return prices.length > 0 ? Math.min(...prices) : product.price;
    }
    return product.price;
  };

  const getHighestPrice = (product) => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map(v => v.price).filter(p => p > 0);
      return prices.length > 0 ? Math.max(...prices) : product.price;
    }
    return product.price;
  };

  const getProductImage = (product) => {
    if (product.colorImages && product.colorImages.length > 0) {
      const firstColor = product.colorImages.find(c => c.images && c.images.length > 0);
      if (firstColor) return firstColor.images[0];
    }
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return null;
  };

  const getAllColors = (product) => {
    const colors = [];
    if (product.colorImages && product.colorImages.length > 0) {
      product.colorImages.forEach(c => {
        if (c.colorName) colors.push({ name: c.colorName, code: c.colorCode, imageCount: c.images?.length || 0 });
      });
    }
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach(v => {
        if (v.colorImages && v.colorImages.length > 0) {
          v.colorImages.forEach(c => {
            if (c.colorName && !colors.find(x => x.name === c.colorName)) {
              colors.push({ name: c.colorName, code: c.colorCode, imageCount: c.images?.length || 0 });
            }
          });
        }
      });
    }
    return colors;
  };

  return (
    <div className="min-h-screen bg-gray-50 -m-4">
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <nav className="text-sm text-indigo-200 mb-1">
                <Link to="/admin/dashboard" className="hover:text-white">Dashboard</Link>
                <span className="mx-2">/</span>Products
              </nav>
              <h1 className="text-2xl font-bold">Product Management</h1>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition">
                {showForm ? 'Cancel' : '+ Add Product'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Add New Product</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                  <option value="STANDARD">Standard Mattress</option>
                  <option value="CUSTOM">Custom Builder</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="e.g., CloudSleep Queen" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" rows="2" placeholder="Describe the product..." />
              </div>

              <div className="md:col-span-3">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">Product Colors & Images</label>
                  <button type="button" onClick={addColor} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition">
                    + Add Color
                  </button>
                </div>

                {form.colorImages.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                    <div className="text-gray-400 mb-2">No colors added yet</div>
                    <button type="button" onClick={addColor} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                      Add First Color
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {form.colorImages.map((color, colorIndex) => (
                      <div key={colorIndex} className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 flex items-center gap-4">
                          <input
                            type="color"
                            value={color.colorCode || '#3B82F6'}
                            onChange={e => updateColor(colorIndex, 'colorCode', e.target.value)}
                            className="w-10 h-10 rounded cursor-pointer border-0"
                          />
                          <input
                            value={color.colorName}
                            onChange={e => updateColor(colorIndex, 'colorName', e.target.value)}
                            placeholder="Color name (e.g., Royal Blue)"
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                          />
                          <button type="button" onClick={() => removeColor(colorIndex)} className="px-3 py-2 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 transition">
                            Remove
                          </button>
                        </div>
                        <div className="p-4">
                          <input
                            type="file"
                            ref={el => { fileInputRef.current[colorIndex] = el; }}
                            onChange={e => handleColorImageUpload(e, colorIndex)}
                            accept="image/*"
                            multiple
                            className="hidden"
                          />

                          {color.images && color.images.length > 0 && (
                            <div className="flex flex-wrap gap-3 mb-3">
                              {color.images.map((img, imgIndex) => (
                                <div key={imgIndex} className="relative group">
                                  <img
                                    src={img.startsWith('/') ? 'http://localhost:5000' + img : img}
                                    alt={`${color.colorName} ${imgIndex + 1}`}
                                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeColorImage(colorIndex, imgIndex)}
                                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.[colorIndex]?.click()}
                            disabled={uploading}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition disabled:opacity-50"
                          >
                            {uploading ? 'Uploading...' : `+ Add Images for ${color.colorName || 'this color'}`}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:col-span-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.hasVariants}
                    onChange={e => setForm({...form, hasVariants: e.target.checked})}
                    className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable Density Variants (28, 32, 40, Luxury)</span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-8">Same dimensions with different foam density, comfort level, and pricing</p>
              </div>

              {form.hasVariants && (
                <div className="md:col-span-3 space-y-4">
                  <h4 className="font-semibold text-gray-800 border-b pb-2">Density Variants</h4>
                  {form.variants.map((variant, variantIndex) => (
                    <div key={variantIndex} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setExpandedVariant(expandedVariant === variantIndex ? null : variantIndex)}
                        className="w-full px-4 py-3 bg-gray-50 flex justify-between items-center hover:bg-gray-100 transition"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            variant.density === 28 ? 'bg-green-100 text-green-700' :
                            variant.density === 32 ? 'bg-blue-100 text-blue-700' :
                            variant.density === 40 ? 'bg-purple-100 text-purple-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {variant.density ? `${variant.density}D` : 'LUX'}
                          </span>
                          <span className="font-medium">{variant.variantName}</span>
                          {variant.price > 0 && <span className="text-sm text-gray-500">Rs.{variant.price.toLocaleString()}</span>}
                          {variant.colorImages?.length > 0 && (
                            <span className="text-xs text-gray-400">({variant.colorImages.length} colors)</span>
                          )}
                        </div>
                        <svg className={`w-5 h-5 transition-transform ${expandedVariant === variantIndex ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {expandedVariant === variantIndex && (
                        <div className="p-4 bg-white space-y-4">
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Variant Name</label>
                              <input value={variant.variantName} onChange={e => updateVariant(variantIndex, 'variantName', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Comfort Level</label>
                              <select value={variant.comfortLevel} onChange={e => updateVariant(variantIndex, 'comfortLevel', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
                                <option value="Basic">Basic</option>
                                <option value="Balanced">Balanced</option>
                                <option value="Firm">Firm</option>
                                <option value="Premium">Premium</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Material Type</label>
                              <input value={variant.materialType} onChange={e => updateVariant(variantIndex, 'materialType', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Price (Rs.)</label>
                              <input type="number" value={variant.price} onChange={e => updateVariant(variantIndex, 'price', Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Retailer Price (Rs.)</label>
                              <input type="number" value={variant.retailerPrice} onChange={e => updateVariant(variantIndex, 'retailerPrice', Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                              <input value={variant.description} onChange={e => updateVariant(variantIndex, 'description', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                            </div>
                          </div>

                          <div className="border-t pt-4 mt-4">
                            <div className="flex justify-between items-center mb-3">
                              <label className="text-sm font-medium text-gray-700">Colors for this variant</label>
                              <button type="button" onClick={() => addVariantColor(variantIndex)} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-200 transition">
                                + Add Color
                              </button>
                            </div>

                            {(!variant.colorImages || variant.colorImages.length === 0) ? (
                              <div className="text-center text-gray-400 text-sm py-4">No colors added for this variant</div>
                            ) : (
                              <div className="space-y-3">
                                {variant.colorImages.map((color, colorIndex) => (
                                  <div key={colorIndex} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                                    <div className="flex items-center gap-3 mb-2">
                                      <input type="color" value={color.colorCode || '#3B82F6'} onChange={e => updateVariantColor(variantIndex, colorIndex, 'colorCode', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                                      <input value={color.colorName} onChange={e => updateVariantColor(variantIndex, colorIndex, 'colorName', e.target.value)} placeholder="Color name" className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm" />
                                      <button type="button" onClick={() => removeVariantColor(variantIndex, colorIndex)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                                    </div>

                                    <input
                                      type="file"
                                      ref={el => { if (!variantFileInputRefs.current[variantIndex]) variantFileInputRefs.current[variantIndex] = {}; variantFileInputRefs.current[variantIndex][colorIndex] = el; }}
                                      onChange={e => handleVariantColorImageUpload(e, variantIndex, colorIndex)}
                                      accept="image/*"
                                      multiple
                                      className="hidden"
                                    />

                                    {color.images && color.images.length > 0 && (
                                      <div className="flex flex-wrap gap-2 mb-2">
                                        {color.images.map((img, imgIndex) => (
                                          <div key={imgIndex} className="relative group">
                                            <img src={img.startsWith('/') ? 'http://localhost:5000' + img : img} alt={`${color.colorName} ${imgIndex + 1}`} className="w-16 h-16 object-cover rounded border" />
                                            <button type="button" onClick={() => removeVariantColorImage(variantIndex, colorIndex, imgIndex)} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100">×</button>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    <button type="button" onClick={() => variantFileInputRefs.current?.[variantIndex]?.[colorIndex]?.click()} disabled={uploading} className="text-xs text-indigo-600 hover:text-indigo-800">+ Add Images</button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!form.hasVariants && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rs.)</label>
                    <input type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Retailer Price (Rs.)</label>
                    <input type="number" value={form.retailerPrice} onChange={e => setForm({...form, retailerPrice: Number(e.target.value)})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Length (in)</label>
                  <input type="number" value={form.lengthInch} onChange={e => setForm({...form, lengthInch: Number(e.target.value)})} className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Width (in)</label>
                  <input type="number" value={form.widthInch} onChange={e => setForm({...form, widthInch: Number(e.target.value)})} className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thickness (in)</label>
                  <input type="number" value={form.thicknessInch} onChange={e => setForm({...form, thicknessInch: Number(e.target.value)})} className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}
            <div className="mt-6 flex gap-3">
              <button 
                onClick={create} 
                disabled={saving}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Create Product'}
              </button>
              <button onClick={() => { setShowForm(false); resetForm(); setError(''); }} className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition">Cancel</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="bg-white rounded-2xl h-64 animate-pulse"></div>)}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products yet</h3>
            <p className="text-gray-500 mb-4">Click "Add Product" to create your first product</p>
            <button onClick={() => setShowForm(true)} className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700">+ Add Product</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(p => {
              const productImage = getProductImage(p);
              const allColors = getAllColors(p);

              return (
                <div key={p._id} className={'bg-white rounded-2xl shadow-sm border overflow-hidden transition-all hover:shadow-lg ' + (p.enabled ? 'border-gray-100' : 'border-red-200 opacity-75')}>
                  <div className="aspect-video bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center relative overflow-hidden">
                    {productImage ? (
                      <img src={productImage.startsWith('/') ? 'http://localhost:5000' + productImage : productImage} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-16 h-16 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className={'text-xs font-semibold px-2 py-1 rounded-full ' + (p.type === 'STANDARD' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}>{p.type}</span>
                      {!p.enabled && <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700">Disabled</span>}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{p.name}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{p.description || 'No description'}</p>

                    {p.variants && p.variants.length > 0 ? (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-xl font-bold text-indigo-600">
                            Rs.{Number(getLowestPrice(p)).toLocaleString()} - Rs.{Number(getHighestPrice(p)).toLocaleString()}
                          </div>
                          {p.size && (
                            <div className="text-right text-sm text-gray-500">
                              <div>{cmToInch(p.size.lengthCm)}" x {cmToInch(p.size.widthCm)}"</div>
                              <div className="text-xs">{cmToInch(p.size.thicknessCm)}" thick</div>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 mb-2">Density Variants:</div>
                        <div className="flex flex-wrap gap-1">
                          {p.variants.map((v, idx) => (
                            <span key={idx} className={`px-2 py-1 rounded text-xs font-medium ${
                              v.density === 28 ? 'bg-green-100 text-green-700' :
                              v.density === 32 ? 'bg-blue-100 text-blue-700' :
                              v.density === 40 ? 'bg-purple-100 text-purple-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {v.density ? `${v.density}D` : 'Luxury'} - Rs.{v.price?.toLocaleString()}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="text-xl font-bold text-indigo-600">Rs.{Number(p.price || 0).toLocaleString()}</div>
                          <div className="text-xs text-gray-400">Retailer: Rs.{Number(p.retailerPrice || 0).toLocaleString()}</div>
                        </div>
                        {p.size && (
                          <div className="text-right text-sm text-gray-500">
                            <div>{cmToInch(p.size.lengthCm)}" x {cmToInch(p.size.widthCm)}"</div>
                            <div className="text-xs">{cmToInch(p.size.thicknessCm)}" thick</div>
                          </div>
                        )}
                      </div>
                    )}

                    {allColors.length > 0 && (
                      <div className="mb-4">
                        <div className="text-xs text-gray-400 mb-1">Available Colors:</div>
                        <div className="flex flex-wrap gap-1">
                          {allColors.map((color, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                              {color.code && <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: color.code }}></span>}
                              <span className="text-gray-600">{color.name}</span>
                              {color.imageCount > 0 && <span className="text-gray-400">({color.imageCount})</span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button onClick={() => update(p._id, { enabled: !p.enabled })} className={'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ' + (p.enabled ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100')}>
                        {p.enabled ? 'Disable' : 'Enable'}
                      </button>
                      <button onClick={() => remove(p._id)} className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition">Delete</button>
                    </div>
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
