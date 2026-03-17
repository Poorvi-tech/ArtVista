import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      // Check if user is logged in from localStorage
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        if (mounted) setLoading(false);
        return;
      }

      // Verify token with backend (prevents "stale login" when JWT expired)
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/verify-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data?.user) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          if (mounted) setUser(null);
        } else {
          localStorage.setItem("user", JSON.stringify(data.user));
          if (mounted) setUser(data.user);
        }
      } catch {
        // If backend is unreachable, fall back to cached user to avoid blocking the UI
        if (mounted) setUser(JSON.parse(userData));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    boot();
    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } else {
      return { success: false, error: data.error };
    }
  };

  const register = async (name, email, password) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } else {
      return { success: false, error: data.error };
    }
  };

  // Google authentication function
  const signInWithGoogle = async (credential) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokenId: credential
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Google sign-in failed" };
      }
    } catch (error) {
      return { success: false, error: "An error occurred during Google sign-in" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    signInWithGoogle, // Add Google sign-in function
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}