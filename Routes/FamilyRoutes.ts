import * as express from "express"
const router = express.Router()
import FamilyEmployeeModel from "../models/FamilyEmployeeModel"

//

// Create family information
router.post("/addFamily/:employeeId", (req, res) => {
  const employeeId = req.params.employeeId
  FamilyEmployeeModel.create(employeeId, req.body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.status(201).json(results)
  })
})

// Update family information
router.put("/updateFamily/:employeeId", (req, res) => {
  const employeeId = req.params.employeeId
  FamilyEmployeeModel.update(employeeId, req.body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.status(200).json(results)
  })
})

export default router
