import { useState } from 'react';

// UPI ID for payment
const UPI_ID = 'vbfoam231@fbl';
const MERCHANT_NAME = 'VB Foam';

export default function PaymentQR({ amount, orderId, onPaymentComplete, hideConfirmButton = false }) {
  const [copied, setCopied] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // Generate UPI payment URL
  const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&tn=Order%20${orderId}&cu=INR`;
  
  // QR Code URL using a free QR code API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;

  function copyUPI() {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function confirmPayment() {
    setPaymentConfirmed(true);
    if (onPaymentComplete) {
      onPaymentComplete();
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Payment</h3>
        <p className="text-gray-500 mb-4">Scan QR code or use UPI ID to pay</p>

        {/* Amount Display */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-4 mb-6">
          <div className="text-sm opacity-80">Amount to Pay</div>
          <div className="text-3xl font-bold">₹{amount?.toLocaleString()}</div>
        </div>

        {/* QR Code */}
        <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 inline-block mb-4">
          <img
            src={qrCodeUrl}
            alt="Payment QR Code"
            className="w-48 h-48 mx-auto"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="w-48 h-48 flex items-center justify-center text-gray-400 text-sm">QR Loading...</div>';
            }}
          />
        </div>

        {/* UPI ID */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Or pay using UPI ID:</p>
          <div className="flex items-center justify-center gap-2">
            <code className="px-4 py-2 bg-gray-100 rounded-lg font-mono text-lg">{UPI_ID}</code>
            <button
              onClick={copyUPI}
              className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
            >
              {copied ? ' Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Payment Apps */}
        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-3">Supported Payment Apps</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">PhonePe</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">GPay</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Paytm</span>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">BHIM</span>
          </div>
        </div>

        {/* Confirm Payment Button - only show if not hidden */}
        {!hideConfirmButton && (
          <>
            {!paymentConfirmed ? (
              <button
                onClick={confirmPayment}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition"
              >
                I have made the payment
              </button>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">Payment confirmation received!</span>
                </div>
                <p className="text-sm text-green-600 mt-2">We will verify and update your order status.</p>
              </div>
            )}
          </>
        )}

        {/* Security Note */}
        <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            <div className="text-left">
              <p className="text-sm font-medium text-amber-800">Secure Payment</p>
              <p className="text-xs text-amber-600">Only pay to verified UPI ID: {UPI_ID}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
