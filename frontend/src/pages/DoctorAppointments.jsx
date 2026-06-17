import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, active, all
  
  // Interactive Drawer review state
  const [activeReviewId, setActiveReviewId] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  const toast = useToast();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await API.get('/doctors/appointments');
      setAppointments(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load incoming appointment queries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      setSubmittingAction(true);
      await API.put(`/doctors/appointments/${id}`, {
        status,
        doctorNotes: reviewNotes,
      });

      toast.success(`Appointment booking successfully ${status}!`);
      
      // Update local state
      setAppointments((prev) =>
        prev.map((app) =>
          app._id === id
            ? { ...app, status, doctorNotes: reviewNotes }
            : app
        )
      );

      // Reset review drawer
      setActiveReviewId(null);
      setReviewNotes('');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update appointment status.');
    } finally {
      setSubmittingAction(false);
    }
  };

  const getAge = (dobString) => {
    if (!dobString) return 'N/A';
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredAppointments = appointments.filter((app) => {
    if (filter === 'pending') return app.status === 'pending';
    if (filter === 'active') return app.status === 'accepted';
    return true; // all history
  });

  if (loading) {
    return <Spinner size="lg" message="Loading appointment queries..." />;
  }

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-10">
        <h1 className="fw-bold text-white mb-0">Patient Consultations Panel</h1>
        <span className="badge bg-secondary-glass px-3 py-2 border border-secondary border-opacity-20 text-white rounded">
          {appointments.length} Total Queries
        </span>
      </div>

      {/* Tabs Filter */}
      <div className="glass-panel p-2 mb-4 d-flex gap-2 flex-wrap">
        <button
          className={`btn px-3 py-2 small fw-bold ${
            filter === 'pending' ? 'btn-info text-dark' : 'btn-link text-muted text-decoration-none'
          }`}
          onClick={() => {
            setFilter('pending');
            setActiveReviewId(null);
          }}
        >
          Pending Requests ({appointments.filter((a) => a.status === 'pending').length})
        </button>
        <button
          className={`btn px-3 py-2 small fw-bold ${
            filter === 'active' ? 'btn-info text-dark' : 'btn-link text-muted text-decoration-none'
          }`}
          onClick={() => {
            setFilter('active');
            setActiveReviewId(null);
          }}
        >
          Approved Appointments ({appointments.filter((a) => a.status === 'accepted').length})
        </button>
        <button
          className={`btn px-3 py-2 small fw-bold ${
            filter === 'all' ? 'btn-info text-dark' : 'btn-link text-muted text-decoration-none'
          }`}
          onClick={() => {
            setFilter('all');
            setActiveReviewId(null);
          }}
        >
          All Logs History
        </button>
      </div>

      {/* Appointment requests list */}
      {filteredAppointments.length > 0 ? (
        <div className="row g-4">
          {filteredAppointments.map((app) => (
            <div className="col-12" key={app._id}>
              <div className="glass-card p-4">
                <div className="row g-3 align-items-start">
                  {/* Patient Info */}
                  <div className="col-md-3">
                    <small className="text-muted text-uppercase d-block mb-1 fs-8">Patient Details</small>
                    <h5 className="text-white fw-bold mb-1">{app.patient?.name}</h5>
                    <p className="text-muted small mb-0">
                      Age: <span className="text-white fw-bold">{getAge(app.patient?.dob)}</span> ({app.patient?.gender || 'Other'})
                    </p>
                    <div className="text-muted small mt-2">
                      <p className="mb-0">
                        <i className="bi bi-telephone me-2 text-info"></i>
                        {app.patient?.phone || 'No phone'}
                      </p>
                      <p className="mb-0">
                        <i className="bi bi-envelope me-2 text-info"></i>
                        {app.patient?.email || 'No email'}
                      </p>
                    </div>
                  </div>

                  {/* Consultation Specifics */}
                  <div className="col-md-5">
                    <div className="mb-2">
                      <span className="text-muted small text-uppercase d-block mb-1">Requested Schedule</span>
                      <span className="text-white fw-bold">
                        <i className="bi bi-calendar-event text-info me-2"></i>
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
                      <span className="text-muted small text-uppercase d-block mb-1">Symptoms Description</span>
                      <p className="text-white bg-dark bg-opacity-10 p-2.5 rounded border border-secondary border-opacity-5 small mb-0 font-italic">
                        "{app.symptoms}"
                      </p>
                    </div>

                    {app.doctorNotes && app.status !== 'pending' && (
                      <div className="p-3 bg-dark bg-opacity-30 rounded border border-secondary border-opacity-10 mt-3">
                        <span className="text-info small fw-bold d-block mb-1">Your Consultation Notes</span>
                        <p className="text-muted small mb-0 font-italic">
                          "{app.doctorNotes}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions & Status Columns */}
                  <div className="col-md-4 text-md-end d-flex flex-column align-items-md-end justify-content-between h-100 mt-2 mt-md-0">
                    <span className={`status-badge status-${app.status} px-3 py-2 mb-3`}>
                      {app.status}
                    </span>

                    {/* Show quick review actions for pending bookings */}
                    {app.status === 'pending' && activeReviewId !== app._id && (
                      <button
                        className="btn btn-primary-glass d-flex align-items-center gap-2"
                        onClick={() => {
                          setActiveReviewId(app._id);
                          setReviewNotes(app.doctorNotes || '');
                        }}
                      >
                        <i className="bi bi-pencil-square"></i> Review Request
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Review notes drawer */}
                {activeReviewId === app._id && (
                  <div className="mt-4 pt-3 border-top border-secondary border-opacity-10 fade-in">
                    <h5 className="h6 text-info mb-3">Consultation Review & Notes</h5>
                    <div className="mb-3">
                      <label htmlFor={`review-notes-${app._id}`} className="form-label text-muted small">
                        Provide consultation advice, prescription guidelines, or reason for rejection:
                      </label>
                      <textarea
                        id={`review-notes-${app._id}`}
                        className="form-control glass-form-control"
                        rows="2"
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="e.g. Approved. Please join the telemedicine link 5 minutes prior to slot. Bring records."
                      ></textarea>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                      <button
                        className="btn btn-secondary-glass btn-sm px-3"
                        onClick={() => setActiveReviewId(null)}
                        disabled={submittingAction}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-danger btn-sm px-3"
                        onClick={() => handleUpdateStatus(app._id, 'rejected')}
                        disabled={submittingAction}
                      >
                        Reject Request
                      </button>
                      <button
                        className="btn btn-success btn-sm px-3"
                        onClick={() => handleUpdateStatus(app._id, 'accepted')}
                        disabled={submittingAction}
                      >
                        Approve & Accept
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-5 text-center my-4">
          <i className="bi bi-calendar-x display-4 text-info mb-3"></i>
          <h3 className="h4 text-white fw-bold">No Records Found</h3>
          <p className="text-muted max-width-600 mx-auto">
            You don't have any appointments matching the selected filter status.
          </p>
        </div>
      )}

      <style>{`
        .fs-8 {
          font-size: 0.7rem;
        }
      `}</style>
    </div>
  );
};

export default DoctorAppointments;
