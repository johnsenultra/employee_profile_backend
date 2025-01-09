import db from "../utils/db"

const EmployeeModel = {
  create: (employeeData, callback) => {
    const sql = `INSERT INTO employees_table SET ? `
    db.query(sql, employeeData, (err, data) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, data)
      }
    })
  },

  // Read all employees
  getAll: (page = 1, limit = 10, callback) => {
    // Calculate offset
    const offset = (page - 1) * limit;

    // First query to get total count
    const countSql = `SELECT COUNT(*) as total FROM employees_table`;
    
    // Second query to get paginated data
    const dataSql = `
      SELECT * FROM employees_table 
      LIMIT ? OFFSET ?
    `;

    // Executing count query first
    db.query(countSql, (countErr, countResult) => {
      if (countErr) {
        return callback(countErr, null);
      }

      const total = countResult[0].total;

      // Then execute data query with pagination
      db.query(dataSql, [Number(limit), Number(offset)], (dataErr, employees) => {
        if (dataErr) {
          return callback(dataErr, null);
        }

        // Return both the paginated data and total count
        callback(null, {
          employees,
          total,
          page: Number(page),
          totalPages: Math.ceil(total / limit)
        });
      });
    });
  },
  // getAll: (callback) => {
  //   const sql = `SELECT * FROM employees_table`
  //   db.query(sql, (err, data) => {
  //     if (err) {
  //       callback(err, null)
  //     } else {
  //       callback(null, data)
  //     }
  //   })
  // },

  // Read employee by ID
  getById: (id, callback) => {
    const sql = `SELECT * FROM employees_table WHERE employee_id = ?`;
    // const sql = `
    //      SELECT 
    //         e.*, 
    //         spouse_surname, 
    //         spouse_first_name, 
    //         spouse_middle_name, 
    //         spouse_name_extension,
    //         spouse_occupation, 
    //         business_address, 
    //         employer_name, 
    //         spouse_telephone_no,
    //         father_surname, 
    //         father_first_name, 
    //         father_middle_name, 
    //         father_name_extension,
    //         mother_maiden_name, 
    //         mother_first_name, 
    //         mother_middle_name,
    //         CONCAT('[', GROUP_CONCAT(
    //            CONCAT(
    //               '{"name": "', children_fullname, '", "date_of_birth": "', child_date_of_birth, '"}'
    //               )
    //         ), ']') AS children
    //      FROM employees_table e
    //      LEFT JOIN family_information_table f ON e.employee_id = f.employee_id
    //      LEFT JOIN children_table c ON f.id = c.family_info_id
    //      WHERE e.employee_id = ?
    //      GROUP BY e.employee_id;
    //   `
    db.query(sql, [id], (err, data: any) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, data.length > 0 ? data[0] : null)
      }
    })
  },

  getUpdate: (id, employeeData, callback) => {
    const sql = `SELECT * FROM employees_table WHERE employee_id = ?`
    db.query(sql, [id], (err, data) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, data)
      }
    })
  },

  // Update employee  
  update: (employee_id, employeeData, callback) => {
    // Construct the UPDATE query dynamically based on the employeeData
    const fields = Object.keys(employeeData)
    .map(key => `${key} = ?`)
    .join(', ');

    const values = [...Object.values(employeeData), employee_id];

    const sql = `UPDATE employees_table SET ${fields} WHERE employee_id = ?`;

    db.query(sql, values, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
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

  // Add search with pagination
  // search: (searchTerm, page = 1, limit = 10, callback) => {
  //   const offset = (page - 1) * limit;
    
  //   // Count query for search results
  //   const countSql = `
  //     SELECT COUNT(*) as total 
  //     FROM employees_table 
  //     WHERE 
  //       surname LIKE ? OR 
  //       first_name LIKE ? OR 
  //       email LIKE ? OR 
  //       employee_id LIKE ?
  //   `;

  //   // Data query for search results with pagination
  //   const searchSql = `
  //     SELECT * FROM employees_table 
  //     WHERE 
  //       surname LIKE ? OR 
  //       first_name LIKE ? OR 
  //       email LIKE ? OR 
  //       employee_id LIKE ?
  //     LIMIT ? OFFSET ?
  //   `;

  //   const searchPattern = `%${searchTerm}%`;
  //   const searchParams = [searchPattern, searchPattern, searchPattern, searchPattern];

  //   // Execute count query first
  //   db.query(countSql, searchParams, (countErr, countResult) => {
  //     if (countErr) {
  //       return callback(countErr, null);
  //     }

  //     const total = countResult[0].total;

  //     // Then after that execute search query with pagination
  //     db.query(
  //       searchSql, 
  //       [...searchParams, Number(limit), Number(offset)],
  //       (dataErr, employees) => {
  //         if (dataErr) {
  //           return callback(dataErr, null);
  //         }

  //         callback(null, {
  //           employees,
  //           total,
  //           page: Number(page),
  //           totalPages: Math.ceil(total / limit)
  //         });
  //       }
  //     );
  //   });
  // },
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

  // Get total employees
  totalEmployees: (callback) => {
    const sql = `SELECT COUNT(*) as total FROM employees_table`
    db.query(sql, (err, data) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, data[0].total)
      }
    })
  }

  //
}
export default EmployeeModel