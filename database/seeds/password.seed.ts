import { Connection, getRepository } from "typeorm"
import { Factory, Seeder } from "typeorm-seeding"
import { hashPassword } from "../../utils/bcrypt"
import { User } from "../entities/user.entity"

export default class GeneratePassword implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const userRepo = getRepository(User)
    const users = await userRepo.find()
    const updatedEmployess = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await hashPassword("admin123"),
      }))
    )
    await userRepo.save(updatedEmployess)
  }
}
