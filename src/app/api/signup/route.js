import { dbPost } from '@/app/scripts/database';
import { hashPassword } from '@/app/scripts/encryption';

// Create an api route for us to make requests to
export async function POST(request) {
  const json = await request.json();

  try {
    const values = [
      json.roleId,
      json.firstName,
      json.middleName,
      json.lastName,
      json.gender,
      json.age,
      await hashPassword(json.password),
      json.email,
      json.phone,
      null,
      json.staff || null,
    ];

    const [status] = await dbPost(
      'INSERT INTO users (RoleID,FirstName,MiddleName,LastName,Gender,Age,Password,Email,PhoneNumber,AddressID,StaffType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      values,
    );
    const userLoginObj = {
      id: status.insertId,
      role: json.roleId,
      email: json.email,
    };

    if (!status.error) {
      return Response.json(
        { success: true, user: userLoginObj },
        { status: 200 },
      );
    } else {
      return Response.json(
        { message: 'Account already exists' },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}
