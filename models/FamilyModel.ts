import sql from "../utils/db"
import db from "../utils/db"

const FamilyModel = {
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
        father_first_name: familyData.father_first_name,
        father_middle_name: familyData.father_middle_name,
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

  // getFamily: (id, callback) => {
  //   const sql = `SELECT * FROM family_information_table WHERE employee_id = ?`
  //   db.query(sql, [id], (err, data: any) => {
  //     if (err) {
  //       callback(err, null)
  //     } else {
  //       callback(null, data.length > 0 ? data[0] : null)
  //     }
  //   })
  // },

  // getChildren: (id, callback) => {
  //   const sql = `SELECT * FROM children_table WHERE family_info_id = ?`
  //   db.query(sql, [id], (err, data) => {
  //     if(err) {
  //       callback(err, null)
  //     } else {
  //       callback(null, data)
  //     }
  //   })
  // }

  getFamilyWithChildren: (id, callback) => {
    // First, get the family information
    db.query(
      `SELECT * FROM family_information_table WHERE employee_id = ?`, [id], (err, familyData: any) => {
        if(err) {
          return callback(err, null)
        }

        // If no family record found, we return null
        if(familyData.length === 0) {
          return callback(null, null)
        }

        // Geth the family info ID to fetch children
        const familyInfoId = familyData[0].id;

        // Fetch children for his family
        db.query(
          `SELECT * FROM children_table WHERE family_info_id = ?`, [familyInfoId], (err, childrenData) => {
            if(err) {
              return callback(err, null)
            }

            // Combine family information and children
            const result = {
              familyInfo: familyData[0],
              children: childrenData
            };

            callback(null, result)
          }
        )
      } 
    )
  }
}

export default FamilyModel
