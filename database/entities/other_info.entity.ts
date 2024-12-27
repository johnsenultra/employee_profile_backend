import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee.entity";

@Entity({ name: "other_info" }) // Table name
export class OtherInfo {
   @PrimaryGeneratedColumn({ name: "id" }) // Primary key
   id: number;

   @ManyToOne(() => Employee, (employee) => employee.employeeId, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
   })
   @JoinColumn({ name: "employee_id" })
   employee: Employee

   @Column({ type: "varchar", length: 255, name: "hobbies" })
   hobbies: string

   @Column({ type: "varchar", length: 255, name: "recognition" })
   recognation: string

   @Column({ type: "varchar", length: 255, name: "membership" })
   membership: string
   
}