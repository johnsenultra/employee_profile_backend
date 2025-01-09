import db from "../utils/db"

const EducationalModel = { 
   // Add a new educational background record
   addEducationRecord: (data, callback) => {
      const sql = `
         INSERT INTO education_background_table
         (employee_id, education_level, school_name, degree_or_course, period_from, period_to, years_graduated, highest_level_unit_earned, academic_or_scholarship_recieved)
         VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
         data.employee_id,
         data.education_level,
         data.school_name,
         data.degree_or_course,
         data.period_from,
         data.period_to,
         data.years_graduated,
         data.highest_level_unit_earned,
         data.academic_or_scholarship_recieved
      ];

      db.query(sql, values, callback), (err: any, data: any) => {
         if(err) {
            return callback(err, null);
         } else {
            return callback(null, data);
         }
      }
   },

   // Get all education recors for an employee
   getEducation: (id: number, callback: any) => {
      const sql = `
         SELECT * FROM education_background_table
         WHERE employee_id = ?   
      `;
      db.query(sql, [id], (err, data) => {
         if (err) {
            callback(err, null);
         } else {
            callback(null, data);
         }
      })
      
   },

   // Update educational record by its id
   updateEducation: (educational_id: number, educationData: any, callback: any) => {
      const sql =`
         UPDATE education_background_table
         SET 
            education_level = ?,
            school_name = ?,
            degree_or_course = ?,
            period_from = ?,
            period_to = ?,
            years_graduated = ?,
            highest_level_unit_earned = ?,
            academic_or_scholarship_recieved = ?
         WHERE educational_id = ?;
      `

      const values = [
         educationData.education_level,
         educationData.school_name,
         educationData.degree_or_course || null,
         educationData.period_from || null,
         educationData.period_to || null,
         educationData.years_graduated || null,
         educationData.highest_level_unit_earned || null,
         educationData.academic_or_scholarship_recieved || null,
         educational_id
      ];
      db.query(sql, values, callback);
   },

   // getUpdate education details
   getUpdateEducation: (id: number, callback: any) => {
      const sql = `
         SELECT * FROM education_background_table
         WHERE employee_id = ?
      `
      db.query(sql, [id], (err, data) => {
         if(err) {
            callback(err, null);
            console.log("[GET UPDATE EDUCATION ERROR]: ", err);
         } else {
            callback(null, data);
         }
      })
   },

   // Delete an educational record by its id
   deleteEducation: (id: number, callback: any) => {
      const sql = `
         DELETE FROM education_background_table
         WHERE education_id = ?
      `;
      db.query(sql, [id], (err, data) => {
         if(err) {
            callback(err, null);
            console.log("[DELETE EDUCATION ERROR]: ", err);
         } else {
            callback(null, data);
            console.log("Education record deleted successfully!");
         }
      })
   }
}
export default EducationalModel;