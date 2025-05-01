'use server';
import mysql from 'mysql2/promise';

async function connect() {
  const connectionOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_SCHEMA,
  };
  const connection = await mysql.createConnection(connectionOptions);
  return connection;
}

async function dbGet(query, values = null) {
  const output = { rows: [], fields: [] };
  const connection = await connect();

  try {
    if (values === null) {
      const [rows, fields] = await connection.execute(query);
      output.rows = rows;
      output.fields = fields;
    } else {
      const [rows, fields] = await connection.execute(query, values);
      output.rows = rows;
      output.fields = fields;
    }
  } catch (err) {
    console.error('ERROR Database: ', err);
    throw new Error('Failed to get data');
  }

  connection.destroy();

  return output;
}

async function dbPost(query, values) {
  const connection = await connect();
  try {
    const res = await connection.execute(query, values);
    connection.destroy();
    return res;
  } catch (err) {
    connection.destroy();
    console.error('ERROR Database: ', err);
    throw new Error('Failed to post data');
  }
}

export { connect, dbGet, dbPost };
