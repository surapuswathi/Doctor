import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/Spinner';

const PRESET_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '01:00 PM',
  '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM',
  '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM',
];

const WEEKDAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
];

const DoctorAvailability = () => {
  const { doctorProfile, updateDoctorAvailability } = useAuth();
  const toast = useToast();

  const [activeDay, setActiveDay] = useState('Monday');
  const [schedule, setSchedule] = useState({}); // { Monday: ['09:00 AM', '10:00 AM'], Tuesday: [] }
  const [saving, setSaving] = useState(false);

  // Load schedule on mount or doctorProfile changes
  useEffect(() => {
    if (doctorProfile && doctorProfile.availability) {
      const initialSchedule = {};
      WEEKDAYS.forEach((day) => {
        const daySched = doctorProfile.availability.find(
          (sched) => sched.day.toLowerCase() === day.toLowerCase()
        );
        initialSchedule[day] = daySched ? [...daySched.slots] : [];
      });
      setSchedule(initialSchedule);
    } else {
      const initialSchedule = {};
      WEEKDAYS.forEach((day) => {
        initialSchedule[day] = [];
      });
      setSchedule(initialSchedule);
    }
  }, [doctorProfile]);

  const toggleSlot = (day, slot) => {
    setSchedule((prev) => {
      const daySlots = prev[day] || [];
      const updatedSlots = daySlots.includes(slot)
        ? daySlots.filter((s) => s !== slot) // remove
        : [...daySlots, slot].sort((a, b) => {
            // Sort times slot strings nicely
            const convertToMinutes = (timeStr) => {
              const [time, modifier] = timeStr.split(' ');
              let [hours, minutes] = time.split(':');
              hours = parseInt(hours);
              minutes = parseInt(minutes);
              if (modifier === 'PM' && hours < 12) hours += 12;
              if (modifier === 'AM' && hours === 12) hours = 0;
              return hours * 60 + minutes;
            };
            return convertToMinutes(a) - convertToMinutes(b);
          }); // add & sort
      return { ...prev, [day]: updatedSlots };
    });
  };

  const handleCopySchedule = (fromDay) => {
    const slotsToCopy = schedule[fromDay] || [];
    if (slotsToCopy.length === 0) {
      toast.warning(`No slots configured on ${fromDay} to copy.`);
      return;
    }

    if (!window.confirm(`Copy ${fromDay}'s schedule to all other weekdays?`)) {
      return;
    }

    setSchedule((prev) => {
      const updated = { ...prev };
      WEEKDAYS.forEach((day) => {
        if (day !== fromDay && day !== 'Saturday' && day !== 'Sunday') {
          updated[day] = [...slotsToCopy];
        }
      });
      return updated;
    });
    toast.success(`Schedule copied from ${fromDay} to Monday-Friday.`);
  };

  const handleSave = async () => {
    // Format payload to array: [{ day: 'Monday', slots: [...] }]
    const availabilityPayload = WEEKDAYS.map((day) => ({
      day,
      slots: schedule[day] || [],
    })).filter((sched) => sched.slots.length > 0); // Only send days that have slots? Or send all. Sending all is safer so they can clear days.

    try {
      setSaving(true);
      const res = await updateDoctorAvailability(availabilityPayload);
      if (res.success) {
        toast.success('Weekly scheduling availability saved successfully!');
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update availability.');
    } finally {
      setSaving(false);
    }
  };

  if (!doctorProfile) {
    return <Spinner message="Resolving profile context..." />;
  }

  return (
    <div className="fade-in">
      <div className="mb-4 pb-2 border-bottom border-secondary border-opacity-10">
        <h1 className="fw-bold text-white mb-0">Availability Schedule Manager</h1>
        <p className="text-muted small">Configure your weekly clinic consultation hours and timeslots</p>
      </div>

      <div className="row g-4">
        {/* Days List Left Column */}
        <div className="col-lg-4">
          <div className="glass-panel p-4 h-100">
            <h4 className="h5 text-white fw-bold mb-4">Select Weekday</h4>
            <div className="list-group list-group-flush gap-2">
              {WEEKDAYS.map((day) => {
                const slotsCount = schedule[day]?.length || 0;
                const isSelected = activeDay === day;
                return (
                  <button
                    key={day}
                    type="button"
                    className={`list-group-item list-group-item-action border-0 rounded p-3 d-flex justify-content-between align-items-center fw-bold ${
                      isSelected
                        ? 'bg-info text-dark'
                        : 'bg-dark bg-opacity-20 text-white'
                    }`}
                    onClick={() => setActiveDay(day)}
                    style={{ transition: 'all 0.2s ease' }}
                  >
                    <span>{day}</span>
                    <span
                      className={`badge rounded-pill ${
                        isSelected ? 'bg-dark text-white' : 'bg-info bg-opacity-10 text-info'
                      }`}
                    >
                      {slotsCount} Slots
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Slots Selector Right Column */}
        <div className="col-lg-8">
          <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-10 flex-wrap gap-2">
                <h3 className="h5 text-white fw-bold mb-0">
                  Configure slots for <span className="text-info">{activeDay}</span>
                </h3>
                {/* Copy schedule helper for convenience */}
                {['Saturday', 'Sunday'].indexOf(activeDay) === -1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary-glass"
                    onClick={() => handleCopySchedule(activeDay)}
                  >
                    <i className="bi bi-copy me-1"></i> Apply to Mon-Fri
                  </button>
                )}
              </div>

              <p className="text-muted small mb-4">
                Toggle time slot cards to schedule availability. Green cards indicate slots currently open for patient bookings.
              </p>

              <div className="row g-3">
                {PRESET_SLOTS.map((slot) => {
                  const isActive = schedule[activeDay]?.includes(slot);
                  return (
                    <div className="col-sm-4 col-6" key={slot}>
                      <button
                        type="button"
                        className={`btn w-100 py-3 fw-bold rounded border ${
                          isActive
                            ? 'btn-info text-dark border-info shadow-glow'
                            : 'btn-outline-secondary text-white bg-dark bg-opacity-20 border-secondary border-opacity-15'
                        }`}
                        onClick={() => toggleSlot(activeDay, slot)}
                        style={{
                          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        <i className={`bi ${isActive ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
                        {slot}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-top border-secondary border-opacity-10 d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-primary-glass px-5 py-2.5 fw-bold"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm text-dark me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span>Saving Schedule...</span>
                  </>
                ) : (
                  <span>Save Weekly Availability</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .list-group-item-action:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: #fff;
        }
        .shadow-glow {
          box-shadow: 0 0 12px 0 hsla(var(--primary-hsl), 0.3);
        }
      `}</style>
    </div>
  );
};

export default DoctorAvailability;
