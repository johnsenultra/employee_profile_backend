import * as express from "express"
const router = express.Router()
import FamilyModel from "../models/FamilyModel"

// // Get family records
// router.get("/getFamily/:employeeId", (req, res) => {
//   const employeeId = req.params.employeeId
//   FamilyModel.getFamily(employeeId, (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: err.message })
//     }
//     res.status(200).json(results)
//   })
// })

// // Get children records
// router.post("/getChildren/:familyId", (req, res) => {
//   const familyId = req.params.familyId
//   FamilyModel.getChildren(familyId, (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: err.message })
//     }
//     res.status(200).json(results)
//   })
// })

// Get family records with children
router.get("/getFamilyAndChildren/:employeeId", (req, res) => {
  const employeeId = req.params.employeeId
  FamilyModel.getFamilyWithChildren(employeeId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.status(200).json(results)
  })
})

// Create family records
router.post("/addFamily/:employeeId", (req, res) => {
  const employeeId = req.params.employeeId
  console.log("Received employeeId:", employeeId);
  console.log("Received family data:", req.body);

  FamilyModel.create(employeeId, req.body, (err, results) => {
    if (err) {
      console.error("Error in FamilyModel.create:", err);
      return res.status(500).json({ 
        error: err.message,
        details: err // This can help see more details about the error
      })
    }
    console.log("Successfully created family record:", results);
    res.status(201).json(results)
  })  
})

// Update family information
  router.put("/updateFamily/:employeeId", (req, res) => {
    const employeeId = req.params.employeeId
    FamilyModel.update(employeeId, req.body, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.status(200).json(results)
    })
  })
  export default router
