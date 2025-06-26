"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on initial load
useEffect(() => {
  async function loadUser() {
    try {
      const response = await fetch('/api/session', {
        credentials: 'include' // Important for cookie-based auth
      });
      const result = await response.json();
      console.log("✅ SessionContext: /api/session result:", result);

      setUser(result.user); // ✅ Very important: use result.user
    } catch (error) {
      console.error("❌ Failed to load session:", error);
    } finally {
      setLoading(false);
    }
  }

  loadUser();
}, []);


  // Login function to be called after OTP verification
 // In your SessionProvider component
const login = async (userId) => {
  try {
    const response = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);  // Make sure this matches your API response structure
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};

  // Logout function
  const logout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isPhoneVerified: user?.phoneIsVerified || false,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}