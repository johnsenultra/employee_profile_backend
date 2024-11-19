import { Factory, Seeder } from "typeorm-seeding"
import { Connection } from "typeorm"
import { Employee } from "../entities/employee.entity"

export default class CreateEmployees implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await factory(Employee)().createMany(10)
  }
}
