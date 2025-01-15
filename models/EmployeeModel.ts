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
    const offset = (page - 1) * limit;

    const countSql = `
      SELECT COUNT(*) as total 
      FROM employees_table
      INNER JOIN positions_category ON positions_category.id = employees_table.category_id
      INNER JOIN positions ON positions.id = employees_table.position_id
    `;
    
    const dataSql = `
      SELECT 
        employees_table.*,
        positions_category.category_name,
        positions.position_name
      FROM employees_table
      INNER JOIN positions_category ON positions_category.id = employees_table.category_id
      INNER JOIN positions ON positions.id = employees_table.position_id
      LIMIT ? OFFSET ?
    `;

    db.query(countSql, (countErr, countResult) => {
      if (countErr) {
        return callback(countErr, null);
      }

      const total = countResult[0].total;

      db.query(dataSql, [Number(limit), Number(offset)], (dataErr, employees) => {
        if (dataErr) {
          return callback(dataErr, null);
        }

        callback(null, {
          employees,
          total,
          page: Number(page),
          totalPages: Math.ceil(total / limit)
        });
      });
    });
  },
  // getAll: (page = 1, limit = 10, callback) => {
  //   // Calculate offset
  //   const offset = (page - 1) * limit;

  //   // First query to get total count
  //   const countSql = `SELECT COUNT(*) as total FROM employees_table`;
    
  //   // Second query to get paginated data
  //   const dataSql = `
  //     SELECT * FROM employees_table 
  //     LIMIT ? OFFSET ?
  //   `;

  //   // Executing count query first
  //   db.query(countSql, (countErr, countResult) => {
  //     if (countErr) {
  //       return callback(countErr, null);
  //     }

  //     const total = countResult[0].total;

  //     // Then execute data query with pagination
  //     db.query(dataSql, [Number(limit), Number(offset)], (dataErr, employees) => {
  //       if (dataErr) {
  //         return callback(dataErr, null);
  //       }

  //       // Return both the paginated data and total count
  //       callback(null, {
  //         employees,
  //         total,
  //         page: Number(page),
  //         totalPages: Math.ceil(total / limit)
  //       });
  //     });
  //   });
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

  getUpdate: (id, callback) => {
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

  // Get total employees
  totalEmployees: (callback: Function) => {
    const sql = `SELECT COUNT(*) as total FROM employees_table`
    db.query(sql, (err, data) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, data[0].total)
      }
    })
  },
  

  // Uploading image
  addProfileImage: (employeeId, filePath, callback) => {
    // SQL query to update an existing employee's profile image
    const sql = `
      UPDATE employees_table 
      SET profile_image = ?
      WHERE employee_id = ?
    `;
    
    // Simple validation
    if (!employeeId || !filePath) {
        return callback(new Error('Employee ID and file path are required'), null);
    }

    const imageValue = filePath.profile_image || filePath;
    
    db.query(sql, [imageValue, employeeId], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result); 
      }
    });
  },

  getProfileImage: (employeeId, callback) => {
    const sql = `
        SELECT profile_image 
        FROM employees_table
        WHERE employee_id = ?
    `;
    
    db.query(sql, [employeeId], (err, rows) => {
        if (err) {
            callback(err, null);
        } else if (!rows?.[0]) {
            callback(new Error('Employee not found'), null);
        } else {
            callback(null, rows[0]);
        }
    });
  },

  search: (searchTerm, page = 1, limit = 10, callback) => {
    let sql = `
      SELECT 
        employees_table.*, 
        positions_category.category_name, 
        positions.position_name 
      FROM employees_table
      INNER JOIN positions_category ON positions_category.id = employees_table.category_id
      INNER JOIN positions ON positions.id = employees_table.position_id
      WHERE 1=1
    `;
    const queryParams = [];

    // Add search filter
    if (searchTerm) {
      sql += " AND (employees_table.first_name LIKE ? OR employees_table.surname LIKE ?)";
      queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    // Add pagination
    const offset = (page - 1) * limit;
    sql += " LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);

    // Execute query
    db.query(sql, queryParams, (err, data) => {
      if (err) {
        callback(err, null);
        return;
      }

      // Get total count for pagination
      const countSql = `
        SELECT COUNT(*) as total 
        FROM employees_table
        INNER JOIN positions_category ON positions_category.id = employees_table.category_id
        INNER JOIN positions ON positions.id = employees_table.position_id
        WHERE 1=1
      ` + (searchTerm ? " AND (employees_table.first_name LIKE ? OR employees_table.surname LIKE ?)" : "");

      const countParams = searchTerm ? queryParams.slice(0, -2) : [];

      db.query(countSql, countParams, (countErr, countData) => {
        if (countErr) {
          callback(countErr, null);
          return;
        }

        callback(null, {
          employees: data,
          total: countData[0].total,
          page: page,
          limit: limit,
          totalPages: Math.ceil(countData[0].total / limit)
        });
      });
    });
  },

  // search: (searchTerm, page = 1, limit = 10, callback) => {
  //   let sql = "SELECT * FROM employees_table WHERE 1=1";
  //   const queryParams = [];

  //   if (searchTerm) {
  //     sql += " AND (first_name LIKE ? OR surname LIKE ?)";
  //     queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`);
  //   }

  //   // Add pagination
  //   const offset = (page - 1) * limit;
  //   sql += " LIMIT ? OFFSET ?";
  //   queryParams.push(limit, offset);

  //   // Execute query
  //   db.query(sql, queryParams, (err, data) => {
  //     if (err) {
  //       callback(err, null);
  //       return;
  //     }

  //     // Get total count for pagination
  //     const countSql = sql.replace("SELECT *", "SELECT COUNT(*) as total").split("LIMIT")[0];
  //     const countParams = queryParams.slice(0, -2);

  //     db.query(countSql, countParams, (countErr, countData) => {
  //       if (countErr) {
  //         callback(countErr, null);
  //         return;
  //       }

  //       callback(null, {
  //         employees: data,
  //         total: countData[0].total,
  //         page: page,
  //         limit: limit,
  //         totalPages: Math.ceil(countData[0].total / limit)
  //       });
  //     });
  //   });
  // },

  filter: (filterParams, callback) => {
    let sql = `
      SELECT 
        employees_table.*, 
        positions_category.category_name, 
        positions.position_name 
      FROM employees_table
      INNER JOIN positions_category ON positions_category.id = employees_table.category_id
      INNER JOIN positions ON positions.id = employees_table.position_id
      WHERE 1=1
    `;
    const queryParams = [];

    // Add civil status filter
    if (filterParams.civilStatus) {
      sql += " AND employees_table.civil_status = ?";
      queryParams.push(filterParams.civilStatus);
    }

    // Add department filter (if required)
    if (filterParams.department) {
      sql += " AND employees_table.department = ?";
      queryParams.push(filterParams.department);
    }

    // Add Position filter (if required)
    if (filterParams.position) {
      sql += " AND positions_category.category_name = ?";
      queryParams.push(filterParams.categoryName);
    }

    // // Add date range filter (if required)
    // if (filterParams.dateFrom && filterParams.dateTo) {
    //   sql += " AND employees_table.date_of_birth BETWEEN ? AND ?";
    //   queryParams.push(filterParams.dateFrom, filterParams.dateTo);
    // }

    // Add sorting
    if (filterParams.sortBy) {
      const validColumns = ['employee_id', 'first_name', 'surname', 'date_of_birth', 'civil_status', 'department'];
      const column = validColumns.includes(filterParams.sortBy) ? filterParams.sortBy : 'employee_id';
      const order = filterParams.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      sql += ` ORDER BY ${column} ${order}`;
    }

    // Add pagination
    const page = parseInt(filterParams.page) || 1;
    const limit = parseInt(filterParams.limit) || 10;
    const offset = (page - 1) * limit;
    sql += " LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);

    // Execute query
    db.query(sql, queryParams, (err, data) => {
      if (err) {
        callback(err, null);
        return;
      }

      // Get total count for pagination
      const countSql = `
        SELECT COUNT(*) as total 
        FROM employees_table
        INNER JOIN positions_category ON positions_category.id = employees_table.category_id
        INNER JOIN positions ON positions.id = employees_table.position_id
        WHERE 1=1
      ` + (filterParams.civilStatus ? " AND employees_table.civil_status = ?" : "")
        + (filterParams.department ? " AND employees_table.department = ?" : "")
        + (filterParams.dateFrom && filterParams.dateTo ? " AND employees_table.date_of_birth BETWEEN ? AND ?" : "");
        + (filterParams.category ? " AND positions_category.category_name = ?" : "");

      const countParams = queryParams.slice(0, -2); // Remove LIMIT and OFFSET parameters for the count query

      db.query(countSql, countParams, (countErr, countData) => {
        if (countErr) {
          callback(countErr, null);
          return;
        }

        callback(null, {
          employees: data,
          total: countData[0].total,
          page: page,
          limit: limit,
          totalPages: Math.ceil(countData[0].total / limit)
        });
      });
    });
  }

}
export default EmployeeModel