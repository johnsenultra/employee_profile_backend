// database/seeds/employees.seed.ts
import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { Employee } from "../entities/employee.entity";
import { User } from "../entities/user.entity";

export default class CreateEmployees implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    // Create employees with associated users
    await factory(Employee)()
    .map(async (employee: Employee) => {
      // Create a user for each employee
      const user = await factory(User)({ employee }).create();
      employee.user = user;
      return employee;
    })
    .createMany(10);
  }
}