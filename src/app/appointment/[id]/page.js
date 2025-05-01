'use client';
import { useEffect, useState } from 'react';
import styles from './appointment.module.css';
import Tab from '@/app/components/Tab';
import { useRouter } from 'next/navigation';

export default function Appointment({ params }) {
  const router = useRouter();
  const [appointmentId, setAppointmentId] = useState(null);
  const [appointmentStatus, setAppointmentStatus] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState(null);
  const [alertClaim, setAlertClaim] = useState(null);
  const [errors, setErrrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [notesField, setNotesField] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const response = await fetch('/api/session', {
        method: 'GET',
      });

      const { session } = await response.json();

      setRoleId(session?.user?.role || null);
      setUserId(session?.user?.id || null);

      return { userId: session?.user?.id, roleId: session?.user?.role };
    };

    const fetchAppointment = async () => {
      const { id } = await params;
      const { userId, roleId } = await fetchSession();
      setAppointmentId(id);

      const response = await fetch(`/api/appointments?appointmentId=${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const { appointments } = await response.json();

        if (
          appointments[0].patient_id !== userId &&
          appointments[0].doctor_id !== userId &&
          roleId !== 2
        ) {
          router.push('/');
          return;
        }
        setData(appointments[0]);
        setNotesField(appointments[0]?.notes || '');
        setAppointmentStatus(appointments[0]?.status || 'Unknown');
      } else {
        setErrrors({ server: 'Unable to fetch data' });
      }
    };

    fetchAppointment();
  }, []);

  const buildUserTable = ({ name, email, phone }) => {
    const user = { name, email, phone };
    return (
      <div className={styles.userTable}>
        <table>
          <tbody>
            {Object.entries(user).map(([k, v], i) => {
              return (
                <tr key={i}>
                  <td>
                    {k.charAt(0).toUpperCase()}
                    {k.substring(1)}:
                  </td>
                  <td>{v}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const handleData = () => {
    try {
      const {
        appointment_id,
        building_number,
        city,
        country,
        county,
        doctor_email,
        doctor_first_name,
        doctor_id,
        doctor_last_name,
        doctor_phone,
        notes,
        patient_email,
        patient_first_name,
        patient_id,
        patient_last_name,
        patient_phone,
        post_code,
        reason,
        road_name,
        room_number,
        status,
        time,
      } = data;

      const patient = {
        name: `${patient_first_name} ${patient_last_name}`,
        email: patient_email,
        phone: patient_phone,
      };
      const doctor = {
        name: `Dr ${doctor_first_name} ${doctor_last_name}`,
        email: doctor_email,
        phone: doctor_phone,
      };

      const updateNotes = async () => {
        setSaving(true);
        const res = await fetch('/api/appointments/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            appointmentId: data.appointment_id,
            type: 'notes',
            data: notesField,
          }),
        });
        setSaving(false);
        if (res.ok) {
          setAlert('Notes updated successfully!');
        } else {
          setAlert('Failed to update notes.');
        }
      };

      return (
        <div className={styles.card}>
          <div className={styles.card}>
            <p>
              <b>Appointment Status:</b> {status}
            </p>

            <p>
              <b>Appointment Time: </b>
              {Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium',
                timeStyle: 'medium',
              }).format(new Date(time))}
            </p>

            <p>
              <b>{`Reason: `}</b>
              {reason}
            </p>
          </div>

          <div style={{ paddingTop: 20 }}>
            <Tab title="Patient">{buildUserTable(patient)}</Tab>
          </div>
          <Tab title="Doctor">{buildUserTable(doctor)}</Tab>
          <Tab title="Location">{`Room ${room_number} ${building_number} ${road_name} ${city} ${post_code}`}</Tab>

          <div className={styles.card}>
            <h2>Notes</h2>
            {roleId === 2 ? (
              <>
                <textarea
                  value={notesField}
                  onChange={(e) => setNotesField(e.target.value)}
                  rows={5}
                  style={{ width: '100%' }}
                />
                <button
                  className={styles.button}
                  disabled={saving}
                  onClick={updateNotes}
                >
                  {saving ? 'Saving...' : 'Save Notes'}
                </button>
                {alert}
              </>
            ) : (
              <p>{notesField || 'No notes available.'}</p>
            )}
          </div>
        </div>
      );
    } catch (error) {
      console.error(error);
      setErrrors({ data_error: 'Unable to parse data' });
    }
  };

  const updateAppointmentStatus = async (status) => {
    const data = {
      [roleId === 2 ? 'doctorId' : 'patientId']: userId,
      status,
    };

    const res = await fetch('/api/appointments/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appointmentId: appointmentId,
        type: 'status',
        data: data,
      }),
    });

    if (res.ok) {
      setAlertClaim(
        `Appointment Updated.\nMarked As '${`${status.charAt(0).toUpperCase()}${status.substring(1)}`}'`,
      );
    } else {
      setErrrors(`Error unable to update appointment`);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Appointment Details</h1>
      {data === null && <h2>Loading Data</h2>}
      {data !== null && (
        <div className={styles.card}>
          <div className={styles.cardContent}>
            {/* Controls for doctor(role2) */}
            {roleId === 2 && (
              <div>
                {/* Claim pending appointments */}
                {appointmentStatus === 'pending' && (
                  <button
                    className={styles.button}
                    style={{ background: 'green' }}
                    // OnClick={claimAppointment}
                    onClick={() => updateAppointmentStatus('claimed')}
                  >
                    Claim Appointment
                  </button>
                )}
                {/* Reject pending appointments */}
                {appointmentStatus === 'pending' && (
                  <button
                    className={styles.button}
                    style={{ background: 'red' }}
                    onClick={() => updateAppointmentStatus('cancelled')}
                  >
                    Reject Appointment
                  </button>
                )}
                {/* Mark appointment as complete */}
                {appointmentStatus === 'claimed' && (
                  <button
                    className={styles.button}
                    style={{ background: 'green' }}
                    onClick={() => updateAppointmentStatus('compelte')}
                  >
                    Mark Appointment As Complete
                  </button>
                )}
                {/* Mark appointment as missed */}
                {appointmentStatus === 'claimed' && (
                  <button
                    className={styles.button}
                    style={{ background: 'red' }}
                    onClick={() => updateAppointmentStatus('missed')}
                  >
                    Mark Appointment As Missed
                  </button>
                )}
              </div>
            )}
            {/* Controls for patient(role1) */}
            {roleId === 1 && <div></div>}
            {/* Controls for patient(role1) and doctor(role2) */}
            {roleId && (
              <div>
                {/* Cancel appointment if its claimed (not completed, missed, pending or already cancelled) */}
                {appointmentStatus === 'claimed' && (
                  <button
                    className={styles.button}
                    style={{ background: 'red' }}
                    onClick={() => updateAppointmentStatus('cancelled')}
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
            )}
            {alertClaim && <p>{alertClaim}</p>}
          </div>
        </div>
      )}
      {data !== null && handleData()}
      {errors && (
        <>
          {Object.entries(errors).forEach(([k, v], i) => {
            <p key={i}>
              {k}: {v}
            </p>;
          })}
        </>
      )}
    </div>
  );
}
