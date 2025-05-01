import { dbGet, dbPost } from '@/app/scripts/database';
import { verifyUsersPassword } from '@/app/scripts/encryption';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { userId, accountData, password } = await request.json();

    const { status } = await verifyUsersPassword({
      userId,
      plainTextPassword: password,
    });

    if (!status) {
      return NextResponse.json(
        { message: 'Invalid Password' },
        { status: 401 },
      );
    }

    const {
      firstName,
      middleName,
      lastName,
      gender,
      age,
      phoneNumber,
      country,
      county,
      city,
      road_name,
      building_number,
      post_code,
    } = accountData;
    const newAddress = {
      country,
      county,
      city,
      road_name,
      building_number,
      post_code,
    };
    const queryGetAddress = `
    SELECT a.*
    FROM users as u
    JOIN address as a ON u.AddressID = a.address_id
    WHERE u.UserID = ?`;
    const { rows: currentAddressRows } = await dbGet(queryGetAddress, [userId]);

    const isNewAddress =
      !currentAddressRows[0] ||
      Object.entries(newAddress)
        .map(([k, v]) => currentAddressRows[0][k].toString() !== v.toString())
        .includes(true);

    let addressId;
    if (isNewAddress) {
      const queryPostAddress = `INSERT INTO address (country, county, city, road_name, building_number, post_code)
      VALUES (?, ?, ?, ?, ?, ?)`;
      const valuesPostAddress = [
        newAddress.country,
        newAddress.county,
        newAddress.city,
        newAddress.road_name,
        newAddress.building_number,
        newAddress.post_code,
      ];
      const [statusPostAddress] = await dbPost(
        queryPostAddress,
        valuesPostAddress,
      );
      addressId = statusPostAddress.insertId;
    } else {
      addressId = currentAddressRows[0].address_id;
    }

    const queryUpdateAccount = `UPDATE users
    SET 
      FirstName = ?, 
      MiddleName = ?, 
      LastName = ?, 
      Age = ?, 
      Gender = ?, 
      PhoneNumber = ?, 
      AddressID = ?
    WHERE UserId = ?`;
    const [statusUpdateAccount] = await dbPost(queryUpdateAccount, [
      firstName,
      middleName,
      lastName,
      age,
      gender,
      phoneNumber,
      addressId,
      userId,
    ]);

    if (statusUpdateAccount.warningStatus === 0) {
      return NextResponse.json(
        { message: 'Account Updated Succesfully' },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { message: 'Unable To Update Account' },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
