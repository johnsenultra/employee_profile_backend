import db from "../utils/db"

const EmployeeModel = {
  create: (employeeData, callback) => {
    const sql = `INSERT INTO employees_table SET ?`
    db.query(sql, employeeData, (err, data) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, data)
      }
    })
  },

  // Read all employees
  getAll: (callback) => {
    const sql = `SELECT * FROM employees_table`
    db.query(sql, (err, data) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, data)
      }
    })
  },

  // Read employee by ID
  getById: (id, callback) => {
    // const sql = `SELECT * FROM employees_table WHERE employee_id = ?`;
    const sql = `
         SELECT 
            e.*, 
            spouse_surname, 
            spouse_first_name, 
            spouse_middle_name, 
            spouse_name_extension,
            spouse_occupation, 
            business_address, 
            employer_name, 
            spouse_telephone_no,
            father_surname, 
            father_first_name, 
            father_middle_name, 
            father_name_extension,
            mother_maiden_name, 
            mother_first_name, 
            mother_middle_name,
            CONCAT('[', GROUP_CONCAT(
               CONCAT(
                  '{"name": "', children_fullname, '", "date_of_birth": "', child_date_of_birth, '"}'
                  )
            ), ']') AS children
         FROM employees_table e
         LEFT JOIN family_information_table f ON e.employee_id = f.employee_id
         LEFT JOIN children_table c ON f.id = c.family_info_id
         WHERE e.employee_id = ?
         GROUP BY e.employee_id;
      `

    db.query(sql, [id], (err, data: any) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, data.length > 0 ? data[0] : null)
      }
    })
  },

  getUpdate: (id, callback) => {
    //id = req.params.id
    const sql = `SELECT * FROM employees_table WHERE employee_id = ?`
    db.query(sql, [id], (err, data: any) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, data.length > 0 ? data[0] : null)
      }
    })
  },

  // Update employee
  update: (id, employeeData, callback) => {
    const sql = `UPDATE employees_table SET ? WHERE employee_id = ?`
    db.query(sql, [employeeData, id], (err, data) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, data)
      }
    })
  },

  // Delete employee
  delete: (id, callback) => {
    const sql = `DELETE FROM employees_table WHERE employee_id = ?`
    db.query(sql, [id], (err, data) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, data)
      }
    })
  },

  // Search employee by first name or last name
  search: (term, callback) => {
    const sql = `SELECT * FROM employees_table WHERE first_name LIKE ? OR surname LIKE ?`
    const searchTerm = `%${term}%`
    db.query(sql, [searchTerm, searchTerm], (err, data) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, data)
      }
    })
  },
}
export default EmployeeModel
