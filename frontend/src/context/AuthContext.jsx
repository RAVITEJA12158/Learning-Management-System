import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);
const TOKEN_KEY = 'lms_token';
const USER_KEY = 'lms_user';

function safeGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key, val) {
  try {
    localStorage.setItem(key, val);
  } catch {
    // ignore storage errors
  }
}

function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore storage errors
  }
}

function loadPersistedUser() {
  try {
    const raw = safeGetItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    safeRemoveItem(USER_KEY);
    return null;
  }
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadPersistedUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = safeGetItem(TOKEN_KEY);
    const savedUser = loadPersistedUser();
    if (token && savedUser) {
      setUser(savedUser);
    } else {
      safeRemoveItem(TOKEN_KEY);
      safeRemoveItem(USER_KEY);
      setUser(null);
    }
    setLoading(false);
  }, []);

  function login({ token, user: userData }) {
    const enrichedUser = {
      username: userData.username || userData.email?.split('@')[0] || 'scholar',
      department: userData.department || 'Computer Science & Engineering',
      semester: userData.semester || 'Fall 2026',
      mobileNumber: userData.mobileNumber || '',
      ...userData,
    };
    safeSetItem(TOKEN_KEY, token);
    safeSetItem(USER_KEY, JSON.stringify(enrichedUser));
    safeSetItem('token', token);
    setUser(enrichedUser);
  }

  function logout() {
    safeRemoveItem(TOKEN_KEY);
    safeRemoveItem(USER_KEY);
    safeRemoveItem('token');
    setUser(null);
  }

  function updateUser(updatedData) {
    setUser((prev) => {
      const nextUser = {
        ...(prev || {}),
        ...updatedData,
      };
      safeSetItem(USER_KEY, JSON.stringify(nextUser));
      return nextUser;
    });
  }

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    accessToken: safeGetItem(TOKEN_KEY),
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
