import { useEffect, useState } from 'react';
import api from '../config/apiClient.js';

export default function VIPDashboard() {
  const [activeTab, setActiveTab] = useState('benefits');

  const benefits = [
    { title: 'Extended 10-Year Warranty', description: 'Double the standard warranty period with comprehensive coverage against manufacturing defects, sagging, and foam deterioration.' },
    { title: 'Priority Customer Support', description: '24/7 dedicated VIP support line with average response time under 2 minutes. Skip the queue every time.' },
    { title: 'Free Annual Deep Cleaning', description: 'Complimentary professional mattress cleaning service once per year to maintain hygiene and extend mattress life.' },
    { title: 'Exclusive Member Discounts', description: 'Get 15-25% off on all future purchases including accessories, pillows, bed frames, and new mattresses.' },
    { title: 'Free Delivery and Installation', description: 'Complimentary white-glove delivery service with professional installation and old mattress removal.' },
    { title: 'Early Access to New Products', description: 'Be the first to try our latest innovations with exclusive early access to new product launches.' },
    { title: 'Comfort Guarantee Extension', description: '120-night sleep trial instead of standard 30 nights. Not satisfied? Free exchange or full refund.' },
    { title: 'Personalized Sleep Consultation', description: 'Annual consultation with our sleep experts to optimize your sleep environment and mattress setup.' }
  ];

  const careInstructions = [
    { title: 'Premium Mattress Protector', description: 'Use our breathable, waterproof protector (included with VIP membership) to guard against spills, allergens, and dust mites.' },
    { title: 'Monthly Vacuuming', description: 'Use upholstery attachment to remove dust and allergens. Focus on seams and crevices where debris accumulates.' },
    { title: 'Spot Cleaning Protocol', description: 'For stains, use mild detergent mixed with cold water. Blot gently - never rub. Allow to air dry completely.' },
    { title: 'Proper Foundation', description: 'Use a sturdy bed frame with center support for mattresses wider than 160cm. Ensure slats are no more than 7cm apart.' },
    { title: 'Air Circulation', description: 'Remove bedding weekly and let mattress breathe for 2-3 hours. Open windows for fresh air circulation.' },
    { title: 'Avoid Jumping', description: 'Prevent damage to internal structure by avoiding jumping or standing on the mattress.' }
  ];

  const rotationReminders = [
    { month: 3, message: 'First rotation - Head to foot rotation recommended for even wear' },
    { month: 6, message: 'Second rotation - Check for any indentations and rotate' },
    { month: 9, message: 'Third rotation - Also consider flipping if double-sided' },
    { month: 12, message: 'Annual service - Deep clean and thorough inspection recommended' }
  ];

  const exclusiveOffers = [
    { title: '20% Off Pillows', code: 'VIP20PILLOW', validUntil: 'March 31, 2026' },
    { title: '25% Off Bed Frames', code: 'VIP25FRAME', validUntil: 'February 28, 2026' },
    { title: 'Free Mattress Topper', code: 'VIPTOPPER', validUntil: 'January 31, 2026', minPurchase: 15000 }
  ];

  const tabs = [
    { id: 'benefits', label: 'VIP Benefits' },
    { id: 'guide', label: 'Usage Guide' },
    { id: 'care', label: 'Care Tips' },
    { id: 'rotation', label: 'Rotation' },
    { id: 'warranty', label: 'Warranty' },
    { id: 'offers', label: 'Offers' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">VIP Customer Portal</h1>
              <p className="mt-1 text-amber-100">Exclusive access to premium benefits and resources</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* VIP Status Card */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-12 h-12 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-amber-200 text-sm font-medium">MEMBERSHIP STATUS</div>
                  <h2 className="text-3xl font-bold">VIP GOLD MEMBER</h2>
                  <p className="text-amber-100 mt-1">Member since January 2025</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-3 text-center">
                  <div className="text-2xl font-bold">10</div>
                  <div className="text-xs text-amber-200">Year Warranty</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-3 text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-xs text-amber-200">Priority Support</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-3 text-center">
                  <div className="text-2xl font-bold">25%</div>
                  <div className="text-xs text-amber-200">Discount</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={'flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition whitespace-nowrap ' +
                  (activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100')}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* VIP Benefits Tab */}
          {activeTab === 'benefits' && (
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your VIP Benefits</h2>
                  <p className="text-gray-500">Exclusive perks for our valued members</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="group relative bg-gradient-to-br from-white to-amber-50 rounded-2xl p-6 border border-amber-100 hover:shadow-xl hover:border-amber-300 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-150 transition-transform"></div>
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg mb-4 text-white font-bold text-xl">
                        {idx + 1}
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* How to Use Benefits */}
              <div className="mt-10 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                <h3 className="font-bold text-gray-900 mb-4">How to Use Your Benefits</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Call VIP Line</h4>
                      <p className="text-sm text-gray-600">1800-XXX-XXXX (toll-free)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Mention VIP ID</h4>
                      <p className="text-sm text-gray-600">VIP-2025-GOLD-XXXX</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Enjoy Priority Service</h4>
                      <p className="text-sm text-gray-600">Instant assistance guaranteed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Usage Guide Tab */}
          {activeTab === 'guide' && (
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Usage Guide</h2>
                  <p className="text-gray-500">Get the most out of your premium mattress</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 mb-8">
                <p className="text-gray-700 leading-relaxed text-lg">
                  Your premium mattress is engineered with advanced multi-layer technology for optimal comfort and support. For best results: Place on a solid foundation or slatted base with slats no more than 7cm apart. Allow 24-48 hours for full expansion after unboxing. Rotate 180 degrees every 3 months for even wear distribution. Maintain room temperature between 18-22C for optimal foam performance.
                </p>
              </div>

              {/* Quick Tips Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 text-center border border-blue-100">
                  <div className="text-3xl mb-2">24-48h</div>
                  <p className="text-lg font-bold text-gray-900">Expansion Time</p>
                  <p className="text-sm text-gray-500">Full expansion period</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 text-center border border-green-100">
                  <div className="text-3xl mb-2">3 mo</div>
                  <p className="text-lg font-bold text-gray-900">Rotation Cycle</p>
                  <p className="text-sm text-gray-500">Every 3 months</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 text-center border border-purple-100">
                  <div className="text-3xl mb-2">18-22C</div>
                  <p className="text-lg font-bold text-gray-900">Ideal Temp</p>
                  <p className="text-sm text-gray-500">Room temperature</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 text-center border border-amber-100">
                  <div className="text-3xl mb-2">200kg</div>
                  <p className="text-lg font-bold text-gray-900">Max Weight</p>
                  <p className="text-sm text-gray-500">Weight capacity</p>
                </div>
              </div>

              {/* Setup Steps */}
              <div className="mt-8">
                <h3 className="font-bold text-gray-900 mb-4">Initial Setup Steps</h3>
                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Unbox Carefully', desc: 'Remove packaging in the room where mattress will be used' },
                    { step: 2, title: 'Place on Foundation', desc: 'Ensure bed frame is sturdy with proper center support' },
                    { step: 3, title: 'Allow to Expand', desc: 'Wait 24-48 hours for full expansion before first use' },
                    { step: 4, title: 'Add Protector', desc: 'Install mattress protector before adding sheets' }
                  ].map(item => (
                    <div key={item.step} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">{item.step}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Care Tips Tab */}
          {activeTab === 'care' && (
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Care Instructions</h2>
                  <p className="text-gray-500">Keep your mattress in perfect condition</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {careInstructions.map((tip, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4 text-green-600 font-bold text-xl">
                      {idx + 1}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{tip.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{tip.description}</p>
                  </div>
                ))}
              </div>

              {/* Cleaning Schedule */}
              <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-4">Recommended Cleaning Schedule</h3>
                <div className="grid sm:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-xl">
                    <div className="font-bold text-green-600">Weekly</div>
                    <p className="text-sm text-gray-600 mt-1">Change bed sheets</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl">
                    <div className="font-bold text-green-600">Monthly</div>
                    <p className="text-sm text-gray-600 mt-1">Vacuum mattress</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl">
                    <div className="font-bold text-green-600">Quarterly</div>
                    <p className="text-sm text-gray-600 mt-1">Rotate mattress</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl">
                    <div className="font-bold text-green-600">Yearly</div>
                    <p className="text-sm text-gray-600 mt-1">Deep clean (free for VIP!)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rotation Schedule Tab */}
          {activeTab === 'rotation' && (
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Rotation Schedule</h2>
                  <p className="text-gray-500">Maintain even wear with regular rotation</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500"></div>
                <div className="space-y-6">
                  {rotationReminders.map((reminder, idx) => (
                    <div key={idx} className="relative pl-16">
                      <div className="absolute left-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {reminder.month}m
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                        <h3 className="font-bold text-gray-900">Month {reminder.month}</h3>
                        <p className="text-gray-600 mt-1">{reminder.message}</p>
                        <div className="mt-3 flex items-center gap-2 text-sm text-purple-600">
                          <span>Tip: Head to foot rotation (180 degrees)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rotation Diagram */}
              <div className="mt-8 bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">How to Rotate</h3>
                <div className="flex items-center justify-center gap-8 py-4">
                  <div className="text-center">
                    <div className="w-24 h-16 bg-purple-200 rounded-lg flex items-center justify-center mb-2">
                      <span>HEAD UP</span>
                    </div>
                    <p className="text-sm text-gray-600">Before</p>
                  </div>
                  <div className="text-4xl text-gray-400">---&gt;</div>
                  <div className="text-center">
                    <div className="w-24 h-16 bg-pink-200 rounded-lg flex items-center justify-center mb-2">
                      <span>HEAD DOWN</span>
                    </div>
                    <p className="text-sm text-gray-600">After (180 deg)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Warranty Tab */}
          {activeTab === 'warranty' && (
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Warranty Information</h2>
                  <p className="text-gray-500">Your VIP extended protection</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center mb-8">
                <div className="text-7xl font-bold">10</div>
                <div className="text-2xl font-semibold mt-2">Year Extended Warranty</div>
                <p className="mt-2 text-blue-200">VIP Exclusive - Double the standard coverage!</p>
                <div className="mt-4 inline-block bg-white/20 px-4 py-2 rounded-full text-sm">
                  Valid until: January 2035
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Terms and Conditions</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your VIP warranty covers: Manufacturing defects in materials and workmanship, body impressions/sagging greater than 1.5 inches, deterioration causing the foam to split or crack, and broken or bent coil springs. The warranty does not cover: Normal wear and comfort changes, physical abuse or damage, stains, burns, or tears, damage from improper support, and use of improper cleaning products.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                  <h4 className="font-bold text-green-800 flex items-center gap-2 mb-4">
                    What is Covered
                  </h4>
                  <ul className="space-y-3">
                    {['Manufacturing defects', 'Sagging greater than 1.5 inches', 'Foam deterioration', 'Broken or bent springs', 'Stitching failures'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-green-700">
                        <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">Y</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <h4 className="font-bold text-red-800 flex items-center gap-2 mb-4">
                    Not Covered
                  </h4>
                  <ul className="space-y-3">
                    {['Normal wear and tear', 'Stains, burns, or tears', 'Physical damage or abuse', 'Improper foundation use', 'Comfort preference changes'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-red-700">
                        <span className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">N</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Exclusive Offers Tab */}
          {activeTab === 'offers' && (
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Exclusive VIP Offers</h2>
                  <p className="text-gray-500">Special discounts just for you</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {exclusiveOffers.map((offer, idx) => (
                  <div key={idx} className="relative bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative">
                      <div className="text-amber-200 text-sm font-medium">VIP EXCLUSIVE</div>
                      <h3 className="text-xl font-bold mt-1">{offer.title}</h3>
                      <div className="mt-4 bg-white/20 backdrop-blur rounded-lg p-3">
                        <div className="text-xs text-amber-200">USE CODE</div>
                        <div className="text-lg font-mono font-bold">{offer.code}</div>
                      </div>
                      <p className="mt-3 text-sm text-amber-200">
                        Valid until: {offer.validUntil}
                        {offer.minPurchase && ` - Min. Rs.${offer.minPurchase.toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Referral Program */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-2xl font-bold">VIP Referral Program</h3>
                    <p className="mt-2 text-purple-200">Refer a friend and both of you get Rs.2,000 off your next purchase!</p>
                  </div>
                  <button className="px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition">
                    Share Referral Link
                  </button>
                </div>
              </div>

              {/* Upcoming Sales */}
              <div className="mt-8">
                <h3 className="font-bold text-gray-900 mb-4">Upcoming VIP-Only Sales</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center gap-4">
                    <div className="w-14 h-14 bg-red-100 rounded-lg flex flex-col items-center justify-center">
                      <span className="text-xs font-bold text-red-600">JAN</span>
                      <span className="text-lg font-bold text-red-600">15</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Winter Sleep Sale</h4>
                      <p className="text-sm text-gray-600">Up to 30% off on accessories</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center gap-4">
                    <div className="w-14 h-14 bg-pink-100 rounded-lg flex flex-col items-center justify-center">
                      <span className="text-xs font-bold text-pink-600">FEB</span>
                      <span className="text-lg font-bold text-pink-600">14</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Valentines Special</h4>
                      <p className="text-sm text-gray-600">Buy 1 Get 1 50% off pillows</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Support Contact */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">VIP Priority Support</h3>
                <p className="text-gray-500">Available 24/7 - Average wait time: 30 seconds</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition">
                Call Now
              </button>
              <button className="px-6 py-3 border-2 border-amber-500 text-amber-600 rounded-xl font-semibold hover:bg-amber-50 transition">
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
