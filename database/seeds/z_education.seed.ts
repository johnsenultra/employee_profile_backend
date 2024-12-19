// education.seed.ts
import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { Employee } from "../entities/employee.entity";
import { EducationBackground } from "../entities/education_background.entity"; // Import EducationInfo

export default class CreateEducation implements Seeder {
   public async run(factory: Factory, connection: Connection): Promise<void> {
      // Fetch all employee IDs from the database
      const employeeIds = await connection
         .getRepository(Employee)
         .createQueryBuilder("employee")
         .select("employee.employeeId")
         .getMany();

      console.log("Fetched employee IDs:", employeeIds); // Debugging

      const validEmployeeIds = employeeIds.map((e) => e.employeeId);

      if (validEmployeeIds.length === 0) {
         console.error("No valid employees found in the database.");
         throw new Error("No employees found. Seed employees first.");
      }

      // Assign EducationInfo to each employee
      for (const employeeId of validEmployeeIds) {
         // Create EducationInfo record and link it to the employee
         await factory(EducationBackground)({ employeeId }).create();
         console.log(`Created EducationInfo for Employee ${employeeId}`);
      }

      console.log("EducationInfo seeding completed.");
   }
}
