import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const DoctorDetails = () => {
  const { id } = useParams(); // Doctor User ID
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking states
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [booking, setBooking] = useState(false);
  const [weekdayName, setWeekdayName] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/patients/doctors/${id}`);
        setDoctor(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load doctor profile. Check if doctor is approved.');
        navigate('/doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id, navigate]);

  // Handle slot updates when date changes
  useEffect(() => {
    if (!selectedDate || !doctor) {
      setAvailableSlots([]);
      setWeekdayName('');
      return;
    }

    const dateObj = new Date(selectedDate);
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const selectedDay = weekdays[dateObj.getUTCDay()]; // Use UTC to prevent timezone offsets shifting day
    setWeekdayName(selectedDay);

    // Find doctor availability for this weekday
    const daySchedule = doctor.availability?.find(
      (sched) => sched.day.toLowerCase() === selectedDay.toLowerCase()
    );

    if (daySchedule && daySchedule.slots.length > 0) {
      setAvailableSlots(daySchedule.slots);
      setSelectedSlot(''); // Reset selected slot
    } else {
      setAvailableSlots([]);
      setSelectedSlot('');
    }
  }, [selectedDate, doctor]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.warning('Please login or register to book an appointment.');
      navigate('/login', { state: { from: { pathname: `/doctors/${id}` } } });
      return;
    }

    if (user.role !== 'patient') {
      toast.error('Only patients are authorized to book appointments.');
      return;
    }

    if (!selectedDate) {
      toast.warning('Please select a valid date.');
      return;
    }

    if (!selectedSlot) {
      toast.warning('Please select a time slot.');
      return;
    }

    if (!symptoms.trim()) {
      toast.warning('Please provide description of symptoms.');
      return;
    }

    try {
      setBooking(true);
      await API.post('/patients/appointments', {
        doctorId: id,
        date: selectedDate,
        timeSlot: selectedSlot,
        symptoms,
      });

      toast.success('Appointment booked successfully! Wait for doctor approval.');
      navigate('/patient/appointments');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to book appointment.');
    } finally {
      setBooking(false);
    }
  };

  // Prevent selecting past dates
  const getMinDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  if (loading) {
    return (
      <div className="container py-5 mt-5">
        <Spinner size="lg" message="Fetching doctor details..." />
      </div>
    );
  }

  if (!doctor) return null;

  return (
    <div className="container py-5 fade-in">
      <div className="mb-4">
        <Link to="/doctors" className="btn btn-secondary-glass d-inline-flex align-items-center gap-2">
          <i className="bi bi-arrow-left"></i> Back to Listing
        </Link>
      </div>

      <div className="row g-5">
        {/* Doctor Info Panel */}
        <div className="col-lg-7">
          <div className="glass-panel p-5 h-100">
            <div className="d-flex align-items-center gap-4 mb-4">
              <div
                className="rounded-circle bg-info bg-opacity-10 p-3 d-flex align-items-center justify-content-center text-info"
                style={{ width: '80px', height: '80px' }}
              >
                <i className="bi bi-person-badge-fill display-5"></i>
              </div>
              <div>
                <h1 className="h2 text-white fw-bold mb-1">{doctor.user?.name}</h1>
                <span className="spec-badge fs-6">{doctor.specialization}</span>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="h5 text-info fw-bold mb-2">Qualifications</h3>
              <p className="text-white bg-dark bg-opacity-20 p-3 rounded border border-secondary border-opacity-10">
                {doctor.qualifications || 'MBBS / General Qualifications'}
              </p>
            </div>

            <div className="mb-4">
              <h3 className="h5 text-info fw-bold mb-2">Biography</h3>
              <p className="text-muted leading-relaxed">
                {doctor.bio || 'Biography details are currently empty for this practitioner.'}
              </p>
            </div>

            <div className="row g-3 border-top border-secondary border-opacity-10 pt-4 mt-2">
              <div className="col-sm-6">
                <div className="p-3 bg-dark bg-opacity-20 rounded border border-secondary border-opacity-10">
                  <small className="text-muted d-block text-uppercase fs-8">Experience</small>
                  <span className="text-white fw-bold fs-5">{doctor.experience} Years active</span>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-3 bg-dark bg-opacity-20 rounded border border-secondary border-opacity-10">
                  <small className="text-muted d-block text-uppercase fs-8">Consultation fees</small>
                  <span className="text-info fw-bold fs-5">${doctor.fees} USD</span>
                </div>
              </div>
            </div>

            {/* Display Weekly Slots Schedule */}
            <div className="mt-4 pt-3">
              <h3 className="h5 text-white fw-bold mb-3">Weekly Schedule availability</h3>
              {doctor.availability && doctor.availability.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {doctor.availability.map((sched, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-secondary bg-opacity-10 border border-secondary border-opacity-20 rounded text-center"
                      style={{ minWidth: '100px' }}
                    >
                      <span className="text-info fw-bold d-block small mb-1">{sched.day}</span>
                      <small className="text-muted">{sched.slots.length} Slots</small>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted small">No weekly availability schedule configured yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Booking Interactive Panel */}
        <div className="col-lg-5">
          <div className="glass-panel p-5">
            <h2 className="h4 text-white fw-bold mb-3 text-center">
              <i className="bi bi-calendar-plus text-info me-2"></i>Schedule Appointment
            </h2>
            <p className="text-muted small text-center mb-4">
              Select date to pull available slots. Enter symptoms to submit.
            </p>

            <form onSubmit={handleBookingSubmit}>
              {/* Date Input */}
              <div className="mb-3">
                <label htmlFor="booking-date" className="form-label text-white fw-500">
                  Choose Date
                </label>
                <input
                  type="date"
                  id="booking-date"
                  className="form-control glass-form-control"
                  min={getMinDateString()}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>

              {/* Slots List */}
              {selectedDate && (
                <div className="mb-3 fade-in">
                  <label className="form-label text-white fw-500">
                    Available Time Slots for <span className="text-info">{weekdayName}</span>
                  </label>
                  {availableSlots.length > 0 ? (
                    <div className="row g-2 max-height-slots overflow-y-auto">
                      {availableSlots.map((slot) => (
                        <div className="col-6" key={slot}>
                          <button
                            type="button"
                            className={`btn w-100 py-2 text-truncate small fw-bold ${
                              selectedSlot === slot
                                ? 'btn-info text-dark'
                                : 'btn-outline-secondary text-white bg-dark bg-opacity-25'
                            }`}
                            onClick={() => setSelectedSlot(slot)}
                          >
                            <i className="bi bi-clock me-1"></i> {slot}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-20 text-danger py-2 px-3 small rounded">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      Doctor is not available on {weekdayName}. Choose another date.
                    </div>
                  )}
                </div>
              )}

              {/* Symptoms */}
              <div className="mb-4">
                <label htmlFor="symptoms" className="form-label text-white fw-500">
                  Describe Symptoms
                </label>
                <textarea
                  id="symptoms"
                  className="form-control glass-form-control"
                  rows="3"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. Mild cough, headache, prescription renewal..."
                  required
                ></textarea>
              </div>

              {/* Action Buttons */}
              <button
                type="submit"
                className="btn btn-primary-glass w-100 py-2.5 fs-6 fw-bold"
                disabled={booking || (selectedDate && availableSlots.length === 0)}
              >
                {booking ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm text-dark me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span>Scheduling Booking...</span>
                  </>
                ) : (
                  <span>Book Appointment</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .leading-relaxed {
          line-height: 1.6;
        }
        .fs-8 {
          font-size: 0.7rem;
        }
        .max-height-slots {
          max-height: 200px;
        }
      `}</style>
    </div>
  );
};

export default DoctorDetails;
