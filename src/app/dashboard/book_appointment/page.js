/* eslint-disable capitalized-comments */
'use client';
import { useEffect, useState } from 'react';
import styles from '../dashboard.module.css';

export default function BookAppointment() {
  const [appointmentData, setAppointmentData] = useState({
    patientId: null,
    doctorId: null,
    time: '',
    reason: '',
    location: {
      building_number: '',
      road_name: '',
      city: '',
      county: '',
      country: '',
      post_code: '',
      address_id: null,
    },
    room_number: '',
    notes: '',
    status: 'pending',
  });

  const [locations, setLocations] = useState([]);
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [sessionUser, setSessionUser] = useState(null);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const response = await fetch(`/api/locations`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const { locations } = await response.json();
          setLocations(locations);
        }
      } catch (error) {
        console.error('Failed to load locations:', error);
      }
    };
    const fetchSession = async () => {
      const response = await fetch('/api/session', {
        method: 'GET',
      });

      const { session } = await response.json();

      setSessionUser(session?.user || null);
    };

    fetchSession();
    loadLocations();
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setAppointmentData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value,
        },
      }));
    } else {
      setAppointmentData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationSelect = (e) => {
    const { value } = e.target;
    if (value === 'CUSTOMADDRESS') {
      setShowCustomLocation(true);
      setAppointmentData((prev) => ({
        ...prev,
        location: {
          building_number: '',
          road_name: '',
          city: '',
          county: '',
          country: '',
          post_code: '',
        },
      }));
    } else {
      const loc = locations.find((l) => l.address_id.toString() === value);

      if (loc) {
        setShowCustomLocation(false);
        setAppointmentData((prev) => ({
          ...prev,
          location: {
            building_number: loc.building_number,
            road_name: loc.road_name,
            city: loc.city,
            county: loc.county,
            country: loc.country,
            post_code: loc.post_code,
            address_id: loc.address_id,
          },
        }));
      }
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (appointmentData.time < new Date()) {
        setMessage('Appointment time can not be in the past');
        setIsSubmitting(false);
        return;
      }

      setAppointmentData((prev) => ({
        ...prev,
        doctorId: sessionUser?.role === 2 ? sessionUser?.id : prev.doctorId,
        patientId: sessionUser?.role !== 2 ? sessionUser?.id : prev.patientId,
      }));

      const resPost = await fetch('/api/appointments', {
        method: 'POST',
        headers: { contentType: 'application/json' },
        body: JSON.stringify(appointmentData),
      });

      if (resPost.ok) {
        setMessage('Appointment requested succesfully');
        setIsSubmitting(false);
      } else {
        setMessage('Failed to create appointment');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting form: ', error);
      setMessage('Error submitting form');
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.form} ${styles.card}`}>
        <form onSubmit={handleAppointmentSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="time">Time</label>
            <input
              type="datetime-local"
              id="time"
              name="time"
              value={appointmentData.time}
              onChange={handleInput}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="locationSelect">Location</label>
            <select
              id="locationSelect"
              onChange={handleLocationSelect}
              defaultValue=""
              required
            >
              <option value="" disabled>
                Select a location
              </option>
              {locations.map((l, i) => (
                <option key={i} value={l.address_id}>
                  {l.location_name}
                </option>
              ))}
              <option value="CUSTOMADDRESS">Add new location</option>
            </select>
          </div>

          {showCustomLocation && (
            <div>
              {[
                'building_number',
                'road_name',
                'city',
                'county',
                'country',
                'post_code',
              ].map((field) => (
                <div className={styles.inputGroup} key={field}>
                  <label htmlFor={field}>{field}</label>
                  <input
                    type="text"
                    id={field}
                    name={`location.${field}`}
                    value={appointmentData.location[field]}
                    onChange={handleInput}
                    required
                  />
                </div>
              ))}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="roomNumber">Room Number</label>
            <input
              type="number"
              id="roomNumber"
              name="room_number"
              value={appointmentData.room_number}
              onChange={handleInput}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="reason">Reason</label>
            <input
              type="text"
              id="reason"
              name="reason"
              value={appointmentData.reason}
              onChange={handleInput}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="notes">Notes</label>
            <input
              type="text"
              id="notes"
              name="notes"
              value={appointmentData.notes}
              onChange={handleInput}
            />
          </div>

          <button
            className={styles.button}
            style={{ width: '100%' }}
            disabled={isSubmitting}
            type="submit"
            // onClick={handleAppointmentSubmit}
          >
            {isSubmitting ? 'Submiting Request...' : 'Submit Request'}
          </button>
          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
}
