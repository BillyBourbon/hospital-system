'use client';
import { useEffect, useState } from 'react';
import styles from './dashboard.module.css';
import AppointmentsTable from '../components/AppointmentTable';
import Link from 'next/link';

export default function StaffDashboard({ userId, roleId }) {
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
  const [unclaimedAppointments, setUnclaimedAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const responseUnclaimed = await fetch(`/api/appointments/unclaimed`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (responseUnclaimed.ok) {
        const { appointments } = await responseUnclaimed.json();

        setUnclaimedAppointments(appointments);
      }

      const responseOwnAppointments = await fetch(
        `/api/appointments?doctorId=${userId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (responseOwnAppointments.ok) {
        const { appointments } = await responseOwnAppointments.json();

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
    };
    fetchAppointments();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Staff Dashboard</h1>
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
        <h2>Unclaimed Appointments</h2>
        <div className={styles.cardContent}>
          <AppointmentsTable
            appointments={unclaimedAppointments}
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

      <div className={`${styles.card} ${styles.secondaryCard}`}>
        <h2>Manage Appointments</h2>
        <div className={styles.cardContent}>
          <Link href="/dashboard/book_appointment">
            <button className={styles.button}>Book Appointment</button>
          </Link>
          <Link href="/dashboard/appointment_history">
            <button className={styles.button}>View Appointment History</button>
          </Link>
        </div>
      </div>

      <div className={`${styles.card} ${styles.secondaryCard}`}>
        <h2>Manage Account</h2>
        <div className={styles.cardContent}>
          <Link href="/dashboard/account_management">
            <button className={styles.button}>Edit Account</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
