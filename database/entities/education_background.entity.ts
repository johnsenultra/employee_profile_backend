import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { Employee } from "./employee.entity"

@Entity("education_background_table")
export class EducationBackground {
  @PrimaryGeneratedColumn({ name: "educational_id" })
  educationalId: number

  @Column({ name: "employee_id" })
  employeeId: number

  @Column({
    type: "enum",
    enum: [
      "Elementary",
      "Secondary",
      "Vocational/Trade Course",
      "College",
      "Graduate Studies",
      "",
    ],
    name: "education_level",
  })
  educationLevel:
    | "Elementary"
    | "Secondary"
    | "Vocational/Trade Course"
    | "College"
    | "Graduate Studies"
    | ""

  @Column({ type: "varchar", length: 255, name: "school_name" })
  schoolName: string

  @Column({ type: "varchar", length: 255, name: "degree_or_course" })
  degreeOrCourse: string

  @Column({ type: "year", name: "period_from" })
  periodFrom: number

  @Column({ type: "year", name: "period_to" })
  periodTo: number

  @Column({ type: "year", name: "years_graduated" })
  yearsGraduated: number

  @Column({ type: "varchar", length: 255, name: "highest_level_unit_earned" })
  highestLevelUnitEarned: string

  @ManyToOne(() => Employee, (employee) => employee.employeeId, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "employee_id" })
  employee: Employee
}
