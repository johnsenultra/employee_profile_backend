import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PositionCategory } from "./position_category.entity";
import { Employee } from "./employee.entity";

@Entity("positions")
export class Position{
   @PrimaryGeneratedColumn()
   id: number;

   @Column({ type: "varchar", length: 100, name: "position_name" })
   position_name: string;

   @ManyToOne(() => PositionCategory, (category) => category.positions)
   @JoinColumn({ name: "category_id"})
   category: PositionCategory;

   @OneToMany(() => Employee, employee => employee.position)
   employees: Employee[];
}