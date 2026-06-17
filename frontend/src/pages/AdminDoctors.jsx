import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';

const AdminDoctors = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected, all

  const toast = useToast();

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/doctors');
      setProfiles(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load doctor partner profiles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleUpdateStatus = async (id, status, name) => {
    try {
      const res = await API.put(`/admin/doctors/${id}/status`, { status });
      toast.success(res.data.message || `Doctor ${name} account status updated to ${status}.`);
      
      // Update local state
      setProfiles((prev) =>
        prev.map((prof) => (prof._id === id ? { ...prof, status } : prof))
      );
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update partner verification state.');
    }
  };

  const filteredProfiles = profiles.filter((prof) => {
    if (filter === 'all') return true;
    return prof.status === filter;
  });

  if (loading) {
    return <Spinner size="lg" message="Loading doctor profiles..." />;
  }

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-10">
        <h1 className="fw-bold text-white mb-0">Doctor Partner Approvals</h1>
        <span className="badge bg-secondary-glass px-3 py-2 border border-secondary border-opacity-20 text-white rounded">
          {profiles.length} Doctor Profiles
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="glass-panel p-2 mb-4 d-flex gap-2 flex-wrap">
        <button
          className={`btn px-3 py-2 small fw-bold ${
            filter === 'pending' ? 'btn-info text-dark' : 'btn-link text-muted text-decoration-none'
          }`}
          onClick={() => setFilter('pending')}
        >
          Pending Review ({profiles.filter((p) => p.status === 'pending').length})
        </button>
        <button
          className={`btn px-3 py-2 small fw-bold ${
            filter === 'approved' ? 'btn-info text-dark' : 'btn-link text-muted text-decoration-none'
          }`}
          onClick={() => setFilter('approved')}
        >
          Approved Profiles ({profiles.filter((p) => p.status === 'approved').length})
        </button>
        <button
          className={`btn px-3 py-2 small fw-bold ${
            filter === 'rejected' ? 'btn-info text-dark' : 'btn-link text-muted text-decoration-none'
          }`}
          onClick={() => setFilter('rejected')}
        >
          Rejected Requests ({profiles.filter((p) => p.status === 'rejected').length})
        </button>
        <button
          className={`btn px-3 py-2 small fw-bold ${
            filter === 'all' ? 'btn-info text-dark' : 'btn-link text-muted text-decoration-none'
          }`}
          onClick={() => setFilter('all')}
        >
          All Profiles
        </button>
      </div>

      {/* Profiles Grid or Table */}
      <div className="glass-panel p-4">
        {filteredProfiles.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-dark table-hover table-borderless align-middle mb-0">
              <thead>
                <tr className="text-muted border-bottom border-secondary border-opacity-15 small">
                  <th scope="col" className="py-3">Doctor</th>
                  <th scope="col" className="py-3">Specialty / Credentials</th>
                  <th scope="col" className="py-3">Exp / Fees</th>
                  <th scope="col" className="py-3">Biography Profile</th>
                  <th scope="col" className="py-3">Status</th>
                  <th scope="col" className="py-3 text-end">Action controls</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.map((p) => (
                  <tr key={p._id} className="border-bottom border-secondary border-opacity-5">
                    {/* Doctor contact */}
                    <td className="py-3">
                      <span className="fw-bold text-white d-block">{p.user?.name || 'Dr. Partner'}</span>
                      <small className="text-muted d-block">{p.user?.email}</small>
                      <small className="text-muted d-block">{p.user?.phone}</small>
                    </td>
                    {/* Specialty */}
                    <td className="py-3">
                      <span className="spec-badge mb-1 d-inline-block">{p.specialization}</span>
                      <small className="d-block text-muted text-truncate" style={{ maxWidth: '180px' }}>
                        {p.qualifications || 'No degrees listed'}
                      </small>
                    </td>
                    {/* Experience & Fees */}
                    <td className="py-3 small">
                      <span className="text-white fw-bold d-block">{p.experience} Years active</span>
                      <span className="text-info d-block">${p.fees} Fee</span>
                    </td>
                    {/* Biography */}
                    <td className="py-3">
                      <p className="text-muted small mb-0 text-wrap-clamp" style={{ maxWidth: '240px' }}>
                        {p.bio || 'Biography details are currently empty.'}
                      </p>
                    </td>
                    {/* Status Badge */}
                    <td className="py-3">
                      <span className={`status-badge status-${p.status}`}>
                        {p.status}
                      </span>
                    </td>
                    {/* Action controls */}
                    <td className="py-3 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        {p.status !== 'approved' && (
                          <button
                            className="btn btn-sm btn-success px-2.5 py-1.5"
                            onClick={() => handleUpdateStatus(p._id, 'approved', p.user?.name)}
                          >
                            <i className="bi bi-check-circle-fill me-1"></i> Approve
                          </button>
                        )}
                        {p.status !== 'rejected' && (
                          <button
                            className="btn btn-sm btn-outline-danger px-2.5 py-1.5"
                            onClick={() => handleUpdateStatus(p._id, 'rejected', p.user?.name)}
                          >
                            <i className="bi bi-x-circle-fill me-1"></i> Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="bi bi-journal-medical fs-1 text-muted mb-3 d-block"></i>
            <p className="text-muted small">No doctor profiles match the selected verification status.</p>
          </div>
        )}
      </div>

      <style>{`
        .text-wrap-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
};

export default AdminDoctors;
