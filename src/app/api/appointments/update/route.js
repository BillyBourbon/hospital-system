/* eslint-disable capitalized-comments */
import { dbPost } from '@/app/scripts/database';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { appointmentId, type, data } = await request.json();

    const allowedTypes = ['notes', 'status'];
    if (!allowedTypes.includes(type.toLowerCase())) {
      return NextResponse.json(
        { message: 'Unknown update type' },
        { status: 401 },
      );
    }

    if (type.toLowerCase() === 'notes') {
      // console.log(
      //   `Updating ${type} of Appointment ${appointmentId} with ${data}`,
      // );
      const query = `UPDATE appointment SET notes = ? WHERE appointment_id = ?`;
      try {
        const res = await dbPost(query, [data, appointmentId]);

        return NextResponse.json(
          { message: 'Notes updated successfully' },
          { status: 200 },
        );
      } catch (e) {
        console.error('Update Error: ', e);
        return NextResponse.json(
          { message: 'Failed to update notes successfully' },
          { status: 401 },
        );
      }
    }

    if (type.toLowerCase() === 'status') {
      const query = `UPDATE appointment SET status = ?, ${data?.doctorId ? 'doctorId' : 'patientId'} = ? WHERE appointment_id = ?`;
      try {
        const values = [
          data.status,
          data.doctorId || data.patientId,
          appointmentId,
        ];

        const res = await dbPost(query, values);

        return NextResponse.json(
          { message: 'Status updated successfully' },
          { status: 200 },
        );
      } catch (e) {
        console.error('Update Error: ', e);
        return NextResponse.json(
          { message: 'Failed to update status' },
          { status: 401 },
        );
      }
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
