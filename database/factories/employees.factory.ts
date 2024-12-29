import { define } from "typeorm-seeding";
import { Employee } from "../entities/employee.entity";
import Faker from "faker";
import { User } from "../entities/user.entity";

define(Employee, (faker: typeof Faker) => {
  const employee = new Employee();

  employee.surname = faker.name.lastName();
  employee.firstName = faker.name.firstName();
  employee.nameExtension = faker.random.arrayElement(['', 'Jr.', 'Sr.', 'III']);
  employee.email = faker.internet.email();
  employee.telephoneNo = faker.phone.phoneNumber('##########');
  employee.mobileNumber = faker.phone.phoneNumber('09########');
  employee.height = faker.random.number({ min: 150, max: 200 }).toString();
  employee.weight = faker.random.number({ min: 45, max: 100 }).toString();
  employee.bloodType = faker.random.arrayElement(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']);
  employee.gsisNo = faker.random.alphaNumeric(10);
  employee.pagIbigNo = faker.random.alphaNumeric(12);
  employee.philhealthNo = faker.random.alphaNumeric(12);
  employee.sssNo = faker.random.alphaNumeric(10);
  employee.tinNo = faker.random.alphaNumeric(12);
  employee.agencyEmployeeNo = faker.random.alphaNumeric(10);
  employee.dualCitizenDetails = '';

  // Residential address
  employee.residentialHouseNo = faker.address.streetAddress();
  employee.residentialStreet = faker.address.streetName();
  employee.residentialSubdivision = faker.address.streetSuffix();
  employee.residentialBarangay = faker.address.streetPrefix();
  employee.residentialCity = faker.address.city();
  employee.residentialProvince = faker.address.state();
  employee.residentialZipcode = faker.address.zipCode();

  // Permanent address
  employee.permanentHouseNo = faker.address.streetAddress();
  employee.permanentStreet = faker.address.streetName();
  employee.permanentSubdivision = faker.address.streetSuffix();
  employee.permanentBarangay = faker.address.streetPrefix();
  employee.permanentCity = faker.address.city();
  employee.permanentProvince = faker.address.state();
  employee.permanentZipcode = faker.address.zipCode();

  // Optional fields
  employee.middleName = faker.name.firstName();
  employee.dateOfBirth = faker.date.past(50);
  employee.placeOfBirth = faker.address.city();
  employee.sex = faker.random.arrayElement(['Male', 'Female']);
  employee.citizenshipStatus = faker.random.arrayElement(['Filipino', 'Dual Citizenship']);
  employee.civilStatus = faker.random.arrayElement(['Single', 'Married', 'Widowed', 'Separated', 'Others']);
  employee.dualCitizenType = employee.citizenshipStatus === 'Dual Citizenship' 
    ? faker.random.arrayElement(['by birth', 'by naturalization'])
    : undefined;

  return employee;
});

define(User, (faker: typeof Faker) => {
  const user = new User();
  
  // Assuming the Employee is already created
  const employee = new Employee(); // In practice, you'd fetch an existing employee or use a service to create it
  user.username = faker.internet.userName();
  user.password = faker.internet.password();
  user.userType = faker.random.arrayElement(["staff", "admin"]);
  
  // Setting the foreign key relationship
  user.employee = employee; // This sets the user to be associated with the employee
  
  return user;
});
