import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { Employee } from "./employee.entity"

@Entity("family_information_table")
export class FamilyInfo {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number

  @Column({ name: "employee_id" })
  employeeId: number

  @Column({ type: "varchar", length: 100, name: "spouse_surname" })
  spouseSurname: string

  @Column({ type: "varchar", length: 100, name: "spouse_first_name" })
  spouseFirstName: string

  @Column({ type: "varchar", length: 20, name: "spouse_middle_name" })
  spouseMiddleName: string

  @Column({ type: "varchar", length: 50, name: "spouse_name_extension" })
  spouseNameExtension: string

  @Column({ type: "varchar", length: 100, name: "spouse_occupation" })
  spouseOccupation: string

  @Column({ type: "varchar", length: 100, name: "business_address" })
  businessAddress: string

  @Column({ type: "varchar", length: 100, name: "employer_name" })
  employerName: string

  @Column({ type: "varchar", length: 50, name: "spouse_telephone_no" })
  spouseTelephoneNo: string

  @Column({ type: "varchar", length: 100, name: "father_surname" })
  fatherSurname: string

  @Column({ type: "varchar", length: 100, name: "father_first_name" })
  fatherFirstName: string

  @Column({ type: "varchar", length: 20, name: "father_middle_name" })
  fatherMiddleName: string

  @Column({ type: "varchar", length: 20, name: "father_name_extension" })
  fatherNameExtension: string

  @Column({ type: "varchar", length: 100, name: "mother_maiden_name" })
  motherMaidenName: string

  @Column({ type: "varchar", length: 100, name: "mother_first_name" })
  motherFirstName: string

  @Column({ type: "varchar", length: 20, name: "mother_middle_name" })
  motherMiddleName: string

  @ManyToOne(() => Employee, (employee) => employee.employeeId, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "employee_id" })
  employee: Employee
}
