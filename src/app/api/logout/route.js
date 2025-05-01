import { logout } from '@/app/scripts/auth';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await logout();

    return NextResponse.json({ message: 'Logged out' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
