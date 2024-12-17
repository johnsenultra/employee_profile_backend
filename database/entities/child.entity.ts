import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { FamilyInfo } from "./family_info.entity"

@Entity("children_table")
export class ChildrenInfo {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number

  @Column({ name: "family_info_id" })
  familyInfoId: number

  @Column({ type: "varchar", length: 100, name: "children_fullname" })
  childrenFullname: string

  @Column({ type: "date", name: "child_date_of_birth" })
  childDateOfBirth: Date

  @ManyToOne(() => FamilyInfo, (familyInfo) => familyInfo.id, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "family_info_id" })
  familyInfo: FamilyInfo
}
