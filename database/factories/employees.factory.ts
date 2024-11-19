import { define } from "typeorm-seeding"
import { Employee } from "../entities/employee.entity"
import Faker from "faker"
import { hashPassword } from "../../utils/bcrypt"

define(Employee, (faker: typeof Faker) => {
  const employee = new Employee()

  employee.surname = faker.name.lastName()
  employee.firstName = faker.name.firstName()
  employee.nameExtension = faker.random.arrayElement(["Jr", "Sr", "III", ""])
  employee.dateOfBirth = faker.date.past(30, new Date("2000-01-01"))
  employee.placeOfBirth = faker.address.city()
  employee.sex = faker.random.arrayElement(["Male", "Female"])
  employee.citizenshipStatus = "Filipino"
  employee.civilStatus = faker.random.arrayElement([
    "Single",
    "Married",
    "Widowed",
    "Separated",
    "Others",
  ])
  employee.email = faker.internet.email()
  employee.telephoneNo = faker.phone.phoneNumber()
  employee.mobileNumber = faker.phone.phoneNumber()
  employee.height = faker.random.number({ min: 150, max: 200 }).toString()
  employee.weight = faker.random.number({ min: 50, max: 100 }).toString()
  employee.bloodType = faker.random.arrayElement(["A", "B", "AB", "O"])
  employee.gsisNo = faker.random.number({ min: 1000, max: 9999 }).toString()
  employee.pagIbigNo = faker.random.number({ min: 1000, max: 9999 }).toString()
  employee.philhealthNo = faker.random
    .number({ min: 1000, max: 9999 })
    .toString()
  employee.sssNo = faker.random.number({ min: 1000, max: 9999 }).toString()
  employee.tinNo = faker.random.number({ min: 1000, max: 9999 }).toString()
  employee.agencyEmployeeNo = faker.random
    .number({ min: 1000, max: 9999 })
    .toString()
  employee.dualCitizenType = faker.random.arrayElement([
    "by birth",
    "by naturalization",
  ])
  employee.dualCitizenDetails = faker.random.words(3)
  employee.residentialHouseNo = faker.address.streetAddress()
  employee.residentialStreet = faker.address.streetName()
  employee.residentialSubdivision = faker.address.secondaryAddress()
  employee.residentialBarangay = faker.address.state()
  employee.residentialCity = faker.address.city()
  employee.residentialProvince = faker.address.state()
  employee.residentialZipcode = faker.address.zipCode()
  employee.permanentHouseNo = faker.address.streetAddress()
  employee.permanentStreet = faker.address.streetName()
  employee.permanentSubdivision = faker.address.secondaryAddress()
  employee.permanentBarangay = faker.address.state()
  employee.permanentCity = faker.address.city()
  employee.permanentProvince = faker.address.state()
  employee.permanentZipcode = faker.address.zipCode()
  employee.middleName = faker.name.firstName()
  employee.username = faker.internet.userName()
  employee.employeeType = "staff"

  return employee
})
