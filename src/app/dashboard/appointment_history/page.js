'use client';
import { useEffect, useState } from 'react';
import styles from '../dashboard.module.css';
import Tab from '../../components/Tab';
import AppointmentsTable from '../../components/AppointmentTable';

export default function AppointmentHistory() {
  const [appointmentsObject, setAppointmentsObject] = useState({
    upcoming: [],
    pending: [],
    cancelled: [],
    past: {
      completed: [],
      cancelled: [],
      missed: [],
    },
  });
  const [roleId, setRoleId] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const response = await fetch('/api/session', {
        method: 'GET',
      });

      const { session } = await response.json();

      return {
        roleId: session?.user?.role || null,
        userId: session?.user?.id || null,
      };
    };

    const fetchAppointments = async () => {
      const { roleId, userId } = await fetchSession();
      setRoleId(roleId);

      const response = await fetch(
        `/api/appointments?${roleId === 2 ? 'doctorId' : 'userId'}=${userId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (response.ok) {
        const { appointments } = await response.json();

        setAppointmentsObject({
          upcoming: appointments.filter(
            (a) => new Date(a.time) > new Date() && a.status === 'claimed',
          ),
          pending: appointments.filter((a) => a.status === 'pending'),
          cancelled: appointments.filter(
            (a) => new Date(a.time) > new Date() && a.status === 'cancelled',
          ),
          past: {
            completed: appointments.filter(
              (a) => new Date(a.time) < new Date() && a.status === 'complete',
            ),
            cancelled: appointments.filter(
              (a) => new Date(a.time) < new Date() && a.status === 'cancelled',
            ),
            missed: appointments.filter(
              (a) => new Date(a.time) < new Date() && a.status === 'missed',
            ),
          },
        });
      }
      setHasLoaded(true);
    };

    fetchAppointments();
  }, []);

  return (
    <div className={styles.container}>
      {hasLoaded && (
        <>
          <div className={`${styles.card} `}>
            <h2>Upcoming Appointments</h2>
            <div className={styles.cardContent}>
              <AppointmentsTable
                appointments={appointmentsObject.upcoming}
                roleId={roleId}
              />
            </div>
          </div>
          <div className={`${styles.card} `}>
            <h2>Cancelled Appointments</h2>
            <div className={styles.cardContent}>
              <AppointmentsTable
                appointments={appointmentsObject.cancelled}
                roleId={roleId}
              />
            </div>
          </div>
          <div className={`${styles.card} `}>
            <h2>Pending Appointments</h2>
            <div className={styles.cardContent}>
              <AppointmentsTable
                appointments={appointmentsObject.pending}
                roleId={roleId}
              />
            </div>
          </div>
          <div className={`${styles.card} `}>
            <Tab title="Past Appointments">
              <div className={`${styles.card} `}>
                <h2>Completed Appointments</h2>
                <div className={styles.cardContent}>
                  <AppointmentsTable
                    appointments={appointmentsObject.past.completed}
                    roleId={roleId}
                  />
                </div>
              </div>
              <div className={`${styles.card} `}>
                <h2>Missed Appointments</h2>
                <div className={styles.cardContent}>
                  <AppointmentsTable
                    appointments={appointmentsObject.past.missed}
                    roleId={roleId}
                  />
                </div>
              </div>
              <div className={`${styles.card} `}>
                <h2>Cancelled Appointments</h2>
                <div className={styles.cardContent}>
                  <AppointmentsTable
                    appointments={appointmentsObject.past.cancelled}
                    roleId={roleId}
                  />
                </div>
              </div>
            </Tab>
          </div>
        </>
      )}
      {!hasLoaded && <h2>Loading...</h2>}
    </div>
  );
}
