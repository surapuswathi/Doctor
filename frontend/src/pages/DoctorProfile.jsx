import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const DoctorProfile = () => {
  const { user, doctorProfile, updateDoctorProfile } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    dob: '',
    address: '',
    specialization: '',
    experience: '0',
    fees: '0',
    qualifications: '',
    bio: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Sync profile details on mount or context change
  useEffect(() => {
    if (user && doctorProfile) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        gender: user.gender || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        address: user.address || '',
        specialization: doctorProfile.specialization || '',
        experience: String(doctorProfile.experience || 0),
        fees: String(doctorProfile.fees || 0),
        qualifications: doctorProfile.qualifications || '',
        bio: doctorProfile.bio || '',
      });
    }
  }, [user, doctorProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validations
    if (!formData.name.trim()) {
      toast.warning('Full Name is required');
      return;
    }
    if (!formData.specialization) {
      toast.warning('Specialization is required');
      return;
    }
    if (isNaN(Number(formData.experience)) || Number(formData.experience) < 0) {
      toast.warning('Experience must be a positive number');
      return;
    }
    if (isNaN(Number(formData.fees)) || Number(formData.fees) < 0) {
      toast.warning('Fees must be a positive number');
      return;
    }
    if (!formData.qualifications.trim()) {
      toast.warning('Qualifications are required');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        experience: Number(formData.experience),
        fees: Number(formData.fees),
      };

      const res = await updateDoctorProfile(payload);
      if (res.success) {
        toast.success('Doctor profile updated successfully!');
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

  const specializationsList = [
    'Cardiologist',
    'Pediatrician',
    'Dermatologist',
    'Neurologist',
    'Orthopedic',
    'General Medicine',
  ];

  return (
    <div className="fade-in">
      <div className="mb-4 pb-2 border-bottom border-secondary border-opacity-10">
        <h1 className="fw-bold text-white mb-0">Professional Profile Settings</h1>
        <p className="text-muted small">Update your clinical records, consultation terms, and details</p>
      </div>

      <div className="row">
        <div className="col-lg-9 col-12">
          <form onSubmit={handleSubmit}>
            {/* Core credentials section */}
            <div className="glass-panel p-4 mb-4">
              <h3 className="h5 text-info fw-bold mb-4">
                <i className="bi bi-person-circle me-2"></i>Account & Identity
              </h3>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="name" className="form-label text-white fw-500">
                    Full Name (with title)
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control glass-form-control"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Jane Doe"
                    required
                  />
                </div>

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
                </div>
              </div>

              <div className="row">
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
                  />
                </div>

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

                <div className="col-md-12 mb-2">
                  <label htmlFor="address" className="form-label text-white fw-500">
                    Clinic Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    className="form-control glass-form-control"
                    rows="2"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter clinical office room, building, street, and city"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Medical credentials section */}
            <div className="glass-panel p-4 mb-4">
              <h3 className="h5 text-info fw-bold mb-4">
                <i className="bi bi-mortarboard-fill me-2"></i>Clinical Parameters & Fees
              </h3>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label htmlFor="specialization" className="form-label text-white fw-500">
                    Specialization
                  </label>
                  <select
                    id="specialization"
                    name="specialization"
                    className="form-select glass-form-control"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Specialization</option>
                    {specializationsList.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="experience" className="form-label text-white fw-500">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    id="experience"
                    name="experience"
                    className="form-control glass-form-control"
                    value={formData.experience}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="fees" className="form-label text-white fw-500">
                    Consultation Fees ($)
                  </label>
                  <input
                    type="number"
                    id="fees"
                    name="fees"
                    className="form-control glass-form-control"
                    value={formData.fees}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 mb-3">
                  <label htmlFor="qualifications" className="form-label text-white fw-500">
                    Qualifications & Degrees
                  </label>
                  <input
                    type="text"
                    id="qualifications"
                    name="qualifications"
                    className="form-control glass-form-control"
                    value={formData.qualifications}
                    onChange={handleChange}
                    placeholder="e.g. MBBS, MD Internal Medicine, FRCP"
                    required
                  />
                </div>

                <div className="col-md-12 mb-2">
                  <label htmlFor="bio" className="form-label text-white fw-500">
                    Professional Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="form-control glass-form-control"
                    rows="4"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Share clinical achievements, consulting approaches, or board affiliations..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="d-flex justify-content-end mb-5">
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
