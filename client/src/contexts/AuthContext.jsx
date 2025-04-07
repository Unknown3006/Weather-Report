import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from "@/components/ui/use-toast";

const API_URL = 'http://localhost:5000/api';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await fetch(`${API_URL}/user/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setCurrentUser(userData);
          } else {
            setToken(null);
            setCurrentUser(null);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          setToken(null);
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const signup = async (username, email, password, preferredCity) => {
    try {
        console.log('Making signup request with:', { username, email, preferredCity });
        
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password,
                preferredCity
            })
        });

        const data = await response.json();
        console.log('Signup response:', response.status, data);

        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }

        return data;
    } catch (error) {
        console.error('Signup error in context:', error);
        throw error;
    }
};

  const login = async (username, password) => {
    try {
      console.log('Attempting login with username:', username);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Changed from email to username
      });

      const data = await response.json();
      console.log('Login response:', response.status);

      if (!response.ok) throw new Error(data.error);

      setCurrentUser(data.user);
      setToken(data.token);

      toast({
        title: "Success",
        description: "Logged in successfully",
      });

      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      setCurrentUser(null);
      setToken(null);
      
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const requestPasswordReset = async (email, username) => {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      return data;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      return data;
    } catch (error) {
      throw error;
    }
  };

  const updateUserPreferences = async (preferences) => {
    try {
      const response = await fetch(`${API_URL}/user/preferences`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setCurrentUser(prev => ({ ...prev, ...data }));
      
      toast({
        title: "Success",
        description: "Preferences updated successfully",
      });
      
      return data;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      throw error;
    }
  };

  const value = {
    currentUser,
    token,
    signup,
    login,
    logout,
    updateUserPreferences,
    requestPasswordReset,
    resetPassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
