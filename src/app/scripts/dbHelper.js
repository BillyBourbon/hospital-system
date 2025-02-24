'use server'
import mysql from "mysql2/promise"
async function connect() {
  const connectionOptions = {
    host: process.env.NEXT_PUBLIC_DB_HOST,
    user: process.env.NEXT_PUBLIC_DB_USER,
    password: process.env.NEXT_PUBLIC_DB_PASS,
    database: process.env.NEXT_PUBLIC_DB_SCHEMA,
  }  
  const connection = await mysql.createConnection(connectionOptions);
  return connection
}
async function dbGet(query) {
  const output = { rows: [], fields: []}
  const connection = await connect()
  
  try{
    const [ rows, fields ] = await connection.execute(query)
    output.rows = rows
    output.fields = fields
  } catch(err){
    console.error("ERROR Database: ", err)
    throw new Error("Failed to get data")
  }

  connection.destroy()
  
  return output
}

async function dbPost(query, values) {
  const connection = await connect()
  let status = false
  try{
    const res = await connection.execute(query, values)
    connection.destroy()
    status = true
  } catch(err){
    connection.destroy()
    console.error("ERROR Database: ", err)
    throw new Error("Failed to post data")
  }
  return status
}

// dbPost("INSERT INTO sitemessages (MessageTimestamp, MessageName, MessageEmail, MessageMessage) VALUES ?", [new Date().getTime(), "Billy", "ballinson18", "some message here"])


export {dbGet, dbPost}