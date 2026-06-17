import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const res = await API.get('/patients/appointments');
        setAppointments(res.data.data);
      } catch (err) {
        console.error('Failed to load appointments in dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const getStats = () => {
    const total = appointments.length;
    const pending = appointments.filter((a) => a.status === 'pending').length;
    const approved = appointments.filter((a) => a.status === 'accepted').length;
    return { total, pending, approved };
  };

  const stats = getStats();
  const recentAppointments = appointments.slice(0, 3); // Top 3 recent

  if (loading) {
    return <Spinner size="lg" message="Loading workspace stats..." />;
  }

  return (
    <div className="fade-in">
      {/* Greeting banner card */}
      <div className="glass-panel p-5 mb-4 position-relative overflow-hidden border-info border-opacity-10">
        <h1 className="fw-bold text-white mb-2">Welcome Back, {user?.name}!</h1>
        <p className="text-muted mb-0">
          Monitor your healthcare logs, schedule new appointments, or configure your profile preferences.
        </p>
      </div>

      {/* Stats row cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="glass-card p-4 text-center">
            <div className="rounded-circle bg-info bg-opacity-10 p-3 mx-auto mb-3 text-info d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
              <i className="bi bi-calendar-event fs-3"></i>
            </div>
            <h5 className="text-muted small uppercase tracking-wider">Total Bookings</h5>
            <h3 className="text-white fw-bold display-6 mb-0">{stats.total}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass-card p-4 text-center">
            <div className="rounded-circle bg-warning bg-opacity-10 p-3 mx-auto mb-3 text-warning d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
              <i className="bi bi-hourglass-split fs-3"></i>
            </div>
            <h5 className="text-muted small uppercase tracking-wider">Pending Approval</h5>
            <h3 className="text-white fw-bold display-6 mb-0">{stats.pending}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass-card p-4 text-center">
            <div className="rounded-circle bg-success bg-opacity-10 p-3 mx-auto mb-3 text-success d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
              <i className="bi bi-check-circle fs-3"></i>
            </div>
            <h5 className="text-muted small uppercase tracking-wider">Scheduled Active</h5>
            <h3 className="text-white fw-bold display-6 mb-0">{stats.approved}</h3>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Recent appointments catalog */}
        <div className="col-lg-8">
          <div className="glass-panel p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-10">
              <h4 className="fw-bold text-white mb-0"><i className="bi bi-clock-history me-2 text-info"></i>Recent Bookings</h4>
              <Link to="/patient/appointments" className="btn btn-sm btn-secondary-glass small">
                View All
              </Link>
            </div>

            {recentAppointments.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-dark table-hover table-borderless align-middle mb-0">
                  <thead>
                    <tr className="text-muted border-bottom border-secondary border-opacity-15 small">
                      <th scope="col" className="py-3">Doctor</th>
                      <th scope="col" className="py-3">Specialty</th>
                      <th scope="col" className="py-3">Schedule</th>
                      <th scope="col" className="py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAppointments.map((app) => (
                      <tr key={app._id} className="border-bottom border-secondary border-opacity-5">
                        <td className="py-3 fw-bold text-white">{app.doctor?.name}</td>
                        <td className="py-3"><span className="spec-badge">{app.doctor?.specialization || 'Clinical'}</span></td>
                        <td className="py-3">
                          <span className="d-block small text-white">{new Date(app.date).toLocaleDateString()}</span>
                          <small className="text-muted">{app.timeSlot}</small>
                        </td>
                        <td className="py-3">
                          <span className={`status-badge status-${app.status}`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-calendar-x fs-1 text-muted mb-3 d-block"></i>
                <p className="text-muted small mb-4">No appointment booking history found.</p>
                <Link to="/doctors" className="btn btn-primary-glass">
                  Schedule First Appointment
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions panel */}
        <div className="col-lg-4">
          <div className="glass-panel p-4 h-100">
            <h4 className="fw-bold text-white mb-4 pb-2 border-bottom border-secondary border-opacity-10">
              <i className="bi bi-lightning-fill text-info me-2"></i>Quick Actions
            </h4>
            <div className="d-grid gap-3">
              <Link to="/doctors" className="btn btn-primary-glass py-3 d-flex align-items-center justify-content-center gap-2 text-start">
                <i className="bi bi-search fs-5"></i>
                <span>Find & Book Doctor</span>
              </Link>
              <Link to="/patient/appointments" className="btn btn-secondary-glass py-3 d-flex align-items-center justify-content-center gap-2 text-start">
                <i className="bi bi-calendar2-check fs-5"></i>
                <span>My Appointments</span>
              </Link>
              <Link to="/patient/profile" className="btn btn-secondary-glass py-3 d-flex align-items-center justify-content-center gap-2 text-start">
                <i className="bi bi-person-bounding-box fs-5"></i>
                <span>Manage Profile Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
