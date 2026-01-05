import { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { auth } from '../config/firebase.js';

export default function ProtectedRoute({ children, role = null }) {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    // Demo mode: allow access without auth
    if (!auth) {
      setAllowed(true);
      setReady(true);
      return;
    }

    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        // Demo mode: allow access for testing
        const demoMode = !import.meta.env.VITE_FIREBASE_API_KEY;
        if (demoMode) {
          setAllowed(true);
          setReady(true);
          return;
        }
        setAllowed(false);
        setReady(true);
        return;
      }
      const clientRole = localStorage.getItem('role') || 'CUSTOMER';
      setAllowed(!role || role === clientRole);
      setReady(true);
    });
    return () => unsub();
  }, [role]);

  if (!ready) return <div className="p-4">Loading...</div>;
  if (!allowed) return <Navigate to="/admin" state={{ from: loc }} replace />;
  return children;
}
