import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'doctor' ? 'doctor' : 'patient';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: initialRole,
    // Doctor specific fields
    specialization: '',
    experience: '0',
    fees: '0',
    qualifications: '',
    bio: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Sync role if query parameter changes
  useEffect(() => {
    const queryRole = searchParams.get('role');
    if (queryRole === 'doctor' || queryRole === 'patient') {
      setFormData((prev) => ({ ...prev, role: queryRole }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear errors
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Full Name is required';
    if (!formData.email) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    }

    // Doctor specific checks
    if (formData.role === 'doctor') {
      if (!formData.specialization) {
        errors.specialization = 'Doctor specialization is required';
      }
      if (isNaN(Number(formData.experience)) || Number(formData.experience) < 0) {
        errors.experience = 'Experience must be a positive number';
      }
      if (isNaN(Number(formData.fees)) || Number(formData.fees) < 0) {
        errors.fees = 'Consultation fees must be a positive number';
      }
      if (!formData.qualifications) {
        errors.qualifications = 'Doctor qualifications list is required';
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.warning('Please correct the validation errors in the form.');
      return;
    }

    setSubmitting(true);
    // Prepare payload
    const payload = { ...formData };
    delete payload.confirmPassword;
    if (payload.role !== 'doctor') {
      // Delete doctor fields if patient role
      delete payload.specialization;
      delete payload.experience;
      delete payload.fees;
      delete payload.qualifications;
      delete payload.bio;
    } else {
      payload.experience = Number(payload.experience);
      payload.fees = Number(payload.fees);
    }

    const res = await register(payload);
    setSubmitting(false);

    if (res.success) {
      toast.success(
        payload.role === 'doctor'
          ? 'Registered successfully! Please wait for admin profile approval.'
          : 'Registered successfully!'
      );
      navigate(payload.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="container py-5 fade-in">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="glass-panel p-5">
            <div className="text-center mb-4">
              <i className="bi bi-heart-pulse-fill text-info display-5 shadow-glow mb-2"></i>
              <h2 className="fw-bold text-white mb-1">Join Book A Doctor</h2>
              <p className="text-muted small">Register as patient or healthcare partner</p>
            </div>

            {/* Role Select Button Group */}
            <div className="d-flex justify-content-center mb-4">
              <div className="btn-group w-50" role="group" aria-label="Role selector">
                <button
                  type="button"
                  className={`btn ${formData.role === 'patient' ? 'btn-info text-dark fw-bold' : 'btn-outline-info text-white'}`}
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'patient' }))}
                  style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}
                >
                  Patient
                </button>
                <button
                  type="button"
                  className={`btn ${formData.role === 'doctor' ? 'btn-info text-dark fw-bold' : 'btn-outline-info text-white'}`}
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'doctor' }))}
                  style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
                >
                  Doctor
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="row">
                {/* Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white fw-500" htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    className={`form-control glass-form-control ${formErrors.name ? 'is-invalid' : ''}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                  {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                </div>

                {/* Email */}
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white fw-500" htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    className={`form-control glass-form-control ${formErrors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    required
                  />
                  {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                </div>
              </div>

              <div className="row">
                {/* Phone */}
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white fw-500" htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    className={`form-control glass-form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter contact number"
                    required
                  />
                  {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
                </div>

                {/* Blank space or other fields? Let's add password fields below */}
                <div className="col-md-6 mb-3">
                  {/* Empty space for grid alignment or Gender */}
                  <label className="form-label text-white fw-500" htmlFor="gender">Gender (Optional)</label>
                  <select
                    className="form-select glass-form-control"
                    id="gender"
                    name="gender"
                    value={formData.gender || ''}
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
                {/* Password */}
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white fw-500" htmlFor="password">Password</label>
                  <input
                    type="password"
                    className={`form-control glass-form-control ${formErrors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    required
                  />
                  {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                </div>

                {/* Confirm Password */}
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white fw-500" htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    className={`form-control glass-form-control ${formErrors.confirmPassword ? 'is-invalid' : ''}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    required
                  />
                  {formErrors.confirmPassword && <div className="invalid-feedback">{formErrors.confirmPassword}</div>}
                </div>
              </div>

              {/* Conditional Doctor Form Section */}
              {formData.role === 'doctor' && (
                <div className="mt-4 pt-3 border-top border-secondary border-opacity-10 fade-in">
                  <h4 className="h5 text-info mb-3"><i className="bi bi-person-badge me-2"></i>Doctor Professional Information</h4>
                  
                  <div className="row">
                    {/* Specialization */}
                    <div className="col-md-4 mb-3">
                      <label className="form-label text-white fw-500" htmlFor="specialization">Specialization</label>
                      <select
                        className={`form-select glass-form-control ${formErrors.specialization ? 'is-invalid' : ''}`}
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Specialization</option>
                        <option value="Cardiologist">Cardiologist</option>
                        <option value="Pediatrician">Pediatrician</option>
                        <option value="Dermatologist">Dermatologist</option>
                        <option value="Neurologist">Neurologist</option>
                        <option value="Orthopedic">Orthopedic</option>
                        <option value="General Medicine">General Medicine</option>
                      </select>
                      {formErrors.specialization && <div className="invalid-feedback">{formErrors.specialization}</div>}
                    </div>

                    {/* Experience */}
                    <div className="col-md-4 mb-3">
                      <label className="form-label text-white fw-500" htmlFor="experience">Experience (Years)</label>
                      <input
                        type="number"
                        className={`form-control glass-form-control ${formErrors.experience ? 'is-invalid' : ''}`}
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        min="0"
                        required
                      />
                      {formErrors.experience && <div className="invalid-feedback">{formErrors.experience}</div>}
                    </div>

                    {/* Fees */}
                    <div className="col-md-4 mb-3">
                      <label className="form-label text-white fw-500" htmlFor="fees">Consultation Fees ($)</label>
                      <input
                        type="number"
                        className={`form-control glass-form-control ${formErrors.fees ? 'is-invalid' : ''}`}
                        id="fees"
                        name="fees"
                        value={formData.fees}
                        onChange={handleChange}
                        min="0"
                        required
                      />
                      {formErrors.fees && <div className="invalid-feedback">{formErrors.fees}</div>}
                    </div>
                  </div>

                  <div className="row">
                    {/* Qualifications */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label text-white fw-500" htmlFor="qualifications">Qualifications</label>
                      <input
                        type="text"
                        className={`form-control glass-form-control ${formErrors.qualifications ? 'is-invalid' : ''}`}
                        id="qualifications"
                        name="qualifications"
                        value={formData.qualifications}
                        onChange={handleChange}
                        placeholder="e.g. MBBS, MD Cardiology, MRCP"
                        required
                      />
                      {formErrors.qualifications && <div className="invalid-feedback">{formErrors.qualifications}</div>}
                    </div>

                    {/* Bio */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label text-white fw-500" htmlFor="bio">Professional Biography</label>
                      <textarea
                        className="form-control glass-form-control"
                        id="bio"
                        name="bio"
                        rows="3"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Share a short bio for patient profiles..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary-glass w-100 py-2.5 fs-6 mt-3 d-flex align-items-center justify-content-center gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm text-dark" role="status" aria-hidden="true"></span>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus-fill fs-5"></i>
                    <span>Register Now</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-4 pt-3 border-top border-secondary border-opacity-10">
              <p className="text-muted small mb-0">
                Already have an account?{' '}
                <Link to="/login" className="text-info text-decoration-none fw-bold">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
