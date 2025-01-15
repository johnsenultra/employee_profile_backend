import { Factory, Seeder } from "typeorm-seeding";
import { Position } from "../entities/position.entity";
import { PositionCategory } from "../entities/position_category.entity";
import { Connection } from "typeorm";

export default class CreatePositions implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<void> {
        // Create Faculty category and positions
        const facultyCategory = await factory(PositionCategory)().create({
            categoryName: "Faculty"
        });

        await Promise.all(
            [
                "Instructor I",
                "Instructor II",
                "Instructor III",
                "Assistant Professor I",
                "Assistant Professor II",
                "Assistant Professor III",
                "Assistant Professor IV",
                "Associate Professor I",
                "Associate Professor II",
                "Associate Professor III",
                "Associate Professor IV",
                "Associate Professor V",
                "Professor I",
                "Professor II",
                "Professor III",
                "Professor IV",
                "Professor V",
                "Professor VI",
                "University Professor I",
            ]
                .map(async (name) => {
                    await factory(Position)().create({
                        position_name: name,
                        category: facultyCategory
                    });
                })
        );

        // Create Non-Teaching Staff category and positions
        const nonTeachingCategory = await factory(PositionCategory)().create({
            categoryName: "Non-Teaching Staff"
        });

        await Promise.all(
            [
                "Accountant III",
                "Administrative Aide II",
                "Administrative Aide III",
                "Administrative Aide IV",
                "Administrative Aide V",
                "Administrative Aide VI",
                "Administrative Assistant I",
                "Administrative Assistant III",
                "Administrative Assistant IV",
                "Administrative Assistant V",
                "Administrative Assistant VI",
                "Administrative Officer I",
                "Administrative Officer II",
                "Administrative Officer III",
                "Administrative Officer IV",
                "Administrative Officer V",
                "Agriculturist I",
                "Agriculturist I",
                "Armorer II",
                "Chief Admin. Officer",
                "College Librarian I",
                "College Librarian III",
                "Dentail Aide",
                "Dentis II",
                "Dormitory Manager I",
                "Draftsman I",
                "Driver Courier",
                "Executive Assistant I",
                "Executive Assistant II",
                "Fare Foreman",
                "Farm Worker",
                "Guidance Counselor II",
                "Internal Auditoe I",
                "Laboratory Aide I",
                "Laboratory Aide II",
                "Librarian Aide",
                "Nurse III",
                "Registrar II",
                "Science Research assistant",
                "Science Research Specialist I",
                "Security Guard II",
                "Security Officer III",
                "Senior Administrative Assistant I",
                "Senior Administrative Assistant II",
                "SUC President III",
                "Supervising Administrative Officer",
                "Veterinarian II",
            ].map(async (name) => {
                await factory(Position)().create({
                    position_name: name,
                    category: nonTeachingCategory
                });
            })
        );
    }
}
