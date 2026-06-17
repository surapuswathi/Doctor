import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  // Render navigation links based on role
  const renderLinks = () => {
    switch (user.role) {
      case 'patient':
        return (
          <>
            <Link
              to="/patient/dashboard"
              className={`sidebar-nav-link ${isActive('/patient/dashboard') ? 'active' : ''}`}
            >
              <i className="bi bi-grid-fill"></i>
              <span>Dashboard</span>
            </Link>
            <Link
              to="/patient/appointments"
              className={`sidebar-nav-link ${isActive('/patient/appointments') ? 'active' : ''}`}
            >
              <i className="bi bi-calendar2-check-fill"></i>
              <span>My Appointments</span>
            </Link>
            <Link
              to="/patient/profile"
              className={`sidebar-nav-link ${isActive('/patient/profile') ? 'active' : ''}`}
            >
              <i className="bi bi-person-bounding-box"></i>
              <span>My Profile</span>
            </Link>
          </>
        );

      case 'doctor':
        return (
          <>
            <Link
              to="/doctor/dashboard"
              className={`sidebar-nav-link ${isActive('/doctor/dashboard') ? 'active' : ''}`}
            >
              <i className="bi bi-grid-fill"></i>
              <span>Dashboard</span>
            </Link>
            <Link
              to="/doctor/appointments"
              className={`sidebar-nav-link ${isActive('/doctor/appointments') ? 'active' : ''}`}
            >
              <i className="bi bi-calendar-event-fill"></i>
              <span>Requests Panel</span>
            </Link>
            <Link
              to="/doctor/availability"
              className={`sidebar-nav-link ${isActive('/doctor/availability') ? 'active' : ''}`}
            >
              <i className="bi bi-clock-fill"></i>
              <span>My Availability</span>
            </Link>
            <Link
              to="/doctor/profile"
              className={`sidebar-nav-link ${isActive('/doctor/profile') ? 'active' : ''}`}
            >
              <i className="bi bi-person-vcard-fill"></i>
              <span>Doctor Profile</span>
            </Link>
          </>
        );

      case 'admin':
        return (
          <>
            <Link
              to="/admin/dashboard"
              className={`sidebar-nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
            >
              <i className="bi bi-speedometer2"></i>
              <span>Overview Panel</span>
            </Link>
            <Link
              to="/admin/users"
              className={`sidebar-nav-link ${isActive('/admin/users') ? 'active' : ''}`}
            >
              <i className="bi bi-people-fill"></i>
              <span>Manage Users</span>
            </Link>
            <Link
              to="/admin/doctors"
              className={`sidebar-nav-link ${isActive('/admin/doctors') ? 'active' : ''}`}
            >
              <i className="bi bi-person-badge-fill"></i>
              <span>Approve Doctors</span>
            </Link>
            <Link
              to="/admin/appointments"
              className={`sidebar-nav-link ${isActive('/admin/appointments') ? 'active' : ''}`}
            >
              <i className="bi bi-journal-medical"></i>
              <span>All Bookings</span>
            </Link>
          </>
        );

      default:
        return null;
    }
  };

  const getRoleIcon = () => {
    if (user.role === 'admin') return 'bi-shield-fill-check text-warning';
    if (user.role === 'doctor') return 'bi-bandaid-fill text-primary';
    return 'bi-person-fill text-success';
  };

  return (
    <div className="dashboard-sidebar d-flex flex-column justify-content-between">
      <div>
        {/* User Card */}
        <div className="glass-card p-3 mb-4 d-flex align-items-center gap-3">
          <div className="rounded-circle bg-dark bg-opacity-50 p-2 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
            <i className={`bi ${getRoleIcon()} fs-4`}></i>
          </div>
          <div className="overflow-hidden">
            <h6 className="mb-0 text-truncate text-white fw-bold">{user.name}</h6>
            <span className="text-info small text-uppercase tracking-wider fs-7">
              {user.role} Account
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="nav flex-column">{renderLinks()}</nav>
      </div>

      {/* Quick Info / Version */}
      <div className="text-center text-muted small opacity-50 pt-3 border-top border-secondary border-opacity-10">
        <p className="mb-0">Book A Doctor v1.0</p>
      </div>
      
      <style>{`
        .fs-7 {
          font-size: 0.7rem;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
