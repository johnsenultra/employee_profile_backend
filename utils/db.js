import mysql from "mysql"

// Database connection
const sql = mysql.createConnection({
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