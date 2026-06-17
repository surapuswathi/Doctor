import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, patient, doctor

  const toast = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to resolve users directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`WARNING: Are you sure you want to permanently delete user "${name}" and all associated booking histories? This action is irreversible.`)) {
      return;
    }

    try {
      await API.delete(`/admin/users/${id}`);
      toast.success(`User account "${name}" successfully purged.`);
      // Update local state
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to purge user.');
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filter === 'all') return true;
    return user.role === filter;
  });

  if (loading) {
    return <Spinner size="lg" message="Loading users directory..." />;
  }

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-10">
        <h1 className="fw-bold text-white mb-0">Users Directory Management</h1>
        <span className="badge bg-secondary-glass px-3 py-2 border border-secondary border-opacity-20 text-white rounded">
          {users.length} Registered Accounts
        </span>
      </div>

      {/* Directory Filter Toggle */}
      <div className="glass-panel p-2 mb-4 d-flex gap-2">
        <button
          className={`btn px-3 py-2 small fw-bold ${
            filter === 'all' ? 'btn-info text-dark' : 'btn-link text-muted text-decoration-none'
          }`}
          onClick={() => setFilter('all')}
        >
          All Users
        </button>
        <button
          className={`btn px-3 py-2 small fw-bold ${
            filter === 'patient' ? 'btn-info text-dark' : 'btn-link text-muted text-decoration-none'
          }`}
          onClick={() => setFilter('patient')}
        >
          Patients ({users.filter((u) => u.role === 'patient').length})
        </button>
        <button
          className={`btn px-3 py-2 small fw-bold ${
            filter === 'doctor' ? 'btn-info text-dark' : 'btn-link text-muted text-decoration-none'
          }`}
          onClick={() => setFilter('doctor')}
        >
          Doctors ({users.filter((u) => u.role === 'doctor').length})
        </button>
      </div>

      {/* Directory Table */}
      <div className="glass-panel p-4">
        {filteredUsers.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-dark table-hover table-borderless align-middle mb-0">
              <thead>
                <tr className="text-muted border-bottom border-secondary border-opacity-15 small">
                  <th scope="col" className="py-3">Name</th>
                  <th scope="col" className="py-3">Email Address</th>
                  <th scope="col" className="py-3">Phone</th>
                  <th scope="col" className="py-3">Account Role</th>
                  <th scope="col" className="py-3">Registered On</th>
                  <th scope="col" className="py-3 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="border-bottom border-secondary border-opacity-5">
                    <td className="py-3 fw-bold text-white">{u.name}</td>
                    <td className="py-3 text-muted small">{u.email}</td>
                    <td className="py-3 small">{u.phone || 'N/A'}</td>
                    <td className="py-3 text-capitalize">
                      <span
                        className={`badge ${
                          u.role === 'doctor'
                            ? 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20'
                            : 'bg-success bg-opacity-10 text-success border border-success border-opacity-20'
                        } px-2.5 py-1.5`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-muted small">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-end">
                      <button
                        className="btn btn-outline-danger btn-sm px-2.5 py-1.5"
                        onClick={() => handleDeleteUser(u._id, u.name)}
                      >
                        <i className="bi bi-trash3-fill me-1"></i> Delete User
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="bi bi-people fs-1 text-muted mb-3 d-block"></i>
            <p className="text-muted small">No accounts match the selected category filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
