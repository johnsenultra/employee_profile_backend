import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm"
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
    select: false // Password won't be selected by default in queries
  })
  password: string

  @Column({
   type: "enum",
   enum: ["staff", "admin"],
   default: "staff"
  })
  userType: "staff" | "admin"

  @OneToOne(() => Employee, employee => employee.user)
  employee: Employee

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date
}
