import db from '../utils/db';

export const OtherInfoModel = {
   // Add new record for other information
   addOtherInfo: (data: any, callback: any) => {
      const sql = `
         INSERT INTO other_info
         (employee_id, hobbies, recognition, membership)
         VALUES(?, ?, ?, ?)
      `;
      const values = [
         data.employee_id,
         data.hobbies,
         data.recognition,
         data.membership
      ];
      
      db.query(sql, values, (err: Error, data: any) => {
         if(err) {
            return callback(err, null);
         } else {
            return callback(null, data);
         }
      })
   },

   // Get all other information records for an employee
   getOtherInfo: (id: number, callback: any) => {
      const sql = `
         SELECT * FROM other_info
         WHERE employee_id = ?
      `;

      db.query(sql, [id], (err: Error, data: any) => {
         if(err) {
            return callback(err, null);
         }  else {
            return callback(null, data);
         }
      })
   },

   // Update other information record by its id
   updateOtherInfo: (other_info_id: number, otherInfoData: any, callback: any) => {
      const sql = `
         UPDATE other_info
         SET
            hobbies = ?,
            recognition = ?,
            membership = ?
         WHERE id = ?;
      `;
      const values = [
         otherInfoData.hobbies || null,
         otherInfoData.recognition || null,
         otherInfoData.membership || null,
         other_info_id
      ];

      db.query(sql, values, (err: Error, data: any) => {
         if(err) {
            return callback(err, null);
         } else {
            return callback(null, data);
         }
      })
   },

   // Delete other information record by its id
   deleteOtherInfo: (other_info_id: number, callback: any) => {
      const sql = `
         DELETE FROM other_info
         WHERE id = ?
      `;
   }
}