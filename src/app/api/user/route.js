import { dbGet } from '@/app/scripts/database';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const query = `
      SELECT 
        FirstName as firstName,
        MiddleName as middleName, 
        LastName as lastName, 
        Age as age, 
        Gender as gender, 
        PhoneNumber as phoneNumber,
        country, county, city, road_name, building_number, post_code
      FROM users
      LEFT JOIN address a ON AddressID
      WHERE UserId = ? AND AddressID = a.address_id;`;

    const { rows } = await dbGet(query, [userId]);

    if (rows.length > 0) {
      return NextResponse.json({ data: rows[0] }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
