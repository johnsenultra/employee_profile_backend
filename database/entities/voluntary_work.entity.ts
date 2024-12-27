import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee.entity";

@Entity({ name: "voluntary_work" }) // Table name
export class VoluntaryWork {
   @PrimaryGeneratedColumn({ name: "id" }) // Primary key
   id: number

   @ManyToOne(() => Employee, (employee) => employee.employeeId, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
   })
   @JoinColumn({ name: "employee_id" })
   employee: Employee

   @Column({ type: "varchar", length: 255, name: "organization_name" })
   organizationName: string

   @Column({ type: "date", name: "inclusive_date_from" })
   inclusiveDateFrom: Date

   @Column({ type: "date", name: "inclusive_date_to" })
   inclusiveDateTo: Date

   @Column({ type: "int", name: "number_of_hours" })
   numberOfHours: number

   @Column({ type: "varchar", length: 255, name: "nature_of_work"})
   nateOfWork: string
}