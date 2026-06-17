import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await API.get('/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load system dashboard analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <Spinner size="lg" message="Compiling platform metrics..." />;
  }

  if (!stats) return null;

  return (
    <div className="fade-in">
      <div className="mb-4 pb-2 border-bottom border-secondary border-opacity-10">
        <h1 className="fw-bold text-white mb-0">Platform Overview Dashboard</h1>
        <p className="text-muted small">Monitor active metrics, user directories, and system bookings</p>
      </div>

      {/* Main Stats Row */}
      <div className="row g-4 mb-5">
        {/* Total Patients */}
        <div className="col-lg-3 col-sm-6">
          <div className="glass-card p-4 text-center">
            <div className="rounded-circle bg-success bg-opacity-10 p-3 mx-auto mb-3 text-success d-flex align-items-center justify-content-center" style={{ width: '55px', height: '55px' }}>
              <i className="bi bi-people-fill fs-4"></i>
            </div>
            <h5 className="text-muted small uppercase tracking-wider">Patients</h5>
            <h3 className="text-white fw-bold display-6 mb-0">{stats.totalPatients}</h3>
            <Link to="/admin/users" className="small text-info text-decoration-none mt-2 d-inline-block">
              Manage Users
            </Link>
          </div>
        </div>

        {/* Total Doctors */}
        <div className="col-lg-3 col-sm-6">
          <div className="glass-card p-4 text-center">
            <div className="rounded-circle bg-primary bg-opacity-10 p-3 mx-auto mb-3 text-primary d-flex align-items-center justify-content-center" style={{ width: '55px', height: '55px' }}>
              <i className="bi bi-person-badge-fill fs-4"></i>
            </div>
            <h5 className="text-muted small uppercase tracking-wider">Doctors</h5>
            <h3 className="text-white fw-bold display-6 mb-0">{stats.totalDoctors}</h3>
            <Link to="/admin/doctors" className="small text-info text-decoration-none mt-2 d-inline-block">
              Approve Partner Accounts
            </Link>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="col-lg-3 col-sm-6">
          <div className="glass-card p-4 text-center">
            <div className="rounded-circle bg-warning bg-opacity-10 p-3 mx-auto mb-3 text-warning d-flex align-items-center justify-content-center" style={{ width: '55px', height: '55px' }}>
              <i className="bi bi-hourglass-split fs-4"></i>
            </div>
            <h5 className="text-muted small uppercase tracking-wider">Pending Approvals</h5>
            <h3 className={`fw-bold display-6 mb-0 ${stats.pendingDoctors > 0 ? 'text-warning' : 'text-white'}`}>
              {stats.pendingDoctors}
            </h3>
            <Link to="/admin/doctors" className="small text-info text-decoration-none mt-2 d-inline-block">
              Audit Pending Accounts
            </Link>
          </div>
        </div>

        {/* Total Appointments */}
        <div className="col-lg-3 col-sm-6">
          <div className="glass-card p-4 text-center">
            <div className="rounded-circle bg-info bg-opacity-10 p-3 mx-auto mb-3 text-info d-flex align-items-center justify-content-center" style={{ width: '55px', height: '55px' }}>
              <i className="bi bi-journal-medical fs-4"></i>
            </div>
            <h5 className="text-muted small uppercase tracking-wider">Bookings Total</h5>
            <h3 className="text-white fw-bold display-6 mb-0">{stats.totalAppointments}</h3>
            <Link to="/admin/appointments" className="small text-info text-decoration-none mt-2 d-inline-block">
              Review Bookings
            </Link>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Booking Status Breakdown Chart Panel */}
        <div className="col-lg-7">
          <div className="glass-panel p-4 h-100">
            <h4 className="fw-bold text-white mb-4 pb-2 border-bottom border-secondary border-opacity-10">
              <i className="bi bi-pie-chart-fill text-info me-2"></i>Consultation Scheduling Breakdown
            </h4>

            <div className="d-flex flex-column gap-3">
              {/* Approved/Scheduled */}
              <div>
                <div className="d-flex justify-content-between mb-1 small">
                  <span className="text-white fw-500">Approved Consultations</span>
                  <span className="text-success fw-bold">{stats.statusBreakdown?.accepted || 0}</span>
                </div>
                <div className="progress bg-dark bg-opacity-40" style={{ height: '10px' }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{
                      width: `${
                        stats.totalAppointments > 0
                          ? ((stats.statusBreakdown?.accepted || 0) / stats.totalAppointments) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Pending Action */}
              <div>
                <div className="d-flex justify-content-between mb-1 small">
                  <span className="text-white fw-500">Pending Actions</span>
                  <span className="text-warning fw-bold">{stats.statusBreakdown?.pending || 0}</span>
                </div>
                <div className="progress bg-dark bg-opacity-40" style={{ height: '10px' }}>
                  <div
                    className="progress-bar bg-warning"
                    role="progressbar"
                    style={{
                      width: `${
                        stats.totalAppointments > 0
                          ? ((stats.statusBreakdown?.pending || 0) / stats.totalAppointments) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Rejected Requests */}
              <div>
                <div className="d-flex justify-content-between mb-1 small">
                  <span className="text-white fw-500">Rejected Requests</span>
                  <span className="text-danger fw-bold">{stats.statusBreakdown?.rejected || 0}</span>
                </div>
                <div className="progress bg-dark bg-opacity-40" style={{ height: '10px' }}>
                  <div
                    className="progress-bar bg-danger"
                    role="progressbar"
                    style={{
                      width: `${
                        stats.totalAppointments > 0
                          ? ((stats.statusBreakdown?.rejected || 0) / stats.totalAppointments) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Cancelled by Patient */}
              <div>
                <div className="d-flex justify-content-between mb-1 small">
                  <span className="text-white fw-500">Cancelled by Patients</span>
                  <span className="text-muted fw-bold">{stats.statusBreakdown?.cancelled || 0}</span>
                </div>
                <div className="progress bg-dark bg-opacity-40" style={{ height: '10px' }}>
                  <div
                    className="progress-bar bg-secondary"
                    role="progressbar"
                    style={{
                      width: `${
                        stats.totalAppointments > 0
                          ? ((stats.statusBreakdown?.cancelled || 0) / stats.totalAppointments) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Command Quick Actions */}
        <div className="col-lg-5">
          <div className="glass-panel p-4 h-100">
            <h4 className="fw-bold text-white mb-4 pb-2 border-bottom border-secondary border-opacity-10">
              <i className="bi bi-shield-lock-fill text-info me-2"></i>Control Shortcuts
            </h4>

            <div className="d-grid gap-3">
              <Link to="/admin/users" className="btn btn-secondary-glass py-3 text-start d-flex align-items-center gap-3">
                <i className="bi bi-people-fill fs-4 text-info"></i>
                <div>
                  <h6 className="mb-0 text-white fw-bold">Manage Users Directory</h6>
                  <small className="text-muted">Review, delete patient or doctor partner accounts</small>
                </div>
              </Link>

              <Link to="/admin/doctors" className="btn btn-secondary-glass py-3 text-start d-flex align-items-center gap-3">
                <i className="bi bi-patch-check-fill fs-4 text-info"></i>
                <div>
                  <h6 className="mb-0 text-white fw-bold">Approve Doctors Profile</h6>
                  <small className="text-muted">Review verification files and grant listings access</small>
                </div>
              </Link>

              <Link to="/admin/appointments" className="btn btn-secondary-glass py-3 text-start d-flex align-items-center gap-3">
                <i className="bi bi-journal-medical fs-4 text-info"></i>
                <div>
                  <h6 className="mb-0 text-white fw-bold">System Bookings Register</h6>
                  <small className="text-muted">Monitor scheduling loads and transaction logs</small>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
