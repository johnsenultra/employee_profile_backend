import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Employee } from "./employee.entity";
import { Position } from "./position.entity";

@Entity("positions_category") 
export class PositionCategory {
   @PrimaryGeneratedColumn()
   id: number;

   @Column({ type: "enum", enum: ["Faculty", "Non-Teaching Staff"], name: "category_name" })
   categoryName: "Faculty" | "Non-Teaching Staff";

   @OneToMany(() => Employee, (employee) => employee.category)
   positions: Position[];

   @OneToMany(() => Employee, (employee) => employee.category)
   employees: Employee[]

}