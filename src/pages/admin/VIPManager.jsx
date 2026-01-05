import { useEffect, useState } from 'react';
import api from '../../config/apiClient.js';

export default function VIPManager() {
  const [vipUsers, setVipUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('vip'); // 'vip' or 'all'

  async function loadVIP() {
    try {
      const r = await api.get('/vip/customers');
      setVipUsers(r.data || []);
    } catch (e) {
      setVipUsers([]);
    }
  }

  async function loadAllUsers() {
    try {
      const r = await api.get('/users');
      setAllUsers(r.data || []);
    } catch (e) {
      setAllUsers([]);
    }
  }

  async function load() {
    setLoading(true);
    await Promise.all([loadVIP(), loadAllUsers()]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleVIP(user) {
    try {
      if (user.isVIP) {
        await api.put(`/users/${user._id}`, { isVIP: false, role: 'CUSTOMER' });
      } else {
        await api.put(`/vip/customers/${user.uid}/vip`);
      }
      load();
    } catch (e) {
      alert('Error updating VIP status');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const nonVipUsers = allUsers.filter(u => !u.isVIP && u.role !== 'ADMIN');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">VIP Customer Management</h2>
          <p className="text-gray-500 mt-1">Manage VIP customers and their benefits</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setTab('vip')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'vip' ? 'bg-white shadow text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            VIP Customers ({vipUsers.length})
          </button>
          <button
            onClick={() => setTab('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'all' ? 'bg-white shadow text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            All Customers ({nonVipUsers.length})
          </button>
        </div>
      </div>

      {/* VIP Tab */}
      {tab === 'vip' && (
        <div className="space-y-4">
          {vipUsers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No VIP Customers Yet</h3>
              <p className="text-gray-500 mb-4">Promote customers to VIP status from the "All Customers" tab</p>
              <button onClick={() => setTab('all')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                View All Customers
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {vipUsers.map(u => (
                <div key={u._id} className="bg-white rounded-xl shadow-sm border border-yellow-200 p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{u.displayName || u.email}</div>
                      <div className="text-sm text-gray-500">{u.email}</div>
                      {u.phone && <div className="text-sm text-gray-400">{u.phone}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">VIP</span>
                    <button
                      onClick={() => toggleVIP(u)}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                    >
                      Remove VIP
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* All Customers Tab */}
      {tab === 'all' && (
        <div className="space-y-4">
          {nonVipUsers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Customers Found</h3>
              <p className="text-gray-500">Customers will appear here when they register</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {nonVipUsers.map(u => (
                <div key={u._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{u.displayName || u.email}</div>
                      <div className="text-sm text-gray-500">{u.email}</div>
                      {u.phone && <div className="text-sm text-gray-400">{u.phone}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">{u.role || 'CUSTOMER'}</span>
                    <button
                      onClick={() => toggleVIP(u)}
                      className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200 transition"
                    >
                      Make VIP
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIP Benefits Info */}
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-100">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          VIP Benefits Include:
        </h3>
        <ul className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
            Mattress Usage Guide & Videos
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
            Rotation Reminders
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
            5-Year Warranty Information
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
            Service History Tracking
          </li>
        </ul>
      </div>
    </div>
  );
}
