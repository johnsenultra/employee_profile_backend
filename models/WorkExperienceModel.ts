// models/WorkExperienceModel.ts
import db from "../utils/db"

const WorkExperienceModel = { 
   // Add a new work experience record
   addWorkExperienceRecord: (data, callback) => {
      const sql = `
         INSERT INTO work_experience
         (employee_id, inclusive_date_from, inclusive_date_to, position, department, monthly_salary, salary_grade, status_of_appointment, government_service)
         VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
         data.employee_id,
         data.inclusive_date_from,
         data.inclusive_date_to,
         data.position,
         data.department,
         data.monthly_salary,
         data.salary_grade,
         data.status_of_appointment,
         data.government_service
      ];

      db.query(sql, values, (err: any, data: any) => {
         if(err) {
            return callback(err, null);
         } else {
            return callback(null, data);
         }
      });
   },

   // Get all work experience records for an employee
   getWorkExperience: (id: number, callback: any) => {
      const sql = `
         SELECT * FROM work_experience
         WHERE employee_id = ?   
      `;
      db.query(sql, [id], (err, data) => {
         if (err) {
            callback(err, null);
         } else {
            callback(null, data);
         }
      });
   },

   // Update work experience record by its id
   updateWorkExperience: (work_experience_id: number, workExperienceData: any, callback: any) => {
      const sql =`
         UPDATE work_experience
         SET 
            inclusive_date_from = ?,
            inclusive_date_to = ?,
            position = ?,
            department = ?,
            monthly_salary = ?,
            salary_grade = ?,
            status_of_appointment = ?,
            government_service = ?
         WHERE id = ?;
      `;

      const values = [
         workExperienceData.inclusive_date_from || null,
         workExperienceData.inclusive_date_to || null,
         workExperienceData.position || null,
         workExperienceData.department || null,
         workExperienceData.monthly_salary || null,
         workExperienceData.salary_grade || null,
         workExperienceData.status_of_appointment || null,
         workExperienceData.government_service || null,
         work_experience_id
      ];
      db.query(sql, values, callback);
   },

   // Get update work experience details
   getUpdateWorkExperience: (id: number, callback: any) => {
      const sql = `
         SELECT * FROM work_experience
         WHERE employee_id = ?
      `;
      db.query(sql, [id], (err, data) => {
         if(err) {
            callback(err, null);
            console.log("[GET UPDATE WORK EXPERIENCE ERROR]: ", err);
         } else {
            callback(null, data);
         }
      });
   },

   // Delete a work experience record by its id
   deleteWorkExperience: (id: number, callback: any) => {
      const sql = `
         DELETE FROM work_experience
         WHERE id = ?
      `;
      db.query(sql, [id], (err, data) => {
         if(err) {
            callback(err, null);
            console.log("[DELETE WORK EXPERIENCE ERROR]: ", err);
         } else {
            callback(null, data);
            console.log("Work experience record deleted successfully!");
         }
      });
   }
};

export default WorkExperienceModel;