import { getSession } from '@/app/scripts/auth';

export async function GET() {
  try {
    const session = await getSession();

    return Response.json({ success: true, session }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}
