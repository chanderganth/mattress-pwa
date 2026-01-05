import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../config/apiClient.js';

function RetailerNav() {
  const location = useLocation();
  const navItems = [
    { path: '/retailer/dashboard', label: 'Dashboard', icon: '' },
    { path: '/retailer/products', label: 'Products', icon: '' },
    { path: '/retailer/builder', label: 'Custom Builder', icon: '' },
    { path: '/retailer/bulk', label: 'Bulk Orders', icon: '' },
    { path: '/retailer/orders', label: 'Order History', icon: '' }
  ];

  return (
    <header className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <span className="text-2xl"></span>
            <span className="font-bold text-xl hidden sm:block">Retailer Portal</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link key={item.path} to={item.path}
                className={'px-4 py-2 rounded-lg transition flex items-center gap-2 ' + 
                  (location.pathname === item.path ? 'bg-white/20' : 'hover:bg-white/10')}>
                <span>{item.icon}</span>
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

export default function RetailerProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/products')
      .then(r => setProducts(r.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter(p => {
    if (filter !== 'all' && p.type !== filter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Product Catalog</h1>
            <p className="text-gray-500 mt-1">Wholesale pricing for registered retailers</p>
          </div>
          <Link to="/retailer/builder" className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition">
             Custom Order
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></span>
              <input type="text" placeholder="Search products..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="flex gap-2">
              {['all', 'STANDARD', 'CUSTOM'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={'px-4 py-2 rounded-xl font-medium transition ' +
                    (filter === f ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                  {f === 'all' ? 'All' : f === 'STANDARD' ? ' Standard' : ' Custom'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group">
              <div className="h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                <span className="text-6xl group-hover:scale-110 transition">{product.type === 'CUSTOM' ? '' : ''}</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className={'px-2 py-1 rounded-full text-xs font-semibold ' +
                    (product.type === 'CUSTOM' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700')}>
                    {product.type}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                
                {product.type === 'STANDARD' && (
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-emerald-600">₹{(product.retailerPrice || product.price * 0.85).toLocaleString()}</span>
                    <span className="text-sm text-gray-400 line-through">₹{(product.price || 0).toLocaleString()}</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">15% OFF</span>
                  </div>
                )}
                
                {product.size && (
                  <p className="text-sm text-gray-500 mt-2"> {product.size.lengthCm}x{product.size.widthCm}x{product.size.thicknessCm} cm</p>
                )}

                <div className="mt-4 flex gap-2">
                  {product.type === 'STANDARD' ? (
                    <button className="flex-1 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition">
                      Add to Order
                    </button>
                  ) : (
                    <Link to="/retailer/builder" className="flex-1 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition text-center">
                      Customize
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl"></span>
            <h3 className="text-xl font-semibold text-gray-900 mt-4">No Products Found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
