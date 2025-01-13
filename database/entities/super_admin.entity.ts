import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { UserType } from "../../types/user.types"

@Entity("super_admins")
export class SuperAdmin {
  @PrimaryGeneratedColumn()
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
    type: "varchar",
    default: "super_admin"
  })
  userType: UserType

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date

  @Column({ type: "boolean", default: true })
  isActive: boolean
}