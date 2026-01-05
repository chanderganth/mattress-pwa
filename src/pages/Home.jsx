import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../config/apiClient.js';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products').then(r => {
      setProducts(r.data.filter(p => p.type === 'STANDARD').slice(0, 4));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen -m-4">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Premium Quality Since 2020
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Sleep Better,<br/>
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Live Better</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-lg">
                Experience the perfect blend of comfort and support with our premium mattresses. 
                Crafted with precision, designed for your best sleep.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all transform hover:-translate-y-1">
                  Browse Products
                </Link>
                <Link to="/builder" className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all">
                  Custom Builder
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl blur-2xl opacity-30"></div>
                <div className="relative bg-white/10 backdrop-blur rounded-3xl p-8 border border-white/20">
                  <div className="text-center space-y-4">
                    <div className="text-6xl"></div>
                    <div className="text-2xl font-bold">Custom Mattress Builder</div>
                    <p className="text-gray-300">Design your perfect mattress layer by layer</p>
                    <div className="grid grid-cols-3 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-400">5+</div>
                        <div className="text-xs text-gray-400">Materials</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-400">100%</div>
                        <div className="text-xs text-gray-400">Customizable</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-400">10yr</div>
                        <div className="text-xs text-gray-400">Warranty</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We combine traditional craftsmanship with modern technology to deliver the perfect sleep experience</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '', title: 'Premium Materials', desc: 'Memory foam, latex, and natural coir from certified sources' },
              { icon: '', title: 'Custom Design', desc: 'Build your mattress layer by layer with live pricing' },
              { icon: '', title: 'Free Delivery', desc: 'Fast and free delivery across all major cities' },
              { icon: '', title: '10 Year Warranty', desc: 'Industry-leading warranty for peace of mind' }
            ].map((f, i) => (
              <div key={i} className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-amber-200">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-600">Our best-selling mattresses for every need</p>
            </div>
            <Link to="/products" className="hidden md:flex items-center text-amber-600 font-semibold hover:text-amber-700">
              View All <span className="ml-2"></span>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(p => (
                <Link key={p._id} to={'/products/'+p._id} className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <span className="text-6xl group-hover:scale-110 transition-transform"></span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-1">{p.name}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{p.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-amber-600">₹{(p.price || 0).toLocaleString()}</span>
                      <span className="text-sm text-gray-400">{p.size?.lengthCm}x{p.size?.widthCm}cm</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/products" className="inline-flex items-center text-amber-600 font-semibold">
              View All Products <span className="ml-2"></span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Build Your Dream Mattress?</h2>
          <p className="text-xl text-white/80 mb-8">Use our interactive builder to create a custom mattress tailored to your preferences</p>
          <Link to="/builder" className="inline-flex px-10 py-4 bg-white text-amber-600 font-bold rounded-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
            Start Building Now 
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="text-2xl font-bold text-white">Mattress & Foam</div>
              <p className="text-sm">Premium quality mattresses crafted for your perfect sleep.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Products</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/products" className="hover:text-white transition">Standard Mattresses</Link></li>
                <li><Link to="/builder" className="hover:text-white transition">Custom Builder</Link></li>
                <li><Link to="/vip" className="hover:text-white transition">VIP Membership</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Business</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/retailer" className="hover:text-white transition">Retailer Portal</Link></li>
                <li><Link to="/admin" className="hover:text-white transition">Admin Login</Link></li>
                <li><Link to="/orders" className="hover:text-white transition">Track Order</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li> +91 98765 43210</li>
                <li> info@mattressfoam.com</li>
                <li> Bangalore, India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
             2026 Mattress & Foam Manufacturing. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
