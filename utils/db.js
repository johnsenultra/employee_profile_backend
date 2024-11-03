import mysql from "mysql2"

// Database connection
const sql = await mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "",
   database: "uep_ep"
});

// error handling for database connection
sql.connect((err) => {
   if (err) {
      console.log("Database connection failed: ", err);
   } else {
      console.log("Database connection successful")
   }
})

export default sql;