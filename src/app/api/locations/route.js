import { dbGet } from '@/app/scripts/database';
import { NextResponse } from 'next/server';

export async function POST() {}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId');

    let query;
    if (!locationId) query = `SELECT DISTINCT * FROM address;`;

    const { rows } = await dbGet(query);

    if (rows.length > 0)
      return NextResponse.json({ locations: rows }, { status: 200 });
    else
      return NextResponse.json(
        { message: 'No addresses found' },
        { status: 401 },
      );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
