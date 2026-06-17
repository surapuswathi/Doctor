import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../services/api';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';

const DoctorsListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSpecialization = searchParams.get('specialization') || '';

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState(initialSpecialization);

  const toast = useToast();

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (specialization) params.specialization = specialization;

      const res = await API.get('/patients/doctors', { params });
      setDoctors(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load doctors catalog.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctors on mount or query updates
  useEffect(() => {
    fetchDoctors();
  }, [specialization]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleClearFilters = () => {
    setSearch('');
    setSpecialization('');
    setSearchParams({});
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
    <div className="container py-5 fade-in">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-white mb-2">Find Clinical Specialists</h1>
        <p className="text-muted">Browse verified medical partners and schedule virtual consultations</p>
      </div>

      {/* Search & Filter Header Panel */}
      <div className="glass-panel p-4 mb-5">
        <form onSubmit={handleSearchSubmit} className="row g-3 align-items-center">
          {/* Search Text Input */}
          <div className="col-lg-5 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-dark bg-opacity-30 border-secondary border-opacity-10 text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control glass-form-control"
                placeholder="Search by doctor name or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Specialization Filter Dropdown */}
          <div className="col-lg-3 col-md-3">
            <select
              className="form-select glass-form-control"
              value={specialization}
              onChange={(e) => {
                setSpecialization(e.target.value);
                setSearchParams(e.target.value ? { specialization: e.target.value } : {});
              }}
            >
              <option value="">All Specializations</option>
              {specializationsList.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Search Button */}
          <div className="col-lg-2 col-md-3 d-grid">
            <button type="submit" className="btn btn-primary-glass fw-bold">
              Search
            </button>
          </div>

          {/* Reset Filters Link */}
          <div className="col-lg-2 col-md-12 text-center text-lg-start">
            {(search || specialization) && (
              <button
                type="button"
                className="btn btn-link text-info text-decoration-none fw-bold small p-0"
                onClick={handleClearFilters}
              >
                <i className="bi bi-x-circle me-1"></i> Clear Filters
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Doctors Grid Catalog */}
      {loading ? (
        <Spinner size="lg" message="Loading doctor catalog..." />
      ) : doctors.length > 0 ? (
        <div className="row g-4">
          {doctors.map((doctor) => (
            <div className="col-lg-4 col-md-6" key={doctor._id}>
              <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  {/* Doctor User details */}
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="rounded-circle bg-info bg-opacity-10 p-2 d-flex align-items-center justify-content-center text-info"
                      style={{ width: '50px', height: '50px' }}
                    >
                      <i className="bi bi-person-badge-fill fs-3"></i>
                    </div>
                    <div>
                      <h4 className="h5 text-white fw-bold mb-0">
                        {doctor.user?.name || 'Doctor Partner'}
                      </h4>
                      <span className="spec-badge mt-1 d-inline-block">
                        {doctor.specialization}
                      </span>
                    </div>
                  </div>

                  <p className="text-muted small text-clamp mb-3">
                    {doctor.bio || 'No biography details provided by doctor partner.'}
                  </p>

                  <div className="row g-2 border-top border-secondary border-opacity-10 pt-3 mb-4">
                    <div className="col-6">
                      <small className="text-muted d-block uppercase fs-8">Experience</small>
                      <span className="text-white fw-bold">{doctor.experience} Years</span>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block uppercase fs-8">Consultation Fee</small>
                      <span className="text-info fw-bold">${doctor.fees}</span>
                    </div>
                  </div>
                </div>

                <div className="d-grid mt-auto">
                  <Link
                    to={`/doctors/${doctor.user?._id || doctor._id}`}
                    className="btn btn-secondary-glass d-flex align-items-center justify-content-center gap-2"
                  >
                    View Slots & Book <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-5 text-center my-4">
          <i className="bi bi-emoji-frown display-4 text-info mb-3"></i>
          <h3 className="h4 text-white fw-bold">No Specialists Found</h3>
          <p className="text-muted max-width-600 mx-auto mb-4">
            We couldn't find any approved doctors matching your current query. Try adjusting your specialization filter or search term.
          </p>
          <button className="btn btn-primary-glass" onClick={handleClearFilters}>
            Browse All Active Doctors
          </button>
        </div>
      )}

      <style>{`
        .text-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .max-width-600 {
          max-width: 600px;
        }
        .fs-8 {
          font-size: 0.7rem;
        }
      `}</style>
    </div>
  );
};

export default DoctorsListing;
