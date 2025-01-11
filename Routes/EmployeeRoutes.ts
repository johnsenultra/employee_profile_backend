import * as express from "express"
import { Request, Response, NextFunction } from "express"
const router = express.Router()
import EmployeeModel from "../models/EmployeeModel"
import multer = require("multer");
import path = require("path")


const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Define the route handler
router.post(
  "/upload-profile-image/:employeeId", 
  upload.single('profileImage'), 
  async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employeeId = parseInt(req.params.employeeId);
      
      if (!req.file) {
        res.status(400).json({ "error": "No file uploaded" });
        return;
      }

      // Format the path correctly for the database
      const filePath = `/uploads/${req.file.filename}`; // This will store /uploads/profileImage-timestamp.jpg
      
      const result = await new Promise((resolve, reject) => {
        EmployeeModel.addProfileImage(employeeId, filePath, (err: Error | null, result: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error occurred' });
    }
  }
);


router.get(
  "/profile-image/:id", 
  async (req: Request, res: Response) => {
    const employeeId = req.params.id;
    EmployeeModel.getProfileImage(employeeId, (err, result) => {
        if (err) {
            res.status(404).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
  }
);

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





router.get("/search", (req, res) => {
  const { term, page, limit } = req.query;
  
  EmployeeModel.search(term, Number(page), Number(limit), (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

router.get("/filter", (req, res) => {
  const filterParams = {
    civilStatus: req.query.civilStatus,
    // department: req.query.department,
    // dateFrom: req.query.dateFrom,
    // dateTo: req.query.dateTo,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10
  };

  EmployeeModel.filter(filterParams, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

export default router
