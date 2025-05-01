import { verifyUsersPassword } from '../../scripts/encryption';

export async function POST(request) {
  const { email, accountType, password } = await request.json();
  const roleId = accountType === 'staff' ? 2 : 1;

  try {
    const { status: isValid, user } = await verifyUsersPassword({
      email,
      roleId,
      plainTextPassword: password,
    });

    if (isValid) {
      return Response.json({ success: true, user: user }, { status: 200 });
    } else {
      return Response.json({ message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}
