import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee.entity";

@Entity("service_eligibity") // Table name
export class ServiceEligibity {
   @PrimaryGeneratedColumn({ name: "id" })
   id: number;

   @Column({ name: "employee_id" })
   employeeId: number

   @Column({ type: "varchar", length: 255, name: "career_service" })
   careerService: string

   @Column({ type: "decimal", precision: 5, scale: 2, name: "rating" })
   rating: number

   @Column({ type: "date", name: "date_of_examination" })
   dateOfExamination: Date

   @Column({ type: "varchar", length: 255, name: "place_of_examination" })
   placeOfExamination: string

   @Column({ type: "varchar", length: 50, name: "license_number" })
   licenseNumber: string

   @ManyToOne(() => Employee, (employee) => employee.employeeId, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
   })
   @JoinColumn({ name: "employee_id" })
   employee: Employee
}