import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const specializations = [
    { name: 'Cardiologist', icon: 'bi-heart-pulse-fill', desc: 'Heart and cardiovascular care' },
    { name: 'Pediatrician', icon: 'bi-baby-carriage', desc: 'Child health and developmental care' },
    { name: 'Dermatologist', icon: 'bi-droplet-fill', desc: 'Skin, hair, and nails treatment' },
    { name: 'Neurologist', icon: 'bi-activity', desc: 'Brain and nervous system disorders' },
    { name: 'Orthopedic', icon: 'bi-translate', desc: 'Bone, joint, and muscle health' },
    { name: 'General Medicine', icon: 'bi-capsule', desc: 'General health and diagnostic services' },
  ];

  return (
    <div className="container py-5 fade-in">
      {/* Hero Section */}
      <div className="row align-items-center justify-content-between g-5 py-4 mb-5">
        <div className="col-lg-6">
          <span className="badge bg-info text-dark px-3 py-2 rounded-pill mb-3 fw-bold tracking-wider text-uppercase">
            <i className="bi bi-shield-fill-plus me-2"></i>Virtual Healthcare Scheduling
          </span>
          <h1 className="display-4 fw-bold mb-3 text-white leading-tight">
            Your Health Is Our <span className="text-info">Primary Specialization</span>
          </h1>
          <p className="lead text-muted mb-4 fs-5">
            Connect instantly with board-certified clinical specialists. Schedule online appointments, manage medical logs, and get approved care plans—all from our secure patient workspace.
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <Link to="/doctors" className="btn btn-primary-glass px-4 py-3 fs-6 d-flex align-items-center gap-2">
              <i className="bi bi-search"></i> Find Approved Doctors
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-secondary-glass px-4 py-3 fs-6 d-flex align-items-center gap-2">
                Join As Patient <i className="bi bi-arrow-right"></i>
              </Link>
            )}
          </div>
        </div>
        <div className="col-lg-5 text-center position-relative">
          {/* Glass Card graphic design */}
          <div className="glass-panel p-5 position-relative z-index-2 animate-glow">
            <div className="rounded-circle bg-info bg-opacity-10 p-4 mx-auto mb-4 d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px' }}>
              <i className="bi bi-heart-pulse-fill text-info display-4"></i>
            </div>
            <h3 className="h4 text-white fw-bold mb-2">Secure Online Bookings</h3>
            <p className="text-muted small">
              Consult doctors virtually or schedule standard clinical appointments in under 3 minutes.
            </p>
            <div className="d-flex justify-content-around mt-4 pt-3 border-top border-secondary border-opacity-20">
              <div>
                <h5 className="text-info fw-bold mb-0">15+</h5>
                <small className="text-muted text-uppercase fs-8">Specialties</small>
              </div>
              <div className="vr bg-secondary opacity-25"></div>
              <div>
                <h5 className="text-info fw-bold mb-0">100%</h5>
                <small className="text-muted text-uppercase fs-8">Verified Docs</small>
              </div>
              <div className="vr bg-secondary opacity-25"></div>
              <div>
                <h5 className="text-info fw-bold mb-0">24/7</h5>
                <small className="text-muted text-uppercase fs-8">Online Setup</small>
              </div>
            </div>
          </div>
          {/* Background glowing blur sphere */}
          <div
            className="position-absolute rounded-circle bg-info bg-opacity-10"
            style={{
              width: '300px',
              height: '300px',
              top: '-50px',
              right: '-50px',
              filter: 'blur(80px)',
              zIndex: 1,
            }}
          ></div>
        </div>
      </div>

      {/* Specialties Grid */}
      <div className="my-5 py-4">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-white">Browse By Specialization</h2>
          <p className="text-muted">Direct bookings with specialized clinical consultants</p>
        </div>
        <div className="row g-4">
          {specializations.map((spec, idx) => (
            <div className="col-md-4 col-sm-6" key={idx}>
              <Link
                to={`/doctors?specialization=${spec.name}`}
                className="text-decoration-none"
              >
                <div className="glass-card p-4 h-100 d-flex flex-column align-items-start text-start">
                  <div className="rounded bg-info bg-opacity-10 p-3 mb-3 text-info">
                    <i className={`bi ${spec.icon} fs-3`}></i>
                  </div>
                  <h4 className="h5 text-white fw-bold mb-2">{spec.name}</h4>
                  <p className="text-muted small mb-0">{spec.desc}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Banner Callout for Doctors */}
      <div className="glass-panel p-5 my-5 text-center position-relative overflow-hidden border-info border-opacity-10">
        <div className="position-relative z-index-2 py-3">
          <h2 className="fw-bold text-white mb-3">Are You A Registered Healthcare Provider?</h2>
          <p className="text-muted max-width-600 mx-auto mb-4">
            Join our digital health grid. Create your scheduling availability dashboard, receive patient consultation requests, and coordinate clinical plans.
          </p>
          {!user && (
            <Link
              to="/register?role=doctor"
              className="btn btn-primary-glass px-4 py-3 fw-bold"
            >
              Register As Doctor Partner
            </Link>
          )}
        </div>
      </div>

      <style>{`
        .leading-tight {
          line-height: 1.25;
        }
        .max-width-600 {
          max-width: 600px;
        }
        .animate-glow {
          box-shadow: 0 0 40px 0 rgba(0, 242, 254, 0.05);
          transition: all 0.5s ease;
        }
        .animate-glow:hover {
          box-shadow: 0 0 50px 0 rgba(0, 242, 254, 0.15);
        }
        .fs-8 {
          font-size: 0.65rem;
        }
        .z-index-2 {
          z-index: 2;
        }
      `}</style>
    </div>
  );
};

export default Home;
