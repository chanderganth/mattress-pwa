import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/apiClient.js';

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    api.get('/products').then(r => {
      setItems(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? items : items.filter(p => p.type === filter);

  return (
    <div className="min-h-screen -m-4 bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-indigo-200 mb-4">
            <Link to="/" className="hover:text-white">Home</Link> <span className="mx-2">/</span> Products
          </nav>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-xl text-indigo-200 max-w-2xl">Discover our range of premium mattresses, from ready-made comfort to fully customizable options.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-3 mb-8">
          {['ALL', 'STANDARD', 'CUSTOM'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={'px-6 py-3 rounded-xl font-medium transition-all ' + (filter === f ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100 border')}
            >
              {f === 'ALL' ? 'All Products' : f === 'STANDARD' ? 'Standard Mattresses' : 'Custom Builder'}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-2xl h-96 animate-pulse"></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4"></div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Check back later for new products</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(p => (
              <Link
                key={p._id}
                to={p.type === 'CUSTOM' ? '/builder' : '/products/' + p._id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                    {p.type === 'CUSTOM' ? '' : ''}
                  </span>
                  {p.type === 'CUSTOM' && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      CUSTOMIZABLE
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{p.name}</h3>
                    <span className={'text-xs font-medium px-2 py-1 rounded ' + (p.type === 'STANDARD' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}>
                      {p.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{p.description}</p>
                  
                  {p.type === 'STANDARD' ? (
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-sm text-gray-400">Starting from</div>
                        <div className="text-2xl font-bold text-indigo-600">₹{(p.price || 0).toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">Size</div>
                        <div className="text-sm font-medium text-gray-700">{p.size?.lengthCm} x {p.size?.widthCm} cm</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="text-indigo-600 font-semibold">Design Your Own </div>
                      <div className="flex -space-x-2">
                        {['', '', '', ''].map((c, i) => (
                          <span key={i} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 py-16 px-6 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Can't find what you're looking for?</h2>
          <p className="text-white/80 mb-8">Build your perfect mattress with our custom builder tool</p>
          <Link to="/builder" className="inline-flex px-8 py-4 bg-white text-amber-600 font-bold rounded-xl hover:shadow-xl transition-all">
            Try Custom Builder 
          </Link>
        </div>
      </div>
    </div>
  );
}
