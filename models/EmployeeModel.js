import db from "../utils/db.js";

const EmployeeModel = {
   create: (employeeData, callback) => {
      const sql = `INSERT INTO employees_table SET ?`;
      db.query(sql, employeeData, (err, data) => {
         if (err) {
            callback(err, null);
         } else {
            callback(null, data);
         }
      });
   },


   // Read all employees
   getAll: (callback) => {
      const sql = `SELECT * FROM employees_table`;
      db.query(sql, (err, data) => {
         if (err) {
            callback(err, null);
         } else {
            callback(null, data);
         }
      });
   },

   // Read employee by ID
   getById: (id, callback) => {
      const sql = `SELECT * FROM employees_table WHERE employee_id = ?`;
      db.query(sql, id, (err, data) => {
         if (err) {
            callback(err, null);
         } else {
            callback(null, data);
         }
      });
   },

   // Update employee
   update: (id, employeeData, callback) => {
      const sql = `UPDATE employees_table SET ? WHERE id = ?`;
      db.query(sql, [employeeData, id], (err, data) => {
         if (err) {
            callback(err, null);
         } else {
            callback(null, data);
         }
      });
   },

   // Delete employee
   delete: (id, callback) => {
      const sql = `DELETE FROM employees_table WHERE id = ?`;
      db.query(sql, id, (err, data) => {
         if (err) {
            callback(err, null);
         } else {
            callback(null, data);
         }
      });
   }
};
export default EmployeeModel;