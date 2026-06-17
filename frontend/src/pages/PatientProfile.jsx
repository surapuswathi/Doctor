import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const PatientProfile = () => {
  const { user, updatePatientProfile } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    dob: '',
    address: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Sync profile details on mount or user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        gender: user.gender || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.warning('Full Name is required');
      return;
    }

    try {
      setSubmitting(true);
      const res = await updatePatientProfile(formData);
      if (res.success) {
        toast.success('Profile details updated successfully!');
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to save profile changes.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="mb-4 pb-2 border-bottom border-secondary border-opacity-10">
        <h1 className="fw-bold text-white mb-0">Patient Profile Settings</h1>
        <p className="text-muted small">Update your personal credentials and contact settings</p>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="glass-panel p-5">
            <h3 className="h5 text-info fw-bold mb-4">
              <i className="bi bi-person-circle me-2"></i>Personal Credentials
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Full Name */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="name" className="form-label text-white fw-500">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control glass-form-control"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                {/* Email (Read only) */}
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted fw-500">
                    Email Address (Account ID)
                  </label>
                  <input
                    type="email"
                    className="form-control glass-form-control text-muted"
                    value={user?.email || ''}
                    disabled
                    style={{ cursor: 'not-allowed', opacity: 0.6 }}
                  />
                  <small className="text-muted fs-8 mt-1 d-block">
                    Account email address cannot be changed.
                  </small>
                </div>
              </div>

              <div className="row">
                {/* Phone */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="phone" className="form-label text-white fw-500">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control glass-form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter contact number"
                  />
                </div>

                {/* Gender */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="gender" className="form-label text-white fw-500">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    className="form-select glass-form-control"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="row">
                {/* Date of Birth */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="dob" className="form-label text-white fw-500">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    className="form-control glass-form-control"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>

                {/* Address */}
                <div className="col-md-12 mb-4">
                  <label htmlFor="address" className="form-label text-white fw-500">
                    Residential Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    className="form-control glass-form-control"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your street address, city, and state"
                  ></textarea>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary-glass px-5 py-2.5 fw-bold"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm text-dark me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <span>Save Profile Details</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar help tips */}
        <div className="col-lg-4 mt-4 mt-lg-0">
          <div className="glass-panel p-4">
            <h5 className="text-info fw-bold mb-3">
              <i className="bi bi-info-circle-fill me-2"></i>Profile Privacy
            </h5>
            <p className="text-muted small leading-relaxed mb-0">
              Your contact details (Phone, Address, and Date of Birth) are stored securely and will only be shared with doctor partners when you schedule active consultations with them.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .fs-8 {
          font-size: 0.7rem;
        }
        .leading-relaxed {
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default PatientProfile;
