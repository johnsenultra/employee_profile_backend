// database/factories/user.factory.ts
import { define } from "typeorm-seeding";
import { User } from "../entities/user.entity";
import Faker from "faker";
import { hashPassword } from "../../utils/bcrypt";
import { Employee } from "../entities/employee.entity";

define(User, (faker: typeof Faker, context?: { employee: Employee }) => {
    const user = new User();
    
    user.username = context?.employee?.username || faker.internet.userName();
   //  user.password = faker.internet.password(); // Will be hashed in beforeInsert
    user.userType = context?.employee?.userType || faker.random.arrayElement(["staff", "admin"] as const);
    user.employee = context?.employee;

    return user;
});
