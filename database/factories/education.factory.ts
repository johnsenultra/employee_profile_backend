// education.factory.ts
import { define } from "typeorm-seeding";
import { EducationBackground } from "../entities/education_background.entity";
import Faker from "faker";

define(EducationBackground, (faker: typeof Faker, context: { employeeId: number }) => {
   const educationBackground = new EducationBackground();   

   if(!context || !context.employeeId) {
      throw new Error("Missing context.employeeId for EducationInfo factory")
   }

   educationBackground.employeeId = context.employeeId;

   educationBackground.educationLevel = faker.random.arrayElement([
      "Elementary",
      "Secondary",
      "Vocational/Trade Course",
      "College",
      "Graduate Studies",
   ]);
   educationBackground.schoolName = faker.company.companyName(); // Use a realistic placeholder
   educationBackground.degreeOrCourse = faker.name.jobTitle(); // Use a job title as a degree/course example
   educationBackground.periodFrom = faker.date.past(20).toISOString(); // Generate a past date
   educationBackground.periodTo = faker.date.past(10).toISOString(); // Generate a past date
   educationBackground.highestLevelUnitEarned = faker.random.number({ min: 1, max: 10 }).toString(); // Random units
   educationBackground.yearsGraduated = faker.date.past(5).getFullYear().toString(); // Get the year as a string

   return educationBackground;
})