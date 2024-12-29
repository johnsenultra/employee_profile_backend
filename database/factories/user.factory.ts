import { define } from "typeorm-seeding";
import { User } from "../entities/user.entity";
import Faker from "faker";

// define(User, (faker: typeof Faker, context?: { employee: Employee }) => {
//     const user = new User();
    
//     user.username = context?.employee?.username || faker.internet.userName();
//    //  user.password = faker.internet.password(); // Will be hashed in beforeInsert
//     user.userType = context?.employee?.userType || faker.random.arrayElement(["staff", "admin"] as const);
//     user.employee = context?.employee;

//     return user;
// });

define(User, (faker: typeof Faker, ) => {
    const user = new User();
    
    user.username = faker.internet.userName();
    user.password = (faker.internet.password());
    user.userType = faker.random.arrayElement(["staff", "admin"] as const);

    return user;
})