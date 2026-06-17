import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Determine dashboard path depending on user role
  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'doctor') return '/doctor/dashboard';
    return '/patient/dashboard';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-transparent border-bottom border-secondary border-opacity-10 py-3 sticky-top glass-panel px-lg-5">
      <div className="container-fluid">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-info" to="/">
          <i className="bi bi-heart-pulse-fill fs-3 text-info shadow-glow"></i>
          <span className="tracking-wide fs-4">BOOK A DOCTOR</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-secondary border-opacity-20"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-2">
            <li className="nav-item">
              <Link className={`nav-link fw-500 ${isActive('/') ? 'text-info active' : ''}`} to="/">
                Home
              </Link>
            </li>
            {/* Patients and guests can browse doctors listing */}
            {(!user || user.role === 'patient') && (
              <li className="nav-item">
                <Link
                  className={`nav-link fw-500 ${isActive('/doctors') ? 'text-info active' : ''}`}
                  to="/doctors"
                >
                  Find Doctors
                </Link>
              </li>
            )}
            {/* Show Dashboard link if logged in */}
            {user && (
              <li className="nav-item">
                <Link
                  className={`nav-link fw-500 ${isActive(getDashboardPath()) ? 'text-info active' : ''}`}
                  to={getDashboardPath()}
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          {/* User Session Info / Action Buttons */}
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-secondary-glass d-flex align-items-center gap-2 dropdown-toggle px-3"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle fs-5 text-info"></i>
                  <span>{user.name}</span>
                  <span className="badge bg-info text-dark small-badge px-2">
                    {user.role}
                  </span>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end border border-secondary border-opacity-10 shadow-lg p-2"
                  aria-labelledby="userDropdown"
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <li>
                    <Link className="dropdown-item rounded py-2 text-white" to={getDashboardPath()}>
                      <i className="bi bi-grid-fill me-2 text-info"></i> My Dashboard
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider bg-secondary opacity-25" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item rounded py-2 text-danger fw-500"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2 text-danger"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link className="btn btn-secondary-glass px-4" to="/login">
                  Login
                </Link>
                <Link className="btn btn-primary-glass px-4" to="/register">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .shadow-glow {
          filter: drop-shadow(0 0 5px hsla(var(--primary-hsl), 0.5));
        }
        .small-badge {
          font-size: 0.7rem;
          text-transform: uppercase;
        }
        .dropdown-item:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
        .fw-500 {
          font-weight: 500;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
