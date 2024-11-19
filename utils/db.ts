import * as mysql from "mysql2"
import { config } from "dotenv"
config()

// Database connection
const sql = mysql.createConnection({
  host: process.env.TYPEORM_HOST,
  user: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD || "",
  port: +process.env.TYPEORM_PORT || 3306,
  database: process.env.TYPEORM_DATABASE,
})

// error handling for database connection
sql.connect((err) => {
  if (err) {
    console.log("Database connection failed: ", err)
  } else {
    console.log("Database connection successful")
  }
})

export default sql
