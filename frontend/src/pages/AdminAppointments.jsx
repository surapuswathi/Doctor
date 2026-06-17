import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected, cancelled

  const toast = useToast();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/appointments');
      setAppointments(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load system appointments logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((app) => {
    if (filter === 'all') return true;
    return app.status.toLowerCase() === filter.toLowerCase();
  });

  if (loading) {
    return <Spinner size="lg" message="Loading transaction logs..." />;
  }

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-10">
        <h1 className="fw-bold text-white mb-0">System Bookings Registry</h1>
        <span className="badge bg-secondary-glass px-3 py-2 border border-secondary border-opacity-20 text-white rounded">
          {appointments.length} Total Logs
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="glass-panel p-2 mb-4 d-flex gap-2 flex-wrap">
        {['all', 'pending', 'accepted', 'rejected', 'cancelled'].map((tab) => (
          <button
            key={tab}
            className={`btn px-3 py-2 text-capitalize small fw-bold ${
              filter === tab
                ? 'btn-info text-dark'
                : 'btn-link text-muted text-decoration-none'
            }`}
            onClick={() => setFilter(tab)}
          >
            {tab === 'accepted' ? 'approved' : tab}
          </button>
        ))}
      </div>

      {/* Bookings registry panel */}
      <div className="glass-panel p-4">
        {filteredAppointments.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-dark table-hover table-borderless align-middle mb-0">
              <thead>
                <tr className="text-muted border-bottom border-secondary border-opacity-15 small">
                  <th scope="col" className="py-3">Patient</th>
                  <th scope="col" className="py-3">Doctor / Specialty</th>
                  <th scope="col" className="py-3">Date & Slot</th>
                  <th scope="col" className="py-3">Symptoms description</th>
                  <th scope="col" className="py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((app) => (
                  <tr key={app._id} className="border-bottom border-secondary border-opacity-5">
                    {/* Patient */}
                    <td className="py-3">
                      <span className="fw-bold text-white d-block">{app.patient?.name || 'Deleted Account'}</span>
                      <small className="text-muted d-block">{app.patient?.email}</small>
                    </td>
                    {/* Doctor */}
                    <td className="py-3">
                      <span className="fw-bold text-white d-block">{app.doctor?.name || 'Deleted Partner'}</span>
                      <span className="spec-badge mt-1 d-inline-block">
                        {app.doctor?.specialization || 'Clinical'}
                      </span>
                    </td>
                    {/* Date */}
                    <td className="py-3 small text-white">
                      <span className="d-block fw-bold">
                        {new Date(app.date).toLocaleDateString()}
                      </span>
                      <small className="text-info fw-bold">{app.timeSlot}</small>
                    </td>
                    {/* Symptoms */}
                    <td className="py-3">
                      <p
                        className="text-muted small mb-0 text-truncate font-italic"
                        style={{ maxWidth: '240px' }}
                        title={app.symptoms}
                      >
                        "{app.symptoms}"
                      </p>
                    </td>
                    {/* Status badge */}
                    <td className="py-3">
                      <span className={`status-badge status-${app.status} small`}>
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
            <i className="bi bi-journal-x fs-1 text-muted mb-3 d-block"></i>
            <p className="text-muted small">No scheduled bookings found matching this status.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAppointments;
