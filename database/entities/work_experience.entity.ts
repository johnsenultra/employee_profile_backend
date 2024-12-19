import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, ManyToOne,  } from "typeorm";
import { Employee } from "./employee.entity";

@Entity("work_experience") // Table name
export class WorkExperience{
   @PrimaryGeneratedColumn({ name: "id" })
   id: number; // Primary key

   @Column({ name: "employee_id" })
   employee_id: number // Foreign Key

   @Column({ type: "date", name: "inclusive_date_from" })
   inclusiveDatefrom: Date

   @Column({ type: "date", name: "inclusive_date_to" })
   inclusiviDateTo: Date

   @Column({ type: "varchar", length: 100, name: "position" })
   positioTitle: string

   @Column({ type: "varchar", length: 150, name: "department"})
   department: string

   @Column({ type: "decimal", precision: 10, scale: 2, name: "monthly_salary" })
   monthlySalary: number

   @Column({ type: "varchar", length: 50, name: "salary_grade" })
   salaryGrade: string

   @Column({ type: "varchar", length: 100, name: "status_of_appointment" })
   statusOfAppointment: string

   @Column({ type: "boolean", name: "government_service" })
   govermentService: boolean

   @ManyToOne(() => Employee, (employee) => employee.employeeId, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
   })
   @JoinColumn({ name: "employee_id" })
   employee: Employee
} 