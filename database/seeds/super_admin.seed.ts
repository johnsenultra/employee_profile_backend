// database/seeds/create-super-admin.seed.ts

import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { SuperAdmin } from "../entities/super_admin.entity";
import { hashPassword } from "../../utils/bcrypt";

export default class CreateSuperAdmin implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<void> {
        const superAdminRepository = connection.getRepository(SuperAdmin);

        // Check if super admin already exists
        const existingSuperAdmin = await superAdminRepository.findOne({
            where: { username: "superadmin" }
        });

        if (!existingSuperAdmin) {
            // Create hashed password
            const hashedPassword = await hashPassword("superadmin123"); // You can change this default password

            // Create super admin
            const superAdmin = superAdminRepository.create({
               username: "superadmin",
               password: hashedPassword,
               userType: "super_admin",
               isActive: true
            });

            await superAdminRepository.save(superAdmin);
            
            console.log("Super Admin seeded successfully!");
        } else {
            console.log("Super Admin already exists, skipping seed.");
        }
    }
}