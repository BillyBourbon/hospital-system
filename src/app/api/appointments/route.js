import { dbGet, dbPost } from '@/app/scripts/database';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const doctorId = searchParams.get('doctorId');
    const appointmentId = searchParams.get('appointmentId');

    let query;

    if ((userId && userId > 0) || (doctorId && doctorId > 0)) {
      query = `SELECT 
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
        ${userId !== null ? `WHERE p.UserId = ${userId}` : `WHERE d.UserID = ${doctorId}`};`;
    } else if (appointmentId && appointmentId > 0) {
      query = `SELECT 
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
        WHERE a.appointment_id = ${appointmentId};`;
    }
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

export async function POST(request) {
  try {
    const data = await request.json();
    const { location } = data;

    let { address_id } = location;

    if (address_id === null) {
      const queryLocationPost = `INSERT IGNORE INTO address (building_number,road_name,city,county,country,post_code) VALUES (?,?,?,?,?,?)`;

      const locationValues = [
        location.building_number,
        location.road_name,
        location.city,
        location.county,
        location.country,
        location.post_code,
      ];

      const queryLocationGet = `SELECT Address_id FROM address WHERE building_number = ? AND road_name = ? AND city = ? AND county = ? AND country = ? AND post_code = ?;`;

      const [postAddress] = await dbPost(queryLocationPost, locationValues);

      const { rows: addressRows } = await dbGet(
        queryLocationGet,
        locationValues,
      );

      address_id = addressRows[0].Address_id;
    }

    const queryAppointment = `INSERT INTO appointment (patientId,doctorId,time,reason,location,room_number,notes,status) VALUES (?,?,?,?,?,?,?,?);`;
    const appointmentValues = [
      data.patientId,
      data.doctorId,
      data.time,
      data.reason,
      address_id,
      data.room_number,
      data.notes,
      data.status,
    ];

    const [postAppointment] = await dbPost(queryAppointment, appointmentValues);

    if (!postAppointment.error) {
      return Response.json({ success: true }, { status: 200 });
    } else {
      return Response.json(
        { message: `Error: ${postAppointment.error}` },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
