import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const DoctorDashboard = () => {
  const { user, doctorProfile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const res = await API.get('/doctors/appointments');
        setAppointments(res.data.data);
      } catch (err) {
        console.error('Failed to load doctor appointments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const getStats = () => {
    const total = appointments.length;
    const pending = appointments.filter((a) => a.status === 'pending').length;
    const active = appointments.filter((a) => a.status === 'accepted').length;
    return { total, pending, active };
  };

  const stats = getStats();
  const recentBookings = appointments.slice(0, 3);

  const getStatusAlert = () => {
    if (!doctorProfile) return null;

    if (doctorProfile.status === 'pending') {
      return (
        <div className="alert alert-warning bg-warning bg-opacity-10 border-warning border-opacity-20 text-warning p-4 mb-4 rounded fade-in d-flex gap-3 align-items-center">
          <i className="bi bi-hourglass-split display-6"></i>
          <div>
            <h5 className="alert-heading fw-bold mb-1">Account Approval Pending</h5>
            <p className="mb-0 small">
              Your doctor account is currently undergoing administrator verification. You will not show up in the patient catalog directory or be able to receive booking queries until approved.
            </p>
          </div>
        </div>
      );
    }

    if (doctorProfile.status === 'rejected') {
      return (
        <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-20 text-danger p-4 mb-4 rounded fade-in d-flex gap-3 align-items-center">
          <i className="bi bi-exclamation-octagon-fill display-6"></i>
          <div>
            <h5 className="alert-heading fw-bold mb-1">Account Request Rejected</h5>
            <p className="mb-0 small">
              Your partner account was rejected by the platform administrator. Please audit your credentials and biography details in the Profile tab.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="alert alert-success bg-success bg-opacity-10 border-success border-opacity-20 text-success p-4 mb-4 rounded fade-in d-flex gap-3 align-items-center">
        <i className="bi bi-check-circle-fill display-6"></i>
        <div>
          <h5 className="alert-heading fw-bold mb-1">Account Verified & Active</h5>
          <p className="mb-0 small">
            Your clinical profile is fully approved and searchable by patients. You can configure your weekly booking slots inside the Availability dashboard tab.
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return <Spinner size="lg" message="Loading workspace stats..." />;
  }

  return (
    <div className="fade-in">
      {/* Welcome Message */}
      <div className="glass-panel p-5 mb-4 border-info border-opacity-10">
        <h1 className="fw-bold text-white mb-2">Welcome, {user?.name}!</h1>
        <p className="text-muted mb-0">
          Manage your schedule slots, accept/reject consultation requests, and audit patient histories.
        </p>
      </div>

      {/* Account Verification Warning Banner */}
      {getStatusAlert()}

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="glass-card p-4 text-center">
            <div className="rounded-circle bg-info bg-opacity-10 p-3 mx-auto mb-3 text-info d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
              <i className="bi bi-journal-check fs-3"></i>
            </div>
            <h5 className="text-muted small uppercase tracking-wider">Total Queries</h5>
            <h3 className="text-white fw-bold display-6 mb-0">{stats.total}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass-card p-4 text-center">
            <div className="rounded-circle bg-warning bg-opacity-10 p-3 mx-auto mb-3 text-warning d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
              <i className="bi bi-calendar-minus fs-3"></i>
            </div>
            <h5 className="text-muted small uppercase tracking-wider">Pending Requests</h5>
            <h3 className="text-white fw-bold display-6 mb-0">{stats.pending}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass-card p-4 text-center">
            <div className="rounded-circle bg-success bg-opacity-10 p-3 mx-auto mb-3 text-success d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
              <i className="bi bi-shield-check fs-3"></i>
            </div>
            <h5 className="text-muted small uppercase tracking-wider">Active Consultations</h5>
            <h3 className="text-white fw-bold display-6 mb-0">{stats.active}</h3>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Recent booking list */}
        <div className="col-lg-8">
          <div className="glass-panel p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-10">
              <h4 className="fw-bold text-white mb-0">
                <i className="bi bi-hourglass-split me-2 text-info"></i>Pending Booking Requests
              </h4>
              <Link to="/doctor/appointments" className="btn btn-sm btn-secondary-glass small">
                Manage All
              </Link>
            </div>

            {recentBookings.filter((a) => a.status === 'pending').length > 0 ? (
              <div className="table-responsive">
                <table className="table table-dark table-hover table-borderless align-middle mb-0">
                  <thead>
                    <tr className="text-muted border-bottom border-secondary border-opacity-15 small">
                      <th scope="col" className="py-3">Patient</th>
                      <th scope="col" className="py-3">Schedule Date</th>
                      <th scope="col" className="py-3">Slot</th>
                      <th scope="col" className="py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings
                      .filter((a) => a.status === 'pending')
                      .map((app) => (
                        <tr key={app._id} className="border-bottom border-secondary border-opacity-5">
                          <td className="py-3 fw-bold text-white">{app.patient?.name}</td>
                          <td className="py-3">
                            {new Date(app.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 text-info fw-bold">{app.timeSlot}</td>
                          <td className="py-3">
                            <Link to="/doctor/appointments" className="btn btn-sm btn-outline-info">
                              Verify & Action
                            </Link>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-clipboard-pulse fs-1 text-muted mb-3 d-block"></i>
                <p className="text-muted small">No pending appointment queries awaiting review.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick action items */}
        <div className="col-lg-4">
          <div className="glass-panel p-4 h-100">
            <h4 className="fw-bold text-white mb-4 pb-2 border-bottom border-secondary border-opacity-10">
              <i className="bi bi-sliders text-info me-2"></i>Quick Actions
            </h4>
            <div className="d-grid gap-3">
              <Link to="/doctor/appointments" className="btn btn-primary-glass py-3 d-flex align-items-center justify-content-center gap-2 text-start">
                <i className="bi bi-calendar-event fs-5"></i>
                <span>Review Appointments</span>
              </Link>
              <Link to="/doctor/availability" className="btn btn-secondary-glass py-3 d-flex align-items-center justify-content-center gap-2 text-start">
                <i className="bi bi-clock-history fs-5"></i>
                <span>Manage Availability Slots</span>
              </Link>
              <Link to="/doctor/profile" className="btn btn-secondary-glass py-3 d-flex align-items-center justify-content-center gap-2 text-start">
                <i className="bi bi-person-vcard fs-5"></i>
                <span>Edit Profile Bio</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
