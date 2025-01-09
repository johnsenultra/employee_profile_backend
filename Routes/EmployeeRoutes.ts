  import * as express from "express"
  import { Request, Response } from "express"
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
  router.get('/getEmployees', (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    EmployeeModel.getAll(page, limit, (err: Error, result: any) => {
      if (err) {
        console.error('Error fetching employees:', err);
        return res.status(500).json({ 
          error: 'Error fetching employees' 
        });
      }
      res.json(result);
    });
  });

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
    const employee_id = req.params.id
    const employeeData = req.body

    console.log("employeeData: ", employeeData)

    EmployeeModel.update(employee_id, employeeData, (err: Error, result: any) => {
      if(err) return res.status(500).json({ 
        message: "[EMPLOYEE UPDATE ERROR]",
        error: err.message
      })
      res.status(200).json({ message: "Employee updated successfully" })
    })
  })
  // Delete Employee
  router.delete("/deleteEmployee/:id", (req, res) => {
    // Call the model method that will delete the employee
    EmployeeModel.delete(req.params.id, (err: Error, result: any) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ message: "Employee deleted successfully" })
    })
  })

  // Search Employee
  // router.get("/search", (req: Request, res: Response) => {
  //   const { term } = req.query;
  //   const page = Number(req.query.page) || 1;
  //   const limit = Number(req.query.limit) || 10;

  //   if (!term) {
  //     return res.status(400).json({ 
  //       error: 'Search term is required' 
  //     });
  //   }

  //   EmployeeModel.search(term as string, page, limit, (err: Error, result: any) => {
  //     if (err) {
  //       console.error('Error searching employees:', err);
  //       return res.status(500).json({ 
  //         error: 'Error searching employees' 
  //       });
  //     }
  //     res.json(result);
  //   });
  // });
  router.get("/search", (req, res) => {
    const searchTerm = req.query.term
    EmployeeModel.search(searchTerm, (err, results) => {
      if (err) return res.status(500).json({ error: err.message })
      res.status(200).json(results)
    })
  })

  // Get total employees
  router.get("/totalEmployee", (req, res) => {
    EmployeeModel.totalEmployees((err, result) => {
      if(err) {
        return res.status(500).json({ error: err.message })
      } else {
        res.status(200).json(result)
      }
    })
  })

  export default router
