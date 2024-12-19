import db from "../utils/db"

const ServiceEligibilityModel = { 
   // Add a new service eligibility record
   addServiceEligibilityRecord: (data: any, callback: any) => {
      const sql = `
         INSERT INTO service_eligibity
         (employee_id, career_service, rating, date_of_examination, place_of_examination, license_number)
         VALUES(?, ?, ?, ?, ?, ?)
      `;

      const values = [
         data.employee_id,
         data.career_service,
         data.rating,
         data.date_of_examination,
         data.place_of_examination,
         data.license_number
      ];

      db.query(sql, values, (err: any, data: any) => {
         if(err) {
            return callback(err, null);
         } else {
            return callback(null, data);
         }
      });
   },

   // Get all service eligibility records for an employee
   getServiceEligibility: (id: number, callback: any) => {
      const sql = `
         SELECT * FROM service_eligibity
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

   // Update service eligibility record by its id
   updateServiceEligibility: (service_eligibility_id: number, serviceEligibilityData: any, callback: any) => {
      const sql =`
         UPDATE service_eligibity
         SET 
            career_service = ?,
            rating = ?,
            date_of_examination = ?,
            place_of_examination = ?,
            license_number = ?
         WHERE id = ?;
      `;

      const values = [
         serviceEligibilityData.career_service || null,
         serviceEligibilityData.rating || null,
         serviceEligibilityData.date_of_examination || null,
         serviceEligibilityData.place_of_examination || null,
         serviceEligibilityData.license_number || null,
         service_eligibility_id
      ];
      db.query(sql, values , (err: Error, data: any) => {
         if(err) {
            return callback(err, null);
         } else {
            return callback(null, data);
         }
      });
   },

   // Get update service eligibility details
   getUpdateServiceEligibility: (id: number, callback: any) => {
      const sql = `
         SELECT * FROM service_eligibity
         WHERE employee_id = ?
      `;
      db.query(sql, [id], (err, data) => {
         if(err) {
            return callback(err, null);
         } else {
            return callback(null, data);
         }
      });
   },

   // Delete a service eligibility record by its id
   deleteServiceEligibility: (id: number, callback: any) => {
      const sql = `
         DELETE FROM service_eligibity
         WHERE id = ?
      `;
      db.query(sql, [id], (err, data) => {
         if(err) {
            callback(err, null);
            console.log("[DELETE SERVICE ELIGIBILITY ERROR]: ", err);
         } else {
            callback(null, data);
            console.log("Service eligibility record deleted successfully!");
         }
      });
   }
};

export default ServiceEligibilityModel;