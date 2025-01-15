import { define } from "typeorm-seeding";
import Faker from "faker";
import { Position } from '../entities/position.entity';

define(Position, (faker: Faker) => {
   const position = new Position();
   
   const facultyPositions = [
      "Instructor I",
      "Instructor II",
      "Instructor III",
      "Assistant Professor I",
      "Assistant Professor II",
      "Assistant Professor III",
      "Assistant Professor IV",
      "Associate Professor I",
      "Associate Professor II",
      "Associate Professor III",
      "Associate Professor IV",
      "Associate Professor V",
      "Professor I",
      "Professor II",
      "Professor III",
      "Professor IV",
      "Professor V",
      "Professor VI",
      "University Professor I",
   ];
   
   const nonTeachingPositions = [
      "Accountant III",
      "Administrative Aide II",
      "Administrative Aide III",
      "Administrative Aide IV",
      "Administrative Aide V",
      "Administrative Aide VI",
      "Administrative Assistant I",
      "Administrative Assistant III",
      "Administrative Assistant IV",
      "Administrative Assistant V",
      "Administrative Assistant VI",
      "Administrative Officer I",
      "Administrative Officer II",
      "Administrative Officer III",
      "Administrative Officer IV",
      "Administrative Officer V",
      "Agriculturist I",
      "Agriculturist I",
      "Armorer II",
      "Chief Admin. Officer",
      "College Librarian I",
      "College Librarian III",
      "Dentail Aide",
      "Dentis II",
      "Dormitory Manager I",
      "Draftsman I",
      "Driver Courier",
      "Executive Assistant I",
      "Executive Assistant II",
      "Fare Foreman",
      "Farm Worker",
      "Guidance Counselor II",
      "Internal Auditoe I",
      "Laboratory Aide I",
      "Laboratory Aide II",
      "Librarian Aide",
      "Nurse III",
      "Registrar II",
      "Science Research assistant",
      "Science Research Specialist I",
      "Security Guard II",
      "Security Officer III",
      "Senior Administrative Assistant I",
      "Senior Administrative Assistant II",
      "SUC President III",
      "Supervising Administrative Officer",
      "Veterinarian II",
   ];
   
   position.position_name = faker.random.arrayElement([...facultyPositions, ...nonTeachingPositions]);
   return position;
});
