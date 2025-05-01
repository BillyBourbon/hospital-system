'use client';
import Link from 'next/link';
import styles from './appointmentTable.module.css';

export default function AppointmentsTable({ appointments, roleId }) {
  const tableHeaders =
    roleId === 2
      ? ['Patient', 'Location', 'Time', 'Reason', 'Status', 'Options']
      : ['Doctor', 'Location', 'Time', 'Reason', 'Status', 'Options'];

  const tableRows = [];

  appointments.forEach((obj) => {
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
    } = obj;

    const buttonOptions = (
      <Link href={`/appointment/${appointment_id}`}>
        <button className={styles.button}>View/Edit Details</button>
      </Link>
    );

    const row =
      roleId.toString() === '2'
        ? [
            `${patient_first_name} ${patient_last_name}`,
            `Room ${room_number} ${building_number} ${road_name} ${city} ${post_code}`,
            Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeStyle: 'medium',
            }).format(new Date(time)),
            reason,
            status,
            buttonOptions,
          ]
        : [
            doctor_first_name === null
              ? 'No Assigned Doctor'
              : `Dr ${doctor_first_name} ${doctor_last_name}`,
            `Room ${room_number} ${building_number} ${road_name} ${city} ${post_code}`,
            Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeStyle: 'medium',
            }).format(new Date(time)),
            reason,
            status,
            buttonOptions,
          ];
    tableRows.push(row);
  });
  return (
    <div>
      {appointments === null && <h1>Loading Appointments</h1>}
      {appointments !== null && (
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              {tableHeaders.map((header, i) => (
                <th key={i} className={styles.th}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {appointments !== null &&
              tableRows.length > 0 &&
              tableRows.map((r, i) => (
                <tr key={i} className={styles.tr}>
                  {r.map((e, i) => (
                    <td
                      key={i}
                      className={styles.td}
                      data-label={tableHeaders[i]}
                    >
                      {e}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
