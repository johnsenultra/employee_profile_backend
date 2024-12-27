import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { FamilyInfo } from "../entities/family_info.entity";
import { Employee } from "../entities/employee.entity";
import { ChildrenInfo } from "../entities/child.entity"; // Import ChildrenInfo

export default class CreateFamily implements Seeder {
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

      // Assign FamilyInfo to each employee
      for (const employeeId of validEmployeeIds) {
         // Create FamilyInfo record
         const familyInfo = await factory(FamilyInfo)({ employeeId }).create();

         // Create ChildrenInfo for each FamilyInfo record
         // You can adjust the number of children or customize this logic as needed
         const numberOfChildren = Math.floor(Math.random() * 3); // For example, between 0 to 2 children per family

         for (let i = 0; i < numberOfChildren; i++) {
            // Create ChildrenInfo linked to the current FamilyInfo
            await factory(ChildrenInfo)({ familyInfo }).create();
         }

         console.log(`Created FamilyInfo and ${numberOfChildren} ChildrenInfo for Employee ${employeeId}`);
      }

      console.log("FamilyInfo seeding completed.");
   }
}
