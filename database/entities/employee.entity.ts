import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { User } from "./user.entity"
@Entity("employees_table")
export class Employee {
  @PrimaryGeneratedColumn({ name: "employee_id" })
  employeeId: number

  // @Column({ name: "userId" })
  // userId: number

  // @Column({ type: "varchar", length: 50 })
  // username: string

  // @Column({ type: "varchar", length: 50 })
  // userType: string

  @Column({ type: "varchar", length: 50 })
  surname: string

  @Column({ type: "varchar", length: 50, nullable: true, name: "first_name" })
  firstName?: string

  @Column({ type: "varchar", length: 10, name: "name_extension" })
  nameExtension: string

  @Column({ type: "date", nullable: true, name: "date_of_birth" })
  dateOfBirth?: Date

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
    name: "place_of_birth",
  })
  placeOfBirth?: string

  @Column({ type: "enum", enum: ["Male", "Female"], nullable: true })
  sex?: "Male" | "Female"

  @Column({
    type: "enum",
    enum: ["Filipino", "Dual Citizenship"],
    nullable: true,
    name: "citizenship_status",
  })
  citizenshipStatus?: "Filipino" | "Dual Citizenship"

  @Column({
    type: "enum",
    enum: ["Single", "Married", "Widowed", "Separated", "Others"],
    nullable: true,
    name: "civil_status",
  })
  civilStatus?: "Single" | "Married" | "Widowed" | "Separated" | "Others"

  @Column({ type: "varchar", length: 100 })
  email: string

  @Column({ type: "varchar", length: 20, name: "telephone_no" })
  telephoneNo: string

  @Column({ type: "varchar", length: 20, name: "mobile_number" })
  mobileNumber: string

  @Column({ type: "decimal", precision: 20, scale: 0 })
  height: string

  @Column({ type: "decimal", precision: 20, scale: 0 })
  weight: string

  @Column({ type: "varchar", length: 20, name: "blood_type" })
  bloodType: string

  @Column({ type: "varchar", length: 50, name: "gsis_no" })
  gsisNo: string

  @Column({ type: "varchar", length: 50, name: "pag_ibig_no" })
  pagIbigNo: string

  @Column({ type: "varchar", length: 50, name: "philhealth_no" })
  philhealthNo: string

  @Column({ type: "varchar", length: 50, name: "sss_no" })
  sssNo: string

  @Column({ type: "varchar", length: 50, name: "tin_no" })
  tinNo: string

  @Column({ type: "varchar", length: 50, name: "agency_employee_no" })
  agencyEmployeeNo: string

  @Column({
    type: "enum",
    enum: ["by birth", "by naturalization"],
    nullable: true,
    name: "dual_citizen_type",
  })
  dualCitizenType?: "by birth" | "by naturalization"

  @Column({ type: "text", name: "dual_citizen_details" })
  dualCitizenDetails: string

  @Column({ type: "varchar", length: 100, name: "residential_house_no" })
  residentialHouseNo: string

  @Column({ type: "varchar", length: 100, name: "residential_street" })
  residentialStreet: string

  @Column({ type: "varchar", length: 100, name: "residential_subdivision" })
  residentialSubdivision: string

  @Column({ type: "varchar", length: 100, name: "residential_barangay" })
  residentialBarangay: string

  @Column({ type: "varchar", length: 100, name: "residential_city" })
  residentialCity: string

  @Column({ type: "varchar", length: 100, name: "residential_province" })
  residentialProvince: string

  @Column({ type: "varchar", length: 50, name: "residential_zipcode" })
  residentialZipcode: string

  @Column({ type: "varchar", length: 100, name: "permanent_house_no" })
  permanentHouseNo: string

  @Column({ type: "varchar", length: 100, name: "permanent_street" })
  permanentStreet: string

  @Column({ type: "varchar", length: 100, name: "permanent_subdivision" })
  permanentSubdivision: string

  @Column({ type: "varchar", length: 100, name: "permanent_barangay" })
  permanentBarangay: string

  @Column({ type: "varchar", length: 100, name: "permanent_city" })
  permanentCity: string

  @Column({ type: "varchar", length: 100, name: "permanent_province" })
  permanentProvince: string

  @Column({ type: "varchar", length: 50, name: "permanent_zipcode" })
  permanentZipcode: string

  @Column({ type: "varchar", length: 20, nullable: true, name: "middle_name" })
  middleName?: string

  @OneToOne(() => User, user => user.employee)
  @JoinColumn()
  user: User
}