import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext';
import api from '../config/apiClient.js';
import PaymentQR from '../components/PaymentQR';

export default function Cart() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [ordering, setOrdering] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [success, setSuccess] = useState(false);

  const subtotal = getCartTotal();
  const shipping = subtotal > 10000 ? 0 : 500;
  const total = subtotal + shipping;

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
      for (const item of cartItems) {
        await api.post('/orders/standard', {
          productId: item._id,
          quantity: item.quantity,
          customerName: customerInfo.name,
          customerPhone: customerInfo.phone,
          customerAddress: customerInfo.address,
          paymentStatus: 'paid'
        });
      }
      clearCart();
      setSuccess(true);
      setShowPayment(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold">Shopping Cart</h1>
          <p className="mt-2 text-indigo-200">Review your items before checkout</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-12 text-center">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Browse our amazing collection of mattresses and foam products!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition transform"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Browse Products
              </Link>
              <Link
                to="/builder"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Custom Builder
              </Link>
            </div>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl shadow-lg p-6 flex gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    {item.images && item.images[0] ? (
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <svg className="w-10 h-10 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 9V7c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v2c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2v1c0 .55.45 1 1 1s1-.45 1-1v-1h12v1c0 .55.45 1 1 1s1-.45 1-1v-1c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2z"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.size ? `${item.size.lengthCm} x ${item.size.widthCm} cm` : 'Standard Size'}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center font-semibold"
                        >
                          -
                        </button>
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center font-semibold"
                        >
                          +
                        </button>
                      </div>
                      <div className="font-bold text-indigo-600">Rs.{((item.price || 0) * item.quantity).toLocaleString()}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700 transition self-start p-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Continue Shopping */}
              <div className="text-center pt-4">
                <Link to="/products" className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal ({cartItems.length} items)</span>
                    <span className="font-medium">Rs.{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium">{shipping === 0 ? <span className="text-green-600">FREE</span> : 'Rs.' + shipping}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gray-400">Free shipping on orders above Rs.10,000</p>
                  )}
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-indigo-600">Rs.{total.toLocaleString()}</span>
                  </div>
                </div>

                {!showCheckout ? (
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition transform"
                  >
                    Proceed to Checkout
                  </button>
                ) : (
                  <div className="mt-6 space-y-4">
                    <h4 className="font-semibold text-gray-900">Delivery Details</h4>
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={customerInfo.name}
                      onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={customerInfo.phone}
                      onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <textarea
                      placeholder="Delivery Address"
                      value={customerInfo.address}
                      onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      rows="2"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    ></textarea>
                    <button
                      onClick={proceedToPayment}
                      className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                    >
                      Proceed to Payment
                    </button>
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="w-full px-6 py-3 text-gray-600 hover:text-gray-800"
                    >
                      Back
                    </button>
                  </div>
                )}

                <p className="text-xs text-center text-gray-400 mt-3">Secure checkout with UPI payment</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
