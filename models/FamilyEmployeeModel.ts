import db from "../utils/db"

const FamilyEmployeeModel = {
  create: (employeeId, familyData, callback) => {
    // First insert into family_information_table
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
      db.query(
        "INSERT INTO family_information_table SET ?",
        familyInfo,
        (err, familyResult: any) => {
          if (err) {
            return db.rollback(() => {
              callback(err, null)
            })
          }

          const familyInfoId = familyResult.insertId

          // If there are children, insert them
          if (familyData.children && familyData.children.length > 0) {
            // Prepare children data with family_info_id
            const childrenValues = familyData.children.map((child) => [
              familyInfoId,
              child.name,
              child.dateOfBirth,
            ])

            const childrenSql =
              "INSERT INTO children_table (family_info_id, children_fullname, child_date_of_birth) VALUES ?"

            db.query(childrenSql, [childrenValues], (err, childrenResult) => {
              if (err) {
                return db.rollback(() => {
                  callback(err, null)
                })
              }

              // If everything is successful, commit the transaction
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
            // If no children, just commit the family information
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

  // Update family information
  update: (employeeId, familyData, callback) => {
    db.beginTransaction((err) => {
      if (err) {
        return callback(err, null)
      }

      // First update family information
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
        father_first_name: familyData.father_firstName,
        father_middle_name: familyData.father_middleName,
        father_name_extension: familyData.father_name_extension,
        mother_maiden_name: familyData.mother_maiden_name,
        mother_first_name: familyData.mother_first_name,
        mother_middle_name: familyData.mother_middle_name,
      }

      db.query(
        "UPDATE family_information_table SET ? WHERE employee_id = ?",
        [familyInfo, employeeId],
        (err, familyResult) => {
          if (err) {
            return db.rollback(() => {
              callback(err, null)
            })
          }

          // Get the family_info_id
          db.query(
            "SELECT id FROM family_information_table WHERE employee_id = ?",
            [employeeId],
            (err, familyIdResult) => {
              if (err) {
                return db.rollback(() => {
                  callback(err, null)
                })
              }

              const familyInfoId = familyIdResult[0].id

              // Delete existing children
              db.query(
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
                          message:
                            "Family information and children updated successfully",
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
}

export default FamilyEmployeeModel
