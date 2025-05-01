import { dbGet } from '@/app/scripts/database';
import { NextResponse } from 'next/server';

export async function GET() {
  const query = `SELECT 
    a.appointment_id,
    a.time,
    a.reason,
    a.status,
    a.room_number,
    a.notes,
    
    -- Address info
    addr.country,
    addr.county,
    addr.city,
    addr.road_name,
    addr.building_number,
    addr.post_code,

    -- Patient info
    p.UserID AS patient_id,
    p.FirstName AS patient_first_name,
    p.LastName AS patient_last_name,
    p.Email AS patient_email,
    p.PhoneNumber AS patient_phone,

    -- Doctor info
    d.UserID AS doctor_id,
    d.FirstName AS doctor_first_name,
    d.LastName AS doctor_last_name,
    d.Email AS doctor_email,
    d.PhoneNumber AS doctor_phone

    FROM appointment a
    JOIN address addr ON a.location = addr.address_id
    JOIN users p ON a.patientId = p.UserID
    LEFT JOIN users d ON a.doctorId = d.UserID
    WHERE a.doctorId IS NULL AND a.status = 'pending';`;
  try {
    const { rows } = await dbGet(query);

    return NextResponse.json(
      { success: true, appointments: rows },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Server Error' },
      { status: 500 },
    );
  }
}
