import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layout & Route Protection
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorsListing from './pages/DoctorsListing';
import DoctorDetails from './pages/DoctorDetails';

// Patient Pages
import PatientDashboard from './pages/PatientDashboard';
import PatientAppointments from './pages/PatientAppointments';
import PatientProfile from './pages/PatientProfile';

// Doctor Pages
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorAppointments from './pages/DoctorAppointments';
import DoctorAvailability from './pages/DoctorAvailability';
import DoctorProfile from './pages/DoctorProfile';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminDoctors from './pages/AdminDoctors';
import AdminAppointments from './pages/AdminAppointments';

// Dashboard layout wrapper attaching the Sidebar
const DashboardLayout = ({ children }) => {
  return (
    <div className="sidebar-layout container-fluid px-0">
      <Sidebar />
      <div className="dashboard-content fade-in">
        {children}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <div className="app-container d-flex flex-column min-vh-100">
            {/* Common Top Navbar */}
            <Navbar />

            {/* Core Page Content */}
            <main className="flex-grow-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/doctors" element={<DoctorsListing />} />
                <Route path="/doctors/:id" element={<DoctorDetails />} />

                {/* Patient Protected Routes */}
                <Route
                  path="/patient/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['patient']}>
                      <DashboardLayout>
                        <PatientDashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patient/appointments"
                  element={
                    <ProtectedRoute allowedRoles={['patient']}>
                      <DashboardLayout>
                        <PatientAppointments />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patient/profile"
                  element={
                    <ProtectedRoute allowedRoles={['patient']}>
                      <DashboardLayout>
                        <PatientProfile />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Doctor Protected Routes */}
                <Route
                  path="/doctor/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DashboardLayout>
                        <DoctorDashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctor/appointments"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DashboardLayout>
                        <DoctorAppointments />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctor/availability"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DashboardLayout>
                        <DoctorAvailability />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctor/profile"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DashboardLayout>
                        <DoctorProfile />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <DashboardLayout>
                        <AdminDashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <DashboardLayout>
                        <AdminUsers />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/doctors"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <DashboardLayout>
                        <AdminDoctors />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/appointments"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <DashboardLayout>
                        <AdminAppointments />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Redirect any unmatched path to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;
