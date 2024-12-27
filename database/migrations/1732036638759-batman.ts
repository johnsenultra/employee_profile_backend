import {MigrationInterface, QueryRunner} from "typeorm";

export class batman1732036638759 implements MigrationInterface {
    name = 'batman1732036638759'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`user_id\` INT NOT NULL AUTO_INCREMENT,
                \`username\` VARCHAR(50) NOT NULL UNIQUE,
                \`password\` VARCHAR(255) NOT NULL,
                \`role\` ENUM('staff', 'admin') NOT NULL DEFAULT 'staff',
                PRIMARY KEY (\`user_id\`)
            ) ENGINE=InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`employees_table\`
            DROP COLUMN \`username\`,
            DROP COLUMN \`password\`,
            ADD COLUMN \`user_id\` INT NULL,
            ADD CONSTRAINT \`FK_employees_users\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE SET NULL ON UPDATE CASCADE
        `);
        await queryRunner.query("CREATE TABLE `employees_table` (`employee_id` int NOT NULL AUTO_INCREMENT, `surname` varchar(50) NOT NULL, `first_name` varchar(50) NULL, `name_extension` varchar(10) NOT NULL, `date_of_birth` date NULL, `place_of_birth` varchar(100) NULL, `sex` enum ('Male', 'Female') NULL, `citizenship_status` enum ('Filipino', 'Dual Citizenship') NULL, `civil_status` enum ('Single', 'Married', 'Widowed', 'Separated', 'Others') NULL, `email` varchar(100) NOT NULL, `telephone_no` varchar(20) NOT NULL, `mobile_number` varchar(20) NOT NULL, `height` decimal(20,0) NOT NULL, `weight` decimal(20,0) NOT NULL, `blood_type` varchar(20) NOT NULL, `gsis_no` varchar(50) NOT NULL, `pag_ibig_no` varchar(50) NOT NULL, `philhealth_no` varchar(50) NOT NULL, `sss_no` varchar(50) NOT NULL, `tin_no` varchar(50) NOT NULL, `agency_employee_no` varchar(50) NOT NULL, `dual_citizen_type` enum ('by birth', 'by naturalization') NOT NULL, `dual_citizen_details` text NOT NULL, `residential_house_no` varchar(100) NOT NULL, `residential_street` varchar(100) NOT NULL, `residential_subdivision` varchar(100) NOT NULL, `residential_barangay` varchar(100) NOT NULL, `residential_city` varchar(100) NOT NULL, `residential_province` varchar(100) NOT NULL, `residential_zipcode` varchar(50) NOT NULL, `permanent_house_no` varchar(100) NOT NULL, `permanent_street` varchar(100) NOT NULL, `permanent_subdivision` varchar(100) NOT NULL, `permanent_barangay` varchar(100) NOT NULL, `permanent_city` varchar(100) NOT NULL, `permanent_province` varchar(100) NOT NULL, `permanent_zipcode` varchar(50) NOT NULL, `middle_name` varchar(20) NULL, `username` varchar(20) NULL, `password` varchar(255) NOT NULL, `employee_type` enum ('staff', 'admin') NOT NULL DEFAULT 'staff', UNIQUE INDEX `IDX_bccb4e20325ef199632a5275d4` (`username`), PRIMARY KEY (`employee_id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `family_information_table` (`id` int NOT NULL AUTO_INCREMENT, `employee_id` int NOT NULL, `spouse_surname` varchar(100) NOT NULL, `spouse_first_name` varchar(100) NOT NULL, `spouse_middle_name` varchar(20) NOT NULL, `spouse_name_extension` varchar(50) NOT NULL, `spouse_occupation` varchar(100) NOT NULL, `business_address` varchar(100) NOT NULL, `employer_name` varchar(100) NOT NULL, `spouse_telephone_no` varchar(50) NOT NULL, `father_surname` varchar(100) NOT NULL, `father_first_name` varchar(100) NOT NULL, `father_middle_name` varchar(20) NOT NULL, `father_name_extension` varchar(20) NOT NULL, `mother_maiden_name` varchar(100) NOT NULL, `mother_first_name` varchar(100) NOT NULL, `mother_middle_name` varchar(20) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `children_table` (`id` int NOT NULL AUTO_INCREMENT, `family_info_id` int NOT NULL, `children_fullname` varchar(100) NOT NULL, `child_date_of_birth` date NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `education_background_table` (`educational_id` int NOT NULL AUTO_INCREMENT, `employee_id` int NOT NULL, `education_level` enum ('Elementary', 'Secondary', 'Vocational/Trade Course', 'College', 'Graduate Studies', '') NOT NULL, `school_name` varchar(255) NOT NULL, `degree_or_course` varchar(255) NOT NULL, `period_from` year NOT NULL, `period_to` year NOT NULL, `years_graduated` year NOT NULL, `highest_level_unit_earned` varchar(255) NOT NULL, PRIMARY KEY (`educational_id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `work_experience` (`id` int NOT NULL AUTO_INCREMENT, `employee_id` int NOT NULL, `inclusive_date_from` date NOT NULL, `inclusive_date_to` date NOT NULL, `position` varchar(100), `department` varchar(255), `monthly_salary` decimal(10,2), `salary_grade` varchar(50), `status_of_appointment` varchar(100), `government_service` BOOLEAN, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `service_eligibity` (`id` int NOT NULL AUTO_INCREMENT, `employee_id` int NOT NULL, `career_service` varchar(255), `rating` decimal(5,2), `date_of_examination` date, `place_of_examination` varchar(255), `license_number` varchar(50) PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `voluntary_work` (`id` int NOT NULL AUTO_INCREMENT, `employee_id` int NOT NULL, `organization_name` varchar(255), `inclusive_date_from` date, `inclusive_date_to` date, `number_of_hours` int, `nature_of_work` varchar(255), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `training` (`id` int NOT NULL AUTO_INCREMENT, `employee_id` int NOT NULL, `title_training_programs` varchar(255), `period_from` date, `period_to` date, `number_of_hours` int, `conducted_by` varchar(255), PRIMARY KEY (`id`)) ENGINE=InnoDB");

        await queryRunner.query("ALTER TABLE `family_information_table` ADD CONSTRAINT `FK_68f5448fe217de1f6ebd5996906` FOREIGN KEY (`employee_id`) REFERENCES `employees_table`(`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `children_table` ADD CONSTRAINT `FK_bcb7db4ca8530981e024c0eb4a9` FOREIGN KEY (`family_info_id`) REFERENCES `family_information_table`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `education_background_table` ADD CONSTRAINT `FK_cd0f81c198da701d1df90da682e` FOREIGN KEY (`employee_id`) REFERENCES `employees_table`(`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `work_experience` ADD CONSTRAINT `FK_68f5448fe217de1f6ebd5996906` FOREIGN KEY (`employee_id`) REFERENCES `employees_table`(`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `service_eligibity` ADD CONSTRAINT `FK_68f5448fe217de1f6ebd5996907` FOREIGN KEY (`employee_id`) REFERENCES `employees_table`(`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `voluntary_work` ADD CONSTRAINT `FK_68f5448fe217de1f6ebd5996908` FOREIGN KEY (`employee_id`) REFERENCES `employees_table`(`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `training` ADD CONSTRAINT `FK_68f5448fe217de1f6eb5996909` FOREIGN KEY (`employee_id`) REFERENCES `employees_table`(`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `education_background_table` DROP FOREIGN KEY `FK_cd0f81c198da701d1df90da682e`");
        await queryRunner.query("ALTER TABLE `voluntary_work` DROP FOREIGN KEY `FK_68f5448fe217de1f6ebd5996906`");
        await queryRunner.query("ALTER TABLE `service_eligibity` DROP FOREIGN KEY `FK_68f5448fe217de1f6ebd5996906`");
        await queryRunner.query("ALTER TABLE `work_experience` DROP FOREIGN KEY `FK_68f5448fe217de1f6ebd5996906`");
        await queryRunner.query("ALTER TABLE `children_table` DROP FOREIGN KEY `FK_bcb7db4ca8530981e024c0eb4a9`");
        await queryRunner.query("ALTER TABLE `family_information_table` DROP FOREIGN KEY `FK_68f5448fe217de1f6ebd5996906`");
        await queryRunner.query("DROP TABLE `training`");
        await queryRunner.query("DROP TABLE `voluntary_work`");
        await queryRunner.query("DROP TABLE `service_eligibity`");
        await queryRunner.query("DROP TABLE `work_experience`");
        await queryRunner.query("DROP TABLE `education_background_table`");
        await queryRunner.query("DROP TABLE `children_table`");
        await queryRunner.query("DROP TABLE `family_information_table`");
        await queryRunner.query("DROP INDEX `IDX_bccb4e20325ef199632a5275d4` ON `employees_table`");
        await queryRunner.query("DROP TABLE `employees_table`");
        await queryRunner.query("ALTER TABLE `employees_table` DROP FOREIGN KEY `FK_employees_users`");
        await queryRunner.query("ALTER TABLE `employees_table` DROP COLUMN `user_id`");
        await queryRunner.query(`
            ALTER TABLE \`employees_table\`
            ADD COLUMN \`username\` VARCHAR(20) NULL,
            ADD COLUMN \`password\` VARCHAR(255) NOT NULL
        `);
        await queryRunner.query("DROP TABLE `users`");

    }

}
