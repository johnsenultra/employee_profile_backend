import db from "../utils/db"
import { RowDataPacket, OkPacket } from 'mysql2'

interface FamilyInfo extends RowDataPacket {
  id: number;
  employee_id: number;
  spouse_surname: string;
  spouse_first_name: string;
  spouse_middle_name: string;
  spouse_name_extension: string;
  spouse_occupation: string;
  business_address: string;
  employer_name: string;
  spouse_telephone_no: string;
  father_surname: string;
  father_first_name: string;
  father_middle_name: string;
  father_name_extension: string;
  mother_maiden_name: string;
  mother_first_name: string;
  mother_middle_name: string;
}

const FamilyModel = {
  create: (employeeId, familyData, callback) => {
    const familyInfo = {
      employee_id: employeeId,
      spouse_surname: familyData.spouse_surname,
      spouse_first_name: familyData.spouse_first_name,
      spouse_middle_name: familyData.spouse_middle_name,
      spouse_name_extension: familyData.spouse_name_extension,
      spouse_occupation: familyData.spouse_occupation,
      business_address: familyData.business_address,
      employer_name: familyData.employer_name,
      spouse_telephone_no: familyData.spouse_telephone_no,
      father_surname: familyData.father_surname,
      father_first_name: familyData.father_first_name,
      father_middle_name: familyData.father_middle_name,
      father_name_extension: familyData.father_name_extension,
      mother_maiden_name: familyData.mother_maiden_name,
      mother_first_name: familyData.mother_first_name,
      mother_middle_name: familyData.mother_middle_name,
    }
    
    db.beginTransaction((err) => {
      if (err) {
        return callback(err, null)
      }

      // Insert family information
      db.query<OkPacket>(
        "INSERT INTO family_information_table SET ?",
        familyInfo,
        (err, familyResult) => {
          if (err) {
            return db.rollback(() => {
              callback(err, null)
            })
          }

          const familyInfoId = familyResult.insertId

          // If there are children, insert them
          if (familyData.children && familyData.children.length > 0) {
            const childrenValues = familyData.children.map((child) => [
              familyInfoId,
              child.name,
              child.dateOfBirth,
            ])

            const childrenSql =
              "INSERT INTO children_table (family_info_id, children_fullname, child_date_of_birth) VALUES ?"

            db.query(childrenSql, [childrenValues], (err) => {
              if (err) {
                return db.rollback(() => {
                  callback(err, null)
                })
              }

              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    callback(err, null)
                  })
                }
                callback(null, {
                  familyId: familyInfoId,
                  message: "Family information and children added successfully",
                })
              })
            })
          } else {
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  callback(err, null)
                })
              }
              callback(null, {
                familyId: familyInfoId,
                message: "Family information added successfully",
              })
            })
          }
        }
      )
    })
  },

  update: (employeeId, familyData, callback) => {
    db.beginTransaction((err) => {
      if (err) {
        return callback(err, null)
      }

      // First check if family information exists
      db.query<FamilyInfo[]>(
        "SELECT id FROM family_information_table WHERE employee_id = ?",
        [employeeId],
        (err, familyIdResult) => {
          if (err) {
            return db.rollback(() => {
              callback(err, null)
            })
          }

          // If no family record exists, create one instead of updating
          if (!familyIdResult?.[0]) {
            return FamilyModel.create(employeeId, familyData, callback);
          }

          const familyInfoId = familyIdResult[0].id;

          // Update family information
          const familyInfo = {
            spouse_surname: familyData.spouse_surname,
            spouse_first_name: familyData.spouse_first_name,
            spouse_middle_name: familyData.spouse_middle_name,
            spouse_name_extension: familyData.spouse_name_extension,
            spouse_occupation: familyData.spouse_occupation,
            business_address: familyData.business_address,
            employer_name: familyData.employer_name,
            spouse_telephone_no: familyData.spouse_telephone_no,
            father_surname: familyData.father_surname,
            father_first_name: familyData.father_first_name,
            father_middle_name: familyData.father_middle_name,
            father_name_extension: familyData.father_name_extension,
            mother_maiden_name: familyData.mother_maiden_name,
            mother_first_name: familyData.mother_first_name,
            mother_middle_name: familyData.mother_middle_name,
          }

          db.query<OkPacket>(
            "UPDATE family_information_table SET ? WHERE employee_id = ?",
            [familyInfo, employeeId],
            (err) => {
              if (err) {
                return db.rollback(() => {
                  callback(err, null)
                })
              }

              // Delete existing children
              db.query<OkPacket>(
                "DELETE FROM children_table WHERE family_info_id = ?",
                [familyInfoId],
                (err) => {
                  if (err) {
                    return db.rollback(() => {
                      callback(err, null)
                    })
                  }

                  // If there are children, insert them
                  if (familyData.children && familyData.children.length > 0) {
                    const childrenValues = familyData.children.map((child) => [
                      familyInfoId,
                      child.name,
                      child.dateOfBirth,
                    ])

                    const childrenSql =
                      "INSERT INTO children_table (family_info_id, children_fullname, child_date_of_birth) VALUES ?"

                    db.query<OkPacket>(childrenSql, [childrenValues], (err) => {
                      if (err) {
                        return db.rollback(() => {
                          callback(err, null)
                        })
                      }

                      db.commit((err) => {
                        if (err) {
                          return db.rollback(() => {
                            callback(err, null)
                          })
                        }
                        callback(null, {
                          message: "Family information and children updated successfully",
                        })
                      })
                    })
                  } else {
                    // If no children, just commit the family information update
                    db.commit((err) => {
                      if (err) {
                        return db.rollback(() => {
                          callback(err, null)
                        })
                      }
                      callback(null, {
                        message: "Family information updated successfully",
                      })
                    })
                  }
                }
              )
            }
          )
        }
      )
    })
  },

  getFamilyWithChildren: (id, callback) => {
    // First, get the family information
    db.query<FamilyInfo[]>(
      `SELECT * FROM family_information_table WHERE employee_id = ?`,
      [id],
      (err, familyData) => {
        if (err) {
          return callback(err, null)
        }

        // If no family record found, return null
        if (!familyData?.[0]) {
          return callback(null, null)
        }

        // Get the family info ID to fetch children
        const familyInfoId = familyData[0].id

        // Fetch children for this family
        db.query<RowDataPacket[]>(
          `SELECT * FROM children_table WHERE family_info_id = ?`,
          [familyInfoId],
          (err, childrenData) => {
            if (err) {
              return callback(err, null)
            }

            // Combine family information and children
            const result = {
              familyInfo: familyData[0],
              children: childrenData
            }

            callback(null, result)
          }
        )
      }
    )
  },
}

export default FamilyModel