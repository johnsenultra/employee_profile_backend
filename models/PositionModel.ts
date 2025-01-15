import db from "../utils/db"

// Position Model
interface EmployeeData {
   position_id: number;
   category_id: number;
 }

const PositionModel = {
   // Create position category
   createCategory: (categoryData: any, callback: any) => {
      const sql = `
         INSERT INTO positions_category SET ?
      `
      db.query(sql, categoryData, (err, data) => {
         if(err) {
            callback(err, null);
         } else {
            callback(null, data);
         }
      })
   },

   // Create position
   createPosition: (positionData: any, callback: any) => {
      const sql = `
         INSERT INTO positions
            (id, position_name, category_id)
            VALUES (?, ?, ?)
         `
         const values = [
            positionData.id,
            positionData.position_name,
            positionData.category_id
         ]
      db.query(sql, values, (err, data) => {
         if(err) {
            callback(err, null);
         } else {
            callback(null, data);
         }
      })
   }, 

   // Get all categories with positions
   getAllCategories: (page: number, limit: number, callback: any) => {
      const offset = (page - 1) * limit;
      
      const countSql = `
        SELECT COUNT(*) as total
        FROM positions_category
      `;
  
      const sql = `
        SELECT 
          pc.*,
          GROUP_CONCAT(
            CONCAT('{',
              '"id":', COALESCE(p.id, 'null'), ',',
              '"position_name":"', COALESCE(p.position_name, ''), '"',
            '}')
          ) as positions
        FROM positions_category pc
        LEFT JOIN positions p ON pc.id = p.category_id
        GROUP BY pc.id
        LIMIT ? OFFSET ?
      `;
  
      db.query(countSql, (countErr, countData) => {
        if (countErr) {
          return callback(countErr, null);
        }
  
        const total = countData[0].total;
  
        db.query(sql, [limit, offset], (err, data) => {
          if (err) {
            return callback(err, null);
          }
  
          const formattedData = (data as any[]).map((row: any) => ({
            ...row,
            positions: row.positions ? `[${row.positions}]` : '[]'
          }));
  
          callback(null, {
            data: formattedData,
            total
          });
        });
      });
    },

   // Get positions by category
   getPositionsByCategory: (categoryId: number, callback: any) => {
      const sql = `
      SELECT p.*, pc.category_name
      FROM positions p
      JOIN positions_category pc ON p.category_id = pc.id
      WHERE p.category_id = ?
      `
      db.query(sql, [categoryId], (err, data) => {
      if (err) {
         callback(err, null)
      } else {
         callback(null, data)
      }
      })
   },

   // Get position by ID
   getPositionById: (id: number, callback: any) => {
      const sql = `
      SELECT p.*, pc.category_name
      FROM positions p
      JOIN positions_category pc ON p.category_id = pc.id
      WHERE p.id = ?
      `
      db.query(sql, [id], (err, data) => {
      if (err) {
         callback(err, null)
      } else {
         callback(null, data[0])
      }
      })
   },

   // Update employee position
   updateEmployeePosition: (employee_id: number, employeeData: EmployeeData, callback: Function) => {
      // Input validation
      if (!Number.isInteger(employee_id) || employee_id <= 0) {
         return callback(new Error('Invalid employee ID'), null);
      }
      
      if (!employeeData.position_id || !employeeData.category_id) {
         return callback(new Error('Position ID and Category ID are required'), null);
      }
  
      const sql = `
         UPDATE employees_table 
         SET position_id = ?, category_id = ?
         WHERE employee_id = ?
      `;
      
      const values = [
         employeeData.position_id,
         employeeData.category_id,
         employee_id
      ];
  
      db.query(sql, values, (err, result) => {
         if (err) {
            return callback(err, null);
         } else {
            callback(null, result);
            
         }
      });
   },

   // Get employee position details
   getEmployeePosition: (employeeId: number, callback: any) => {
      const sql = `
      SELECT 
         e.employee_id,
         e.first_name,
         e.surname,
         p.id as position_id,
         p.position_name as position_name,
         pc.id as category_id,
         pc.category_name
      FROM employees_table e
      LEFT JOIN positions p ON e.position_id = p.id
      LEFT JOIN positions_category pc ON p.category_id = pc.id
      WHERE e.employee_id = ?
      `
      db.query(sql, [employeeId], (err, data) => {
         if (err) {
            callback(err, null)
         } else {
            callback(null, data[0])
         }
      })
   },

   getTotalFaculty: (callback: Function) => {
      const sql = `
         SELECT COUNT(*) as totalFaculty
         FROM employees_table
         WHERE category_id = 1
      `
      db.query(sql, (err: Error, data: any) => {
         if (err) {
            callback(err, null)
         } else {
            return callback(null, data[0].totalFaculty)
         }
      })
   },

   // get total non teaching staff
   getTotalNonTeachingStaff: (callback: Function) => {
      const sql = `
         SELECT COUNT(*) as totalFaculty
         FROM employees_table
         WHERE category_id = 2
      `
      db.query(sql, (err: Error, data: any) => {
         if (err) {
            callback(err, null)
         } else {
            return callback(null, data[0].totalFaculty)
         }
      })
   },


   getAllEmployeesPositions: (page: number, limit: number, callback: Function) => {
      const offset = (page - 1) * limit;
  
      const countSql = `
        SELECT COUNT(*) as total
        FROM employees_table
      `;
  
      const sql = `
        SELECT 
          e.employee_id,
          e.first_name,
          e.surname,
          p.id as position_id,
          p.position_name,
          pc.id as category_id,
          pc.category_name
        FROM employees_table e
        LEFT JOIN positions p ON e.position_id = p.id
        LEFT JOIN positions_category pc ON p.category_id = pc.id
        ORDER BY e.employee_id
        LIMIT ? OFFSET ?
      `;
  
      db.query(countSql, (countErr, countData) => {
        if (countErr) {
          return callback(countErr, null);
        }
  
        const total = countData[0].total;
  
        db.query(sql, [limit, offset], (err, data) => {
          if (err) {
            return callback(err, null);
          }
  
          callback(null, {
            data,
            total
          });
        });
      });
    },


   // Search 
   // search: (searchTerm: string, callback: (err: Error | null, results: any) => void) => {
   //    const sql = `SELECT e.first_name, e.surname, p.position_name, pc.category_name
   //       FROM positions_category pc
   //       INNER JOIN employees_table e ON pc.id = e.category_id
   //       INNER JOIN positions p ON p.id = e.position_id
   //       WHERE LOWER(e.first_name) LIKE LOWER(?)
   //       OR LOWER(e.surname) LIKE LOWER(?)
   //       OR LOWER(p.position_name) LIKE LOWER(?)
   //       OR LOWR(pc.category_name) LIKE LOWER(?)`;
   
   //    const term = `%${searchTerm}%`;
 
   //    db.query(sql, [term, term, term], (err, data) => {
   //       if (err) {
   //          return callback(err, null);
   //       }
   //       return callback(null, data);
   //    });
   // }
   search: (searchTerm: string, callback: (err: Error | null, results: SearchResult[]) => void) => {
      const sql = `
         SELECT 
            e.first_name,
            e.surname,
            p.position_name,
            pc.category_name
         FROM positions_category pc
         INNER JOIN employees_table e ON pc.id = e.category_id
         INNER JOIN positions p ON p.id = e.position_id
         WHERE 
            LOWER(e.first_name) LIKE LOWER(?)
            OR LOWER(e.surname) LIKE LOWER(?)
            OR LOWER(p.position_name) LIKE LOWER(?)
            OR LOWER(pc.category_name) LIKE LOWER(?)
         ORDER BY e.first_name ASC`;
      
      const term = `%${searchTerm}%`;
      const params = [term, term, term, term];
      
      db.query(sql, params, (err, data) => {
         if (err) {
            return callback(err, null);
         }
         // Transform the results if needed
         const results = (data as SearchResult[]).map((row: SearchResult) => ({
            first_name: row.first_name || '',
            surname: row.surname || '',
            position_name: row.position_name || 'Unspecified Position',
            category_name: row.category_name || 'Unspecified Category'
         }));
         return callback(null, results);
      });
   }
}
interface SearchResult {
   first_name: string;
   surname: string;
   position_name: string;
   category_name: string;
}

export default PositionModel
