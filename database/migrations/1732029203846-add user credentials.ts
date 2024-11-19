import {MigrationInterface, QueryRunner} from "typeorm";

export class addUserCredentials1732029203846 implements MigrationInterface {
    name = 'addUserCredentials1732029203846'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `family_information_table` DROP FOREIGN KEY `fk_family_information_employees_employee_id`");
        await queryRunner.query("ALTER TABLE `children_table` DROP FOREIGN KEY `fk_children_family_id`");
        await queryRunner.query("ALTER TABLE `education_background_table` DROP FOREIGN KEY `fk_educational_employee_id`");
        await queryRunner.query("ALTER TABLE `employees_table` ADD `username` varchar(20) NULL");
        await queryRunner.query("ALTER TABLE `employees_table` ADD UNIQUE INDEX `IDX_bccb4e20325ef199632a5275d4` (`username`)");
        await queryRunner.query("ALTER TABLE `employees_table` ADD `password` varchar(20) NULL");
        await queryRunner.query("ALTER TABLE `employees_table` ADD `employee_type` enum ('staff', 'admin') NOT NULL DEFAULT 'staff'");
        await queryRunner.query("ALTER TABLE `employees_table` CHANGE `first_name` `first_name` varchar(50) NULL");
        await queryRunner.query("ALTER TABLE `employees_table` CHANGE `date_of_birth` `date_of_birth` date NULL");
        await queryRunner.query("ALTER TABLE `employees_table` CHANGE `place_of_birth` `place_of_birth` varchar(100) NULL");
        await queryRunner.query("ALTER TABLE `employees_table` CHANGE `sex` `sex` enum ('Male', 'Female') NULL");
        await queryRunner.query("ALTER TABLE `employees_table` CHANGE `citizenship_status` `citizenship_status` enum ('Filipino', 'Dual Citizenship') NULL");
        await queryRunner.query("ALTER TABLE `employees_table` CHANGE `civil_status` `civil_status` enum ('Single', 'Married', 'Widowed', 'Separated', 'Others') NULL");
        await queryRunner.query("ALTER TABLE `employees_table` CHANGE `middle_name` `middle_name` varchar(20) NULL");
        await queryRunner.query("ALTER TABLE `family_information_table` ADD CONSTRAINT `FK_68f5448fe217de1f6ebd5996906` FOREIGN KEY (`employee_id`) REFERENCES `employees_table`(`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `children_table` ADD CONSTRAINT `FK_bcb7db4ca8530981e024c0eb4a9` FOREIGN KEY (`family_info_id`) REFERENCES `family_information_table`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `education_background_table` ADD CONSTRAINT `FK_cd0f81c198da701d1df90da682e` FOREIGN KEY (`employee_id`) REFERENCES `employees_table`(`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `education_background_table` DROP FOREIGN KEY `FK_cd0f81c198da701d1df90da682e`");
        await queryRunner.query("ALTER TABLE `children_table` DROP FOREIGN KEY `FK_bcb7db4ca8530981e024c0eb4a9`");
        await queryRunner.query("ALTER TABLE `family_information_table` DROP FOREIGN KEY `FK_68f5448fe217de1f6ebd5996906`");
        await queryRunner.query("ALTER TABLE `employees_table` CHANGE `middle_name` `middle_name` varchar(20) NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `employees_table` CHANGE `civil_status` `civil_status` enum ('Single', 'Married', 'Widowed', 'Separated', 'Others') NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `employees_table` CHANGE `citizenship_status` `citizenship_status` enum ('Filipino', 'Dual Citizenship') NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `employees_table` CHANGE `sex` `sex` enum ('Male', 'Female') NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `employees_table` CHANGE `place_of_birth` `place_of_birth` varchar(100) NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `employees_table` CHANGE `date_of_birth` `date_of_birth` date NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `employees_table` CHANGE `first_name` `first_name` varchar(50) NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `employees_table` DROP COLUMN `employee_type`");
        await queryRunner.query("ALTER TABLE `employees_table` DROP COLUMN `password`");
        await queryRunner.query("ALTER TABLE `employees_table` DROP INDEX `IDX_bccb4e20325ef199632a5275d4`");
        await queryRunner.query("ALTER TABLE `employees_table` DROP COLUMN `username`");
        await queryRunner.query("ALTER TABLE `education_background_table` ADD CONSTRAINT `fk_educational_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employees_table`(`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `children_table` ADD CONSTRAINT `fk_children_family_id` FOREIGN KEY (`family_info_id`) REFERENCES `family_information_table`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `family_information_table` ADD CONSTRAINT `fk_family_information_employees_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employees_table`(`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE");
    }

}
