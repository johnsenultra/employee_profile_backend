import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Employee } from "./employee.entity"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn({})
  id: number

  @Column({
    type: "varchar",
    length: 20,
    unique: true,
  })
  username: string

  @Column({
    type: "varchar",
    select: false
  })
  password: string

  @Column({
   type: "enum",
   enum: ["staff", "admin"],
   default: "staff"
  })
  userType: "staff" | "admin"

  @OneToOne(() => Employee, (employee) => employee.user, {
    cascade: true,
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "employee_id" })
  employee: Employee;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date
}
