import express from "express";
const router = express.Router();
import EmployeeModel from "../models/EmployeeModel.js";

// Create Employee
router.post('/postEmployee', (req, res) => {
      EmployeeModel.create(req.body, (err, results) => {
         if (err) return res.status(500).json({ error: err.message });
         res.status(201).json({ messagg: 'Employee Created successfully', employeeId: results.insertId });
   })
});

// Get All Employess
router.get('/getEmployees', (req, res) => {
   EmployeeModel.getAll((err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(results);
   });
});

// Get employees by ID
router.get('/getEmployee/:id', (req, res) => {
   EmployeeModel.getById(req.params.id, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(results);
   })
})

// Update Employee

// Delete Employee

export default router;