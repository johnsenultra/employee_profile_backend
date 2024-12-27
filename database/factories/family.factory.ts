import { define } from "typeorm-seeding";
import { FamilyInfo } from "../entities/family_info.entity";
import { ChildrenInfo } from "../entities/child.entity";
import Faker from "faker";

define(FamilyInfo, (faker: typeof Faker, context: { employeeId: number }) => {
  const familyInfo = new FamilyInfo();

  if (!context || !context.employeeId) {
    throw new Error("Missing context.employeeId for FamilyInfo factory");
  }

  familyInfo.employeeId = context.employeeId; // Use the employee ID from the context

  familyInfo.spouseSurname = faker.name.lastName();
  familyInfo.spouseFirstName = faker.name.firstName();
  familyInfo.spouseMiddleName = faker.name.firstName();
  familyInfo.spouseNameExtension = faker.random.arrayElement(["Jr", "Sr", "III", ""]);
  familyInfo.spouseOccupation = faker.name.jobTitle();
  familyInfo.businessAddress = faker.address.streetAddress();
  familyInfo.employerName = faker.company.companyName();
  familyInfo.spouseTelephoneNo = faker.phone.phoneNumber();

  familyInfo.fatherSurname = faker.name.lastName();
  familyInfo.fatherFirstName = faker.name.firstName();
  familyInfo.fatherMiddleName = faker.name.firstName();
  familyInfo.fatherNameExtension = faker.random.arrayElement(["Jr", "Sr", "III", ""]);

  familyInfo.motherMaidenName = faker.name.lastName();
  familyInfo.motherFirstName = faker.name.firstName();
  familyInfo.motherMiddleName = faker.name.firstName();

  return familyInfo;
});

// You could also pass `familyInfo` to context when seeding `ChildrenInfo`
define(ChildrenInfo, (faker: typeof Faker, context: { familyInfo: FamilyInfo }) => {
   const childrenInfo = new ChildrenInfo();
 
   if (!context || !context.familyInfo) {
     throw new Error("Missing context.familyInfo for ChildrenInfo factory");
   }
 
   // Link the FamilyInfo object to ChildrenInfo
   childrenInfo.familyInfo = context.familyInfo;
 
   childrenInfo.childrenFullname = faker.name.firstName() + ' ' + faker.name.lastName();
   childrenInfo.childDateOfBirth = faker.date.past(18, new Date("2005-01-01"));
 
   return childrenInfo;
 });
