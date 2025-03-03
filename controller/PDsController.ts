   import * as path from 'path';
   import * as ExcelJS from 'exceljs';
   import * as fs from 'fs';
   import { Request, Response } from 'express';
   import { getUserDataById } from '../models/PDsModel';
import { json } from 'body-parser';

// Function to generate and send excel file
export const generatedPDSExcel = async (req: Request, res: Response): Promise<void> => {
   try {
      // Get user id from request
      const employee_id = parseInt(req.params.employee_id);

      if(isNaN(employee_id)) {
         res.status(400).json({ message: "User ID is required" })
         return;
      }

      // Fetch user data
      getUserDataById(employee_id, async (err: Error, result: any) => {
         if(err) {
            res.status(404).json({ message: "User not found" });
            return;
         }
         //  else {
         //    res.status(200).json(result);
         //    return;
         // }
         if (!result) {
            res.status(404).json({ message: "User not found" });
            return;
         }

         
         // Load the excel template from the templates folder
         const templatePath = path.join(__dirname, "..", "templates", "Excel-Template.xlsx");
         const workbook = new ExcelJS.Workbook();
         await workbook.xlsx.readFile(templatePath);

         const sheet = workbook.getWorksheet("C1"); //need to anjust best on sheet name
         const sheetC2 = workbook.getWorksheet("C2");
         const sheetC3 = workbook.getWorksheet("C3");
         const sheetC4 = workbook.getWorksheet("C4");

         if(!sheet) {
            res.status(500).json({ message: "Sheet not found in the template" })
            return;
         }
         
         // insert fetched data into excel
         sheet.getCell("D10").value = result.first_name;
         sheet.getCell("D11").value = result.surname;
         sheet.getCell("D12").value = result.middle_name;
         sheet.getCell("L12").value = result.name_extension;
         
         if(result.date_of_birth) {
            const dateOfBirth = new Date(result.date_of_birth);
            sheet.getCell("D13").value = dateOfBirth.toLocaleDateString('en-PH', {
               month: '2-digit',
               day: '2-digit',
               year: 'numeric'
            })
         }
         sheet.getCell("D15").value = result.place_of_birth;
         sheet.getCell("D22").value = result.height;
         sheet.getCell("D24").value = result.weight;
         sheet.getCell("D25").value = result.blood_type;
         sheet.getCell("D27").value = result.gsis_no;
         sheet.getCell("D29").value = result.pag_ibig_no;
         sheet.getCell("D31").value = result.philhealth_no;
         sheet.getCell("D32").value = result.sss_no;
         sheet.getCell("D33").value = result.tin_no;
         sheet.getCell("D34").value = result.agency_employee_no
         //* For residential address cell 
         sheet.getCell("I17").value = result.residential_house_no;
         sheet.getCell("L17").value = result.residential_street;
         sheet.getCell("I19").value = result.residential_subdivision;
         sheet.getCell("L19").value = result.residential_barangay;
         sheet.getCell("I22").value = result.residential_city;
         sheet.getCell("L22").value = result.residential_province;
         sheet.getCell("I24").value = result.residential_zipcode;
         //* For permanent address cell
         sheet.getCell("I25").value = result.permanent_house_no;
         sheet.getCell("L25").value = result.permanent_street;
         sheet.getCell("I27").value = result.permanent_subdivision;
         sheet.getCell("L27").value = result.permanent_barangay;
         sheet.getCell("I29").value = result.permanent_city;
         sheet.getCell("L29").value = result.permanent_province;
         sheet.getCell("I31").value = result.permanent_zipcode;
         //* For contact info
         sheet.getCell("I32").value = result.telephone_no;
         sheet.getCell("I33").value = result.mobile_number;
         sheet.getCell("I34").value = result.email;
         //* For family background
         sheet.getCell("D36").value = result.spouse_surname;
         sheet.getCell("D37").value = result.spouse_first_name;
         // sheet.getCell("D37").value = result.spouse_name_extension;
         sheet.getCell("D38").value = result.spouse_middle_name;
         sheet.getCell("D39").value = result.spouse_occupation;
         sheet.getCell("D40").value = result.employer_name;
         sheet.getCell("D41").value = result.business_address;
         sheet.getCell("D42").value = result.spouse_telephone_no;
         sheet.getCell("D43").value = result.father_surname;
         sheet.getCell("D44").value = result.father_first_name;
         sheet.getCell("D45").value = result.father_middle_name;
         // sheet.getCell("G45").value = result.father_name_extension;
         sheet.getCell("D47").value = result.mother_maiden_name;
         sheet.getCell("D48").value = result.mother_first_name;
         sheet.getCell("D49").value = result.mother_middle_name;

      
         // Handle children data
         try {
            const children = JSON.parse(result.children);
            
            if (children && children.length > 0) {
               // Start from row 37 for children
               children.forEach((child: any, index: number) => {
                  const rowIndex = 37 + index;
                  sheet.getCell(`I${rowIndex}`).value = child.childFullName;
                  
                  if (child.childDateOfBirth) {
                     const dob = new Date(child.childDateOfBirth);
                     sheet.getCell(`M${rowIndex}`).value = dob.toLocaleDateString('en-PH', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                     });
                  }
               });
            }
         } catch (error) {
            console.error("Error processing children data:", error);
         }

         // Handle education data
         try {
            const education = JSON.parse(result.education_background);
            // Start from row 54 for education
            education.forEach((educ: any, index: number) => {
               const rowIndex = 54 + index;
               sheet.getCell(`D${rowIndex}`).value = educ.schoolName;
               sheet.getCell(`G${rowIndex}`).value = educ.degreeOrCourse;
               sheet.getCell(`J${rowIndex}`).value = educ.periodFrom;
               sheet.getCell(`K${rowIndex}`).value = educ.periodTo;
               sheet.getCell(`L${rowIndex}`).value = educ.highestLevelUnitEarned;
               sheet.getCell(`M${rowIndex}`).value = educ.yearsGraduated;
               sheet.getCell(`N${rowIndex}`).value = educ.academicOrScholarshipReceived;
               
            })
         } catch (err) {
            console.error("Error processing education data:", err);
         }

         //* Handle Checkboxes for sex
         if(result.sex === "Male") {
            sheet.getCell("D16").value = "✅ Male                  ☐ Female";
         } else {
            sheet.getCell("D16").value = "☐ Male                   ✅ Female";
         }
     
         const civilStatusText = 
         (result.civil_status.toLowerCase() === "single" ? "                  ✅" : "               ☐") + " Single " +
         (result.civil_status.toLowerCase() === "married" ? "                  ✅" : "               ☐") + " Married\n" +
         (result.civil_status.toLowerCase() === "widowed" ? "                  ✅" : "               ☐") + " Widowed " +
         (result.civil_status.toLowerCase() === "separated" ? "                  ✅" : "               ☐") + " Separated";

         // Set the value for the merged cells
         const civilStatusCell = sheet.getCell("D17");
         civilStatusCell.value = civilStatusText;

         // Enable "wrap text" for the merged cells
         civilStatusCell.alignment = { wrapText: true };

         // Store "Others" separately in D19 (if needed)
         sheet.mergeCells("D19:D20");
         const othersText = (result.civil_status.toLowerCase() === "others" ? "                  ✅" : "☐") + " Others";
         sheet.getCell("D19").value = othersText;

         //* Handle Checkboxes for citizenship
         const citizenshipCell = sheet.getCell("J13");
         if (result.citizenship_status === "Filipino") {
            citizenshipCell.value = "✅ Filipino   ☐ Dual Citizenship";
            // Clear the "by birth" and "by naturalization" checkboxes for Filipino citizens
            sheet.getCell("L14").value = "   ☐ by birth       ☐ by naturalization";
         } else if (result.citizenship_status === "Dual Citizenship") {
            citizenshipCell.value = "☐ Filipino   ✅ Dual Citizenship";
            
            //! Additional handling for dual citizenship
            if (result.dual_citizen_type === "by birth") {
               sheet.getCell("L14").value = "   ✅ by birth       ☐ by naturalization";
            } else if (result.dual_citizen_type === "by naturalization") {
               sheet.getCell("L14").value = "   ☐ by birth       ✅ by naturalization";
            } else {
               // Default to unchecked if dual_citizen_type is not specified
               sheet.getCell("L14").value = "   ☐ by birth       ☐ by naturalization";
            }
         } else {
            // Default to unchecked if citizenship_status is not specified
            citizenshipCell.value = "☐ Filipino   ☐ Dual Citizenship";
            sheet.getCell("L14").value = "   ☐ by birth       ☐ by naturalization";
         }

         //* Start for C2 sheet here!
         sheetC2.getCell("A5").value = result.first_name

         // Handle service eligibility
         try {
            const serviceEligbility = JSON.parse(result.service_eligibity)
            // Start from row 5 for service elibility
            serviceEligbility.forEach((service: any, index: number) => {
               const rowIndex = 5 + index;
               sheetC2.getCell(`A${rowIndex}`).value = service.careerService;
               sheetC2.getCell(`F${rowIndex}`).value = service.rating;
               sheetC2.getCell(`G${rowIndex}`).value = service.dateOfExamination;
               sheetC2.getCell(`I${rowIndex}`).value = service.placeOfExamination;
               sheetC2.getCell(`L${rowIndex}`).value = service.licenseNumber;
               // sheetC2.getCell(`O${rowIndex}`).value = service.dateOfValidity; //! Thers no date of validity in the model or my prod db
            })
         } catch (err) {
            console.error("Error processing service eligibility data:", err);
         }

         // Handle work experience
         try {
            const workExperience = JSON.parse(result.work_experience)
            // Start from row 18 for work experience
            workExperience.forEach((work: any, index: number) => {
               const rowIndex = 18 + index;

               if(work.inclusiveDateFrom) {
                  const dateFrom = new Date(work.inclusiveDateFrom);
                  sheetC2.getCell(`A${rowIndex}`).value = dateFrom.toLocaleDateString('en-PH', {
                     month: '2-digit',
                     day: '2-digit',
                     year: 'numeric'
                  })
               }

               if(work.inclusiveDateFrom) {
                  const dateTo = new Date(work.inclusiveDateTo);
                  sheetC2.getCell(`C${rowIndex}`).value = dateTo.toLocaleDateString('en-PH', {
                     month: '2-digit',
                     day: '2-digit',
                     year: 'numeric'
                  })
               }
               sheetC2.getCell(`D${rowIndex}`).value = work.position;
               sheetC2.getCell(`G${rowIndex}`).value = work.department;
               sheetC2.getCell(`J${rowIndex}`).value = work.monthlySalary;
               sheetC2.getCell(`K${rowIndex}`).value = work.salaryGrade;
               sheetC2.getCell(`L${rowIndex}`).value = work.statusOfAppointment;
               const govermentServiceValue = Number(work.governmentService === 1) ? "Y" : "N" 
               sheetC2.getCell(`M${rowIndex}`).value = govermentServiceValue;
               // console.log(`Setting M${rowIndex} =`, governmentServiceValue);
            })
         } catch (err) {
            console.error("Error processing work experience data:", err);
         }

         // Handle voluntary work
         try {
            const voluntaryWork = JSON.parse(result.voluntary_work);
            //Start from row 6 for voluntary work
            voluntaryWork.forEach((voluntary: any, index: number) => {
               const rowIndex = 6 + index;
               
               sheetC3.getCell(`A${rowIndex}`).value = voluntary.organizationName;
               if(voluntary.inclusiveDateFrom) {
                  const dateFrom = new Date(voluntary.inclusiveDateFrom);
                  sheetC3.getCell(`E${rowIndex}`).value = dateFrom.toLocaleDateString('en-PH', {
                     month: '2-digit',
                     day: '2-digit',
                     year: 'numeric'
                  })
               }
               if(voluntary.inclusiveDateTo) {
                  const dateTo = new Date(voluntary.inclusive_date_to);
                  sheetC3.getCell(`F${rowIndex}`).value = dateTo.toLocaleDateString('en-PH', {
                     month: '2-digit',
                     day: '2-digit',
                     year: 'numeric'
                  })
               }
               sheetC3.getCell(`G${rowIndex}`).value = voluntary.numberOfHours;
               sheetC3.getCell(`H${rowIndex}`).value = voluntary.natureOfWork;
            })
         } catch (err) {
            console.error("Error processing voluntary work data:", err);
         }

         // Handle training
         try {
            const trainingProgram = JSON.parse(result.training);
            // Start from the row 19 for training
            trainingProgram.forEach((training: any, index: number) => {
               const rowIndex = 19 + index;

               sheetC3.getCell(`A${rowIndex}`).value = training.titleTrainingPrograms;
               if(training.periodDateFrom) {
                  const periodFrom = new Date(training.periodDateFrom);
                  sheetC3.getCell(`E${rowIndex}`).value = periodFrom.toLocaleDateString('en-PH', {
                     month: '2-digit',
                     day: '2-digit',
                     year: 'numeric'
                  })
               }
               if(training.periodDateTo) {
                  const periodTo = new Date(training.periodDateTo);
                  sheetC3.getCell(`F${rowIndex}`).value = periodTo.toLocaleDateString('en-PH', {
                     month: '2-digit',
                     day: '2-digit',
                     year: 'numeric'
                  })
               }
               sheetC3.getCell(`G${rowIndex}`).value = training.numberOfHours;
               sheetC3.getCell(`H${rowIndex}`).value = training.typeOfLD;
               sheetC3.getCell(`I${rowIndex}`).value = training.conductedBy;
            })
         } catch (err) {
            console.error("Error processing training data:", err);
         }

         // Handle other information
         try {
            const otherInformation = JSON.parse(result.other_info);
            // Start from row 43 other information
            otherInformation.forEach((other: any, index: number) => {
               const rowIndex = 43 + index;

               sheetC3.getCell(`A${rowIndex}`).value = other.hobbies;
               sheetC3.getCell(`C${rowIndex}`).value = other.recognition;
               sheetC3.getCell(`I${rowIndex}`).value = other.membership;
            })
         } catch (err) {
            console.error("Error processing other information data:", err);
         }

      //    // Handle image insertion
      //    try {
      //       // Get the base directory of your project
      //       const baseDir = path.join(__dirname, '..'); // Adjust based on your folder structure
            
      //       // Remove the leading slash and convert to proper path
      //       const relativePath = result.profile_image.replace(/^\//, '');
      //       const imagePath = path.join(baseDir, relativePath);
            
      //       console.log('Original profile_image:', result.profile_image);
      //       console.log('Base directory:', baseDir);
      //       console.log('Final image path:', imagePath);
            
      //       if (!fs.existsSync(imagePath)) {
      //           throw new Error(`Image file not found at: ${imagePath}`);
      //       }
        
      //       let fileExtension = path.extname(imagePath).toLowerCase().slice(1);
      //       if (fileExtension === 'jpg') {
      //           fileExtension = 'jpeg';
      //       }
        
      //       const imageId = workbook.addImage({
      //           filename: imagePath,
      //           extension: fileExtension as 'jpeg' | 'png' | 'gif'
      //       });
        
      //       sheet.addImage(imageId, {
      //           tl: { col: 9, row: 49 },
      //           ext: { width: 100, height: 100 }
      //       });
        
      //   } catch (error) {
      //       console.error('Error processing image:', error.message);
      //   }

         // set headears and send file
         res.setHeader("Content-Disposition", `attachment; filename=${result.first_name}-${result.surname}-PDS.xlsx`);
         res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

         await workbook.xlsx.write(res);
         res.end();
      });
   } catch (err) {
      console.error(err);
         res.status(500).json({ message: "Failed to generate excel file" });
   }
}