import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee.entity";

@Entity({ name: "training" }) // Table name
export class Traning {
   @PrimaryGeneratedColumn({ name: "id" }) // Primary key

   @ManyToOne(() => Employee, (employee) => employee.employeeId, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
   })
   @JoinColumn({ name: "employee_id" })
   employee: Employee
   id: number

   @Column({ type: "varchar", length: 255, name: "title_training_programs" })
   titleTrainingPrograms: string

   @Column({ type: "date", name: "period_date_from" })
   inclusiveDateFrom: Date

   @Column({ type: "date", name: "period_date_to" })
   inclusiveDateTo: Date
   
   @Column({ type: "int", name: "number_of_hours" })
   numberOfHours: number

   @Column({ type: "varchar", length: 255, name: "type_of_LD" })
   typeOfLD: string

   @Column({ type: "varchar", length: 255, name: "conducted_by" })
   conductedBy: string
   
}