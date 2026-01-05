import { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/apiClient.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        // Set auth header for API calls
        api.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const userData = response.data;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    return userData;
  }

  async function register(name, email, password, phone) {
    const response = await api.post('/auth/register', { name, email, password, phone });
    const userData = response.data;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    return userData;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('demoUser');
    delete api.defaults.headers.common['Authorization'];
  }

  async function updateProfile(data) {
    const response = await api.put('/auth/profile', data);
    const updatedUser = { ...user, ...response.data };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
