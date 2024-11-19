import * as express from "express"
const router = express.Router()
import EmployeeModel from "../models/EmployeeModel"

// Create Employee
router.post("/addEmployee", (req, res) => {
  EmployeeModel.create(req.body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.status(201).json({
      message: "Employee Created successfully",
      employeeId: results.insertId,
    })
  })
})

// Get All Employess
router.get("/getEmployees", (req, res) => {
  // Call the model method that will return all employees
  EmployeeModel.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    res.status(200).json(results)
  })
})

// Get employees by ID
router.get("/getEmployee/:id", (req, res) => {
  // Call the model method that will return employee by ID
  EmployeeModel.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    res.status(200).json(results)
  })
})

// Get employees by ID to update
router.get("/update/:id", (req, res) => {
  // Call the model method that will return employee by ID
  EmployeeModel.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    res.status(200).json(results)
  })
})

// Update Employee
router.put("/updateEmployee/:id", (req, res) => {
  // Call the model method that will update the employee
  EmployeeModel.update(req.params.id, req.body, (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ message: "Employee updated successfully" })
    console.log(results)
  })
})

// Delete Employee
router.delete("/deleteEmployee/:id", (req, res) => {
  // Call the model method that will delete the employee
  EmployeeModel.delete(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ message: "Employee deleted successfully" })
  })
})

// router.delete('/delete/:id', (req, res) => {
//    const employeeId = req.params.id;
//    const sql = 'DELETE FROM employees_table WHERE employee_id = ?';
//    db.query(sql, employeeId, (err, result) => {
//       if (err) throw err;
//       res.json({ message: 'Employee deleted successfully' });
//    });
// });

// Search Employee
router.get("/search", (req, res) => {
  const searchTerm = req.query.term
  EmployeeModel.search(searchTerm, (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    res.status(200).json(results)
  })
})

export default router
