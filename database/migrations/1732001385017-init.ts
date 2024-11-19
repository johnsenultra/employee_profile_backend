import {MigrationInterface, QueryRunner} from "typeorm";

export class init1732001385017 implements MigrationInterface {
    name = 'init1732001385017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `employees_table` (`employee_id` int NOT NULL AUTO_INCREMENT, `surname` varchar(50) NOT NULL, `first_name` varchar(50) NULL, `name_extension` varchar(10) NOT NULL, `date_of_birth` date NULL, `place_of_birth` varchar(100) NULL, `sex` enum ('Male', 'Female') NULL, `citizenship_status` enum ('Filipino', 'Dual Citizenship') NULL, `civil_status` enum ('Single', 'Married', 'Widowed', 'Separated', 'Others') NULL, `email` varchar(100) NOT NULL, `telephone_no` varchar(20) NOT NULL, `mobile_number` varchar(20) NOT NULL, `height` decimal(20,0) NOT NULL, `weight` decimal(20,0) NOT NULL, `blood_type` varchar(20) NOT NULL, `gsis_no` varchar(50) NOT NULL, `pag_ibig_no` varchar(50) NOT NULL, `philhealth_no` varchar(50) NOT NULL, `sss_no` varchar(50) NOT NULL, `tin_no` varchar(50) NOT NULL, `agency_employee_no` varchar(50) NOT NULL, `dual_citizen_type` enum ('by birth', 'by naturalization') NOT NULL, `dual_citizen_details` text NOT NULL, `residential_house_no` varchar(100) NOT NULL, `residential_street` varchar(100) NOT NULL, `residential_subdivision` varchar(100) NOT NULL, `residential_barangay` varchar(100) NOT NULL, `residential_city` varchar(100) NOT NULL, `residential_province` varchar(100) NOT NULL, `residential_zipcode` varchar(50) NOT NULL, `permanent_house_no` varchar(100) NOT NULL, `permanent_street` varchar(100) NOT NULL, `permanent_subdivision` varchar(100) NOT NULL, `permanent_barangay` varchar(100) NOT NULL, `permanent_city` varchar(100) NOT NULL, `permanent_province` varchar(100) NOT NULL, `permanent_zipcode` varchar(50) NOT NULL, `middle_name` varchar(20) NULL, PRIMARY KEY (`employee_id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `family_information_table` (`id` int NOT NULL AUTO_INCREMENT, `employee_id` int NOT NULL, `spouse_surname` varchar(100) NOT NULL, `spouse_first_name` varchar(100) NOT NULL, `spouse_middle_name` varchar(20) NOT NULL, `spouse_name_extension` varchar(50) NOT NULL, `spouse_occupation` varchar(100) NOT NULL, `business_address` varchar(100) NOT NULL, `employer_name` varchar(100) NOT NULL, `spouse_telephone_no` varchar(50) NOT NULL, `father_surname` varchar(100) NOT NULL, `father_first_name` varchar(100) NOT NULL, `father_middle_name` varchar(20) NOT NULL, `father_name_extension` varchar(20) NOT NULL, `mother_maiden_name` varchar(100) NOT NULL, `mother_first_name` varchar(100) NOT NULL, `mother_middle_name` varchar(20) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `children_table` (`id` int NOT NULL AUTO_INCREMENT, `family_info_id` int NOT NULL, `children_fullname` varchar(100) NOT NULL, `child_date_of_birth` date NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `education_background_table` (`educational_id` int NOT NULL AUTO_INCREMENT, `employee_id` int NOT NULL, `education_level` enum ('Elementary', 'Secondary', 'Vocational/Trade Course', 'College', 'Graduate Studies', '') NOT NULL, `school_name` varchar(255) NOT NULL, `degree_or_course` varchar(255) NOT NULL, `period_from` year NOT NULL, `period_to` year NOT NULL, `years_graduated` year NOT NULL, `highest_level_unit_earned` varchar(255) NOT NULL, PRIMARY KEY (`educational_id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `family_information_table` ADD CONSTRAINT `FK_68f5448fe217de1f6ebd5996906` FOREIGN KEY (`employee_id`) REFERENCES `employees_table`(`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `children_table` ADD CONSTRAINT `FK_bcb7db4ca8530981e024c0eb4a9` FOREIGN KEY (`family_info_id`) REFERENCES `family_information_table`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `education_background_table` ADD CONSTRAINT `FK_cd0f81c198da701d1df90da682e` FOREIGN KEY (`employee_id`) REFERENCES `employees_table`(`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `education_background_table` DROP FOREIGN KEY `FK_cd0f81c198da701d1df90da682e`");
        await queryRunner.query("ALTER TABLE `children_table` DROP FOREIGN KEY `FK_bcb7db4ca8530981e024c0eb4a9`");
        await queryRunner.query("ALTER TABLE `family_information_table` DROP FOREIGN KEY `FK_68f5448fe217de1f6ebd5996906`");
        await queryRunner.query("DROP TABLE `education_background_table`");
        await queryRunner.query("DROP TABLE `children_table`");
        await queryRunner.query("DROP TABLE `family_information_table`");
        await queryRunner.query("DROP TABLE `employees_table`");
    }

}
