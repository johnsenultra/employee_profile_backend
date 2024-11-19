import { Connection, getRepository } from "typeorm"
import { Factory, Seeder } from "typeorm-seeding"
import { hashPassword } from "../../utils/bcrypt"
import { Employee } from "../entities/employee.entity"

export default class GeneratePassword implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const employeeRepo = getRepository(Employee)
    const employess = await employeeRepo.find()
    const updatedEmployess = await Promise.all(
      employess.map(async (employee) => ({
        ...employee,
        password: await hashPassword("admin123"),
      }))
    )
    await employeeRepo.save(updatedEmployess)
  }
}
