import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to dashboard or previous location
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear errors as user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    const res = await login(formData.email, formData.password);
    setSubmitting(false);

    if (res.success) {
      toast.success('Successfully logged in!');
      navigate(from, { replace: true });
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="container py-5 mt-4 fade-in">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-8">
          <div className="glass-panel p-5">
            <div className="text-center mb-4">
              <i className="bi bi-heart-pulse-fill text-info display-5 shadow-glow mb-2"></i>
              <h2 className="fw-bold text-white mb-1">Welcome Back</h2>
              <p className="text-muted small">Login to manage your medical appointments</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Email Input */}
              <div className="mb-3">
                <label className="form-label text-white fw-500" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  className={`form-control glass-form-control ${
                    formErrors.email ? 'is-invalid border-danger' : ''
                  }`}
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                />
                {formErrors.email && (
                  <div className="invalid-feedback text-danger small mt-1">
                    {formErrors.email}
                  </div>
                )}
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label text-white fw-500 mb-0" htmlFor="password">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  className={`form-control glass-form-control ${
                    formErrors.password ? 'is-invalid border-danger' : ''
                  }`}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                {formErrors.password && (
                  <div className="invalid-feedback text-danger small mt-1">
                    {formErrors.password}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary-glass w-100 py-2.5 fs-6 mt-2 d-flex align-items-center justify-content-center gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm text-dark"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right fs-5"></i>
                    <span>Login</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-4 pt-3 border-top border-secondary border-opacity-10">
              <p className="text-muted small mb-0">
                Don't have an account?{' '}
                <Link to="/register" className="text-info text-decoration-none fw-bold">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .shadow-glow {
          filter: drop-shadow(0 0 5px hsla(var(--primary-hsl), 0.5));
        }
        .fw-500 {
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default Login;
