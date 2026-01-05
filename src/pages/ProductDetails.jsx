import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext';
import api from '../config/apiClient.js';
import PaymentQR from '../components/PaymentQR';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showBuyNow, setShowBuyNow] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });
  const [orderId, setOrderId] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/products/' + id)
      .then(r => setProduct(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  function handleAddToCart() {
    addToCart(product, qty);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  function handleBuyNow() {
    setShowBuyNow(true);
  }

  function proceedToPayment() {
    if (!customerInfo.name || !customerInfo.phone) {
      alert('Please enter your name and phone number');
      return;
    }
    setOrderId(`VB-${Date.now()}`);
    setShowPayment(true);
  }

  async function confirmPaymentAndPlaceOrder() {
    setOrdering(true);
    try {
      await api.post('/orders/standard', {
        productId: product._id,
        quantity: qty,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        paymentStatus: 'paid'
      });
      setSuccess(true);
      setShowPayment(false);
      setShowBuyNow(false);
    } catch (err) {
      console.error('Order error:', err);
      alert('Failed to place order. Please login and try again.');
    } finally {
      setOrdering(false);
    }
  }

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-lg w-full">
          <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-2">Your payment has been received and order confirmed.</p>
          <p className="text-sm text-gray-500 mb-6">Order ID: {orderId}</p>
          <div className="space-y-3">
            <Link to="/orders" className="block w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700">
              Track Your Order
            </Link>
            <Link to="/products" className="block w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Payment screen
  if (showPayment) {
    const total = (Number(product?.price || 0) * qty);
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h2>
            <p className="text-gray-600">Scan the QR code to pay Rs.{total.toLocaleString()}</p>
          </div>

          <PaymentQR amount={total} orderId={orderId} hideConfirmButton={true} />

          <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <p className="text-sm text-yellow-800 text-center">
              <strong>Important:</strong> After completing payment, click the button below to confirm your order.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={confirmPaymentAndPlaceOrder}
              disabled={ordering}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              {ordering ? 'Placing Order...' : 'I Have Paid - Confirm Order'}
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

  // Buy Now checkout form
  if (showBuyNow && product) {
    const total = (Number(product.price || 0) * qty);
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Checkout</h2>
            <p className="text-gray-600">{product.name} x {qty}</p>
            <p className="text-2xl font-bold text-indigo-600 mt-2">Rs.{total.toLocaleString()}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
              <textarea
                value={customerInfo.address}
                onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                rows="2"
                placeholder="Enter delivery address"
              ></textarea>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={proceedToPayment}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              Proceed to Payment
            </button>
            <button
              onClick={() => setShowBuyNow(false)}
              className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">
            <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-700">Product Not Found</h2>
          <Link to="/products" className="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [null];
  const sizeInfo = product.size || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-indigo-600 transition">Products</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center overflow-hidden shadow-lg">
              {images[activeImage] ? (
                <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-8">
                  <svg className="w-32 h-32 mx-auto text-indigo-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 9V7c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v2c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2v1c0 .55.45 1 1 1s1-.45 1-1v-1h12v1c0 .55.45 1 1 1s1-.45 1-1v-1c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2zm-14-.5c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v.5H6v-.5zM4 14v-3c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v3H4z"/>
                  </svg>
                  <p className="mt-4 text-gray-500">Premium Mattress</p>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 justify-center">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={'w-16 h-16 rounded-xl overflow-hidden border-2 transition ' +
                      (activeImage === idx ? 'border-indigo-600 shadow-lg' : 'border-gray-200 hover:border-indigo-300')}
                  >
                    {img ? (
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-indigo-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 9V7c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v2c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2v1c0 .55.45 1 1 1s1-.45 1-1v-1h12v1c0 .55.45 1 1 1s1-.45 1-1v-1c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2z"/>
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="flex items-center gap-3">
              <span className={'px-3 py-1 rounded-full text-xs font-semibold ' +
                (product.type === 'CUSTOM'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-indigo-100 text-indigo-700')}>
                {product.type === 'CUSTOM' ? 'Customizable' : 'Standard'}
              </span>
              {product.enabled && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  In Stock
                </span>
              )}
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{product.name}</h1>
              {product.type === 'STANDARD' && (
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-indigo-600">Rs.{Number(product.price || 0).toLocaleString()}</span>
                  <span className="text-gray-400 line-through text-lg">Rs.{(Number(product.price || 0) * 1.2).toLocaleString()}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-lg font-semibold">20% OFF</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>

            {/* Size Info */}
            {product.type === 'STANDARD' && sizeInfo.lengthCm && (
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Dimensions
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                    <div className="text-2xl font-bold text-indigo-600">{sizeInfo.lengthCm}</div>
                    <div className="text-xs text-gray-500 mt-1">Length (cm)</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                    <div className="text-2xl font-bold text-indigo-600">{sizeInfo.widthCm}</div>
                    <div className="text-xs text-gray-500 mt-1">Width (cm)</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                    <div className="text-2xl font-bold text-indigo-600">{sizeInfo.thicknessCm}</div>
                    <div className="text-xs text-gray-500 mt-1">Thickness (cm)</div>
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span className="text-sm font-medium text-amber-800">Free Delivery</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-green-800">100 Day Trial</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-medium text-blue-800">10 Year Warranty</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-purple-800">Eco Friendly</span>
              </div>
            </div>

            {/* Purchase Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
              {product.type === 'STANDARD' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-gray-700 font-medium">Quantity:</label>
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="px-4 py-2 hover:bg-gray-100 transition font-semibold"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        className="w-16 text-center border-x border-gray-200 py-2 focus:outline-none"
                        value={qty}
                        onChange={e => setQty(Math.max(1, Number(e.target.value)))}
                      />
                      <button
                        onClick={() => setQty(qty + 1)}
                        className="px-4 py-2 hover:bg-gray-100 transition font-semibold"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-gray-500">Total: <span className="font-bold text-indigo-600">Rs.{(Number(product.price || 0) * qty).toLocaleString()}</span></span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={addedToCart}
                      className={'flex-1 px-6 py-4 rounded-xl font-semibold transition transform flex items-center justify-center gap-2 ' +
                        (addedToCart
                          ? 'bg-green-600 text-white'
                          : 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50')}
                    >
                      {addedToCart ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Added to Cart!
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Add to Cart
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition transform"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-gray-600">Create your perfect mattress with our custom builder tool</p>
                  <Link
                    to={'/builder?prefill=' + product._id}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition transform"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    Start Customizing
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
