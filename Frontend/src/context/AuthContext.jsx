import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";


const AuthContext = createContext();

export function useAuth() { return useContext(AuthContext); }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("yfr_token"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("AuthContext: Token changed:", token);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("AuthContext: Decoded token:", decoded);
        setUser({ id: decoded.id, email: decoded.email, role: decoded.role, name: decoded.name });
        localStorage.setItem("yfr_token", token);
      } catch (err) {
        console.error("AuthContext: Token decode error:", err);
        setToken(null);
        localStorage.removeItem("yfr_token");
      }
    } else {
      console.log("AuthContext: No token, clearing user");
      setUser(null);
      localStorage.removeItem("yfr_token");
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      setToken(data.accessToken);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, message: err.message };
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("yfr_token");
  };

  const value = { user, token, loading, login, signup, logout, setToken };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
