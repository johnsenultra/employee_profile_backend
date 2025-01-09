import db from "../utils/db";

const trainingProgramModel = {
   // Add new training program record
   addTraining: (data, callback) => {
      const sql = `
         INSERT INTO training
         (employee_id, title_training_programs, period_date_from, period_date_to, number_of_hours, type_of_LD, conducted_by)
         VALUES(?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
         data.employee_id,
         data.title_training_programs,
         data.period_date_from,
         data.period_date_to,
         data.number_of_hours,
         data.type_of_LD,
         data.conducted_by
      ];
      db.query(sql, values, (err: any, data: any) => {
         if(err) {
            return callback(err, null);
         } else {
            return callback(null, data);
         }
      });
   },

   // Get all training program records for an employee
   getTraining: (id: number, callback: any) => {
      const sql = `
         SELECT * FROM training
         WHERE employee_id = ?
      `;
      db.query(sql, [id], (err, data) => {
        if(err) {
         return callback(err, null);
        } else {
         return callback(null, data);
        }
      })
   },

   updateTraining: (training_program_id: number, trainingProgramData: any, callback: any) => {
      const sql = `
         UPDATE training
         set
            title_training_programs = ?,
            period_date_from = ?,
            period_date_to = ?,
            number_of_hours = ?,
            type_of_LD = ?,
            conducted_by = ?
         WHERE id = ?
      `;
      const values = [
         trainingProgramData.title_training_programs || null,
         trainingProgramData.period_date_from || null,
         trainingProgramData.period_date_to || null,
         trainingProgramData.number_of_hours || null,
         trainingProgramData.type_of_LD || null,
         trainingProgramData.conducted_by || null,
         training_program_id
      ];

      db.query(sql, values, (err: Error, data: any) => {
         if(err) {
            return callback(err, null);
         } else {
            return callback(null, data);
         }
      })
   },

   // Get update training program details
   getUpdateTrainingProgram: (id: number, callback: any) => {
      const sql = `
         SELECT * FROM training_programs_table
         WHERE employee_id = ?
      `;
      db.query(sql, [id], (err, data) => {
         if(err) {
            callback(err, null);
            console.log("[GET UPDATE TRAINING PROGRAM ERROR]: ", err);
         } else {
            callback(null, data);
         }
      });
   },

   // Delete training program record by its id
   deleteTraining: (id: number, callback: any) => {
      const sql = `
         DELETE FROM training
         WHERE id = ?

      `;
      db.query(sql, [id], (err: Error, data: any) => {
         if(err) {
            return callback(err, null);
         } else {
            return callback(null, data);
         }
      })
   }
}

export default trainingProgramModel;