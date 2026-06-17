import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, cancelled, rejected

  const toast = useToast();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await API.get('/patients/appointments');
      setAppointments(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load appointments history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment booking?')) {
      return;
    }

    try {
      await API.put(`/patients/appointments/${id}/cancel`);
      toast.success('Appointment cancelled successfully.');
      // Update local state instead of re-fetching
      setAppointments((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: 'cancelled' } : app))
      );
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to cancel appointment.');
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    if (filter === 'all') return true;
    return app.status.toLowerCase() === filter.toLowerCase();
  });

  if (loading) {
    return <Spinner size="lg" message="Loading appointment records..." />;
  }

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-10">
        <h1 className="fw-bold text-white mb-0">My Appointment Bookings</h1>
        <span className="badge bg-secondary-glass px-3 py-2 border border-secondary border-opacity-20 text-white rounded">
          {appointments.length} Total
        </span>
      </div>

      {/* Filter Tabs Panel */}
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

      {/* Bookings List */}
      {filteredAppointments.length > 0 ? (
        <div className="row g-4">
          {filteredAppointments.map((app) => (
            <div className="col-12" key={app._id}>
              <div className="glass-card p-4">
                <div className="row g-3 align-items-start">
                  {/* Doctor Profile Details */}
                  <div className="col-md-3">
                    <h5 className="text-white fw-bold mb-1">{app.doctor?.name}</h5>
                    <span className="spec-badge mb-2 d-inline-block">
                      {app.doctor?.specialization || 'Clinical Specialist'}
                    </span>
                    <div className="text-muted small mt-2">
                      <p className="mb-0">
                        <i className="bi bi-telephone-fill me-2 text-info"></i>
                        {app.doctor?.phone || 'No phone'}
                      </p>
                      <p className="mb-0">
                        <i className="bi bi-envelope-fill me-2 text-info"></i>
                        {app.doctor?.email || 'No email'}
                      </p>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="col-md-5">
                    <div className="mb-2">
                      <span className="text-muted small text-uppercase d-block mb-1">
                        Schedule Date & Slot
                      </span>
                      <span className="text-white fw-bold">
                        <i className="bi bi-calendar3 text-info me-2"></i>
                        {new Date(app.date).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="badge bg-dark bg-opacity-40 border border-secondary border-opacity-20 ms-2 px-2.5 py-1.5 text-white">
                        <i className="bi bi-clock me-1 text-info"></i> {app.timeSlot}
                      </span>
                    </div>

                    <div className="mb-2">
                      <span className="text-muted small text-uppercase d-block mb-1">
                        Reported Symptoms
                      </span>
                      <p className="text-white small mb-0 font-italic">
                        "{app.symptoms}"
                      </p>
                    </div>

                    {app.doctorNotes && (
                      <div className="p-3 bg-dark bg-opacity-30 rounded border border-secondary border-opacity-10 mt-3">
                        <span className="text-info small fw-bold d-block mb-1">
                          <i className="bi bi-journal-medical me-1"></i> Doctor Consultation Notes
                        </span>
                        <p className="text-muted small mb-0 font-italic">
                          "{app.doctorNotes}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions & Status Badge */}
                  <div className="col-md-4 text-md-end d-flex flex-column justify-content-between h-100 align-items-md-end align-items-start mt-3 mt-md-0">
                    <span className={`status-badge status-${app.status} px-3 py-2 fs-6 mb-3`}>
                      {app.status}
                    </span>

                    {/* Patients can cancel pending or approved appointments */}
                    {['pending', 'accepted'].includes(app.status) && (
                      <button
                        className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2 mt-md-4"
                        onClick={() => handleCancelAppointment(app._id)}
                      >
                        <i className="bi bi-x-circle"></i> Cancel Appointment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-5 text-center my-4">
          <i className="bi bi-journal-x display-4 text-info mb-3"></i>
          <h3 className="h4 text-white fw-bold">No Bookings Found</h3>
          <p className="text-muted max-width-600 mx-auto">
            You don't have any appointments matching the selected status filter.
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
