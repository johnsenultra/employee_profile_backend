// models/VoluntaryWorkModel.ts
import db from "../utils/db"

const VoluntaryWorkModel = { 
   // Add a new voluntary work record
   addVoluntaryWorkRecord: (data, callback) => {
      const sql = `
         INSERT INTO voluntary_work
         (employee_id, organization_name, inclusive_date_from, inclusive_date_to, number_of_hours, nature_of_work)
         VALUES(?, ?, ?, ?, ?, ?)
      `;

      const values = [
         data.employee_id,
         data.organization_name,
         data.inclusive_date_from,
         data.inclusive_date_to,
         data.number_of_hours,
         data.nature_of_work
      ];

      db.query(sql, values, (err: any, data: any) => {
         if(err) {
            return callback(err, null);
         } else {
            return callback(null, data);
         }
      });
   },

   // Get all voluntary work records for an employee
   getVoluntaryWork: (id: number, callback: any) => {
      const sql = `
         SELECT * FROM voluntary_work
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

   // Update voluntary work record by its id
   updateVoluntaryWork: (voluntary_work_id: number, voluntaryWorkData: any, callback: any) => {
      const sql =`
         UPDATE voluntary_work
         SET 
            organization_name = ?,
            inclusive_date_from = ?,
            inclusive_date_to = ?,
            number_of_hours = ?,
            nature_of_work = ?
         WHERE id = ?;
      `;

      const values = [
         voluntaryWorkData.organization_name || null,
         voluntaryWorkData.inclusive_date_from || null,
         voluntaryWorkData.inclusive_date_to || null,
         voluntaryWorkData.number_of_hours || null,
         voluntaryWorkData.nature_of_work || null,
         voluntary_work_id
      ];
      db.query(sql, values, callback);
   },

   // Get update voluntary work details
   getUpdateVoluntaryWork: (id: number, callback: any) => {
      const sql = `
         SELECT * FROM voluntary_work
         WHERE employee_id = ?
      `;
      db.query(sql, [id], (err, data) => {
         if(err) {
            callback(err, null);
            console.log("[GET UPDATE VOLUNTARY WORK ERROR]: ", err);
         } else {
            callback(null, data);
         }
      });
   },

   // Delete a voluntary work record by its id
   deleteVoluntaryWork: (id: number, callback: any) => {
      const sql = `
         DELETE FROM voluntary_work
         WHERE id = ?
      `;
      db.query(sql, [id], (err, data) => {
         if(err) {
            callback(err, null);
            console.log("[DELETE VOLUNTARY WORK ERROR]: ", err);
         } else {
            callback(null, data);
            console.log("Voluntary work record deleted successfully!");
         }
      });
   }
};

export default VoluntaryWorkModel;