import db from "../utils/db"

export const getUserDataById = (employee_id: number, callback: any) => {
   const sql = `
      SELECT 
         e.employee_id,
         e.surname,
         e.first_name,
         e.middle_name,
         e.name_extension,
         e.date_of_birth,
         e.place_of_birth,
         e.sex,
         e.citizenship_status,
         e.civil_status,
         e.email,
         e.telephone_no,
         e.mobile_number,
         e.height,
         e.weight,
         e.blood_type,
         e.gsis_no,
         e.pag_ibig_no,
         e.philhealth_no,
         e.sss_no,
         e.tin_no,
         e.agency_employee_no,
         e.dual_citizen_type,
         e.dual_citizen_details,
         e.residential_house_no,
         e.residential_street,
         e.residential_subdivision,
         e.residential_barangay,
         e.residential_city,
         e.residential_province,
         e.residential_zipcode,
         e.permanent_house_no,
         e.permanent_street,
         e.permanent_subdivision,
         e.permanent_barangay,
         e.permanent_city,
         e.permanent_province,
         e.permanent_zipcode,
         e.profile_image,
         f.spouse_surname,
         f.spouse_first_name,
         f.spouse_middle_name,
         f.spouse_name_extension,
         f.spouse_occupation,
         f.business_address,
         f.employer_name,
         f.spouse_telephone_no,
         f.father_surname,
         f.father_first_name,
         f.father_middle_name,
         f.father_name_extension,
         f.mother_maiden_name,
         f.mother_first_name,
         f.mother_middle_name,
         CONCAT(
            '[', 
               IFNULL(GROUP_CONCAT(
                  CONCAT(
                     '{"childFullName": "', c.children_fullname, '", ',
                     '"childDateOfBirth": "', c.child_date_of_birth, '"}'
                  ) 
                  SEPARATOR ','
               ), ''), 
            ']'
         ) AS children,
         CONCAT(
            '[', 
               IFNULL(GROUP_CONCAT(DISTINCT
                  CONCAT(
                     '{"educationLevel": "', ed.education_level, '", ',
                     '"schoolName": "', ed.school_name, '", ',
                     '"degreeOrCourse": "', ed.degree_or_course, '", ',
                     '"periodFrom": "', ed.period_from, '", ',
                     '"periodTo": "', ed.period_to, '", ',
                     '"yearsGraduated": "', ed.years_graduated, '", ',
                     '"highestLevelUnitEarned": "', ed.highest_level_unit_earned, '", ', 
                     '"academicOrScholarshipReceived": "', ed.academic_or_scholarship_recieved, '"}'
                  ) 
                  SEPARATOR ','
               ), ''), 
            ']'
         ) AS education_background,
         CONCAT(
            '[',
               IFNULL(GROUP_CONCAT(DISTINCT
                  CONCAT(
                     '{"careerService": "', se.career_service, '", ',
                     '"rating": "', se.rating, '", ',
                     '"dateOfExamination": "', se.date_of_examination, '", ',
                     '"placeOfExamination": "', se.place_of_examination, '", ',
                     '"licenseNumber": "', se.license_number, '"}'
                  )
                  SEPARATOR ','
               ), ''),
            ']'
         ) AS service_eligibity,
         CONCAT(
            '[',
               IFNULL(GROUP_CONCAT(DISTINCT
                  CONCAT(
                     '{
                        "inclusiveDateFrom": "',  we.inclusive_date_from, '", ',
                        '"inclusiveDateTo": "', we.inclusive_date_to, '", ',
                        '"position": "', we.position, '", ',
                        '"department": "', we.department, '", ',
                        '"monthlySalary": "', we.monthly_salary, '", ',
                        '"salaryGrade": "', we.salary_grade, '", ',
                        '"statusOfAppointment": "', we.status_of_appointment, '", ',
                        '"governmentService": "', we.government_service, '"
                     }'
                  )
                  SEPARATOR ','
               ), ''),
            ']'
         ) AS work_experience,
         CONCAT(
            '[',
               IFNULL(GROUP_CONCAT(DISTINCT
                  CONCAT(
                     '{
                        "organizationName": "', vw.organization_name, '", ',
                        '"inclusiveDateFrom": "', vw.inclusive_date_from, '", ',
                        '"inclusiveDateTo": "', vw.inclusive_date_to, '", ',
                        '"numberOfHours": "', vw.number_of_hours, '", ',
                        '"natureOfWork": "', vw.nature_of_work, '"
                     }'
                  )
                  SEPARATOR ','
               ), ''),
            ']'
         ) AS voluntary_work,
         CONCAT(
            '[',
               IFNULL(GROUP_CONCAT(DISTINCT
                  CONCAT(
                     '{
                        "titleTrainingPrograms": "', t.title_training_programs, '", ',
                        '"periodDateFrom": "', t.period_date_from, '", ',
                        '"periodDateTo": "', t.period_date_to, '", ',
                        '"numberOfHours": "', t.number_of_hours, '", ',
                        '"typeOfLD": "', t.type_of_LD, '", ',
                        '"conductedBy": "', t.conducted_by, '"
                     }'
                  )
                  SEPARATOR ','
               ), ''),
            ']'
         ) AS training,
         CONCAT(
            '[',
               IFNULL(GROUP_CONCAT(DISTINCT
                  CONCAT(
                     '{
                        "hobbies": "', sk.hobbies, '", ',
                        '"recognition": "', sk.recognition, '", ',
                        '"membership": "', sk.membership, '"
                     }'
                  )
                  SEPARATOR ','
               ), ''),
            ']'
         ) AS other_info
      FROM employees_table AS e
      INNER JOIN family_information_table AS f
         ON e.employee_id = f.employee_id
      LEFT JOIN children_table AS c
         ON f.id = c.family_info_id
      LEFT JOIN education_background_table AS ed
         ON e.employee_id = ed.employee_id
      LEFT JOIN service_eligibity AS se
         ON e.employee_id = se.employee_id
      LEFT JOIN work_experience AS we
         ON e.employee_id = we.employee_id
      LEFT JOIN voluntary_work AS vw
         ON e.employee_id = vw.employee_id
      LEFT JOIN training AS t
         ON e.employee_id = t.employee_id
      LEFT JOIN other_info AS sk
         ON e.employee_id = sk.employee_id
      WHERE e.employee_id = ? 
      GROUP BY e.employee_id, f.id
   `;

   db.query(sql, [employee_id], (err, data) => {
      if (err) {
         callback(err, null)
      } else {
         callback(null, data[0]);
      }
   })
}