import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Load user data if token is present
  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/auth/me');
      setUser(res.data.user);
      if (res.data.doctorProfile) {
        setDoctorProfile(res.data.doctorProfile);
      } else {
        setDoctorProfile(null);
      }
    } catch (err) {
      console.error('Failed to load user session:', err);
      // If token is invalid or expired, clear auth state
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setDoctorProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run on mount
  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token, loadUser]);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      const receivedToken = res.data.token;
      
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      
      // Axios interceptor will automatically catch the token update, but we load user details directly
      const userRes = await API.get('/auth/me', {
        headers: { Authorization: `Bearer ${receivedToken}` },
      });
      
      setUser(userRes.data.user);
      if (userRes.data.doctorProfile) {
        setDoctorProfile(userRes.data.doctorProfile);
      }
      return { success: true };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', userData);
      const receivedToken = res.data.token;

      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);

      const userRes = await API.get('/auth/me', {
        headers: { Authorization: `Bearer ${receivedToken}` },
      });

      setUser(userRes.data.user);
      if (userRes.data.doctorProfile) {
        setDoctorProfile(userRes.data.doctorProfile);
      }
      return { success: true };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed. Try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setDoctorProfile(null);
  }, []);

  // Update profile handler (Patient)
  const updatePatientProfile = async (profileData) => {
    try {
      const res = await API.put('/patients/profile', profileData);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update profile',
      };
    }
  };

  // Update profile handler (Doctor)
  const updateDoctorProfile = async (profileData) => {
    try {
      const res = await API.put('/doctors/profile', profileData);
      setUser(res.data.data.user);
      setDoctorProfile(res.data.data);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update profile',
      };
    }
  };

  // Update availability slots (Doctor)
  const updateDoctorAvailability = async (availability) => {
    try {
      const res = await API.put('/doctors/availability', { availability });
      setDoctorProfile(res.data.data);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update availability schedule',
      };
    }
  };

  const value = {
    user,
    doctorProfile,
    token,
    loading,
    login,
    register,
    logout,
    updatePatientProfile,
    updateDoctorProfile,
    updateDoctorAvailability,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
