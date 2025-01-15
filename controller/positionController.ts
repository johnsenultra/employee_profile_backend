import { Request, Response } from 'express';
import PositionModel from '../models/PositionModel'
import { get } from 'http';
import { Server } from 'mysql2/typings/mysql/lib/Server';

const PositionController = {
   // Create new category
   createCategory: (req: Request, res: Response) => {
      const categoryData = {
         category_name: req.body.categoryName
      }

      PositionModel.createCategory(categoryData, (err: Error, data: any) => {
         if (err) {
         res.status(500).json({
            success: false,
            message: "Error creating category",
            error: err
         })
         } else {
         res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: data
         })
         }
      })
   },

   // Create new position
   createPosition: (req: Request, res: Response) => {
      const positionData = {
         position_name: req.body.position_name,
         category_id: req.body.category_id
      }

      PositionModel.createPosition(positionData, (err: Error, data: any) => {
         if (err) {
         res.status(500).json({
            success: false,
            message: "Error creating position",
            error: err
         })
         } else {
         res.status(201).json({
            success: true,
            message: "Position created successfully",
            data: data
         })
         }
      })
   },

   // Get all categories with positions
   getAllCategories: (req: Request, res: Response) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
  
      PositionModel.getAllCategories(page, limit, (err: Error, result: any) => {
        if (err) {
          res.status(500).json({
            success: false,
            message: "Error fetching categories",
            error: err
          });
        } else {
          res.status(200).json({
            success: true,
            data: result.data,
            pagination: {
              currentPage: page,
              totalPages: Math.ceil(result.total / limit),
              totalItems: result.total,
              itemsPerPage: limit
            }
          });
        }
      });
    },

   // Get positions by category
   getPositionsByCategory: (req: Request, res: Response) => {
      const categoryId = req.params.categoryId

      PositionModel.getPositionsByCategory(Number(categoryId), (err: Error, data: any) => {
         if (err) {
         res.status(500).json({
            success: false,
            message: "Error fetching positions",
            error: err
         })
         } else {
            res.status(200).json(data)
         }
      })
   },

   // Get position by Id
   getPositionById: (req: Request, res: Response) => {
      const position_id = req.params.position_id

      PositionModel.getPositionById(Number(position_id), (err: Error, data: any) => {
         if (err) {
         res.status(500).json({
            success: false,
            message: "Error fetching position",
            error: err
         })
         } else {
         res.status(200).json({
            success: true,
            data: data
         })
         }
      })
   },

   // Update employee position
   updateEmployeePosition: (req: Request, res: Response) => {
      const employee_id = req.params.employee_id;
      const employeeData = {
         position_id: req.body.position_id,
         category_id: req.body.category_id
      };
  
      PositionModel.updateEmployeePosition(Number(employee_id), employeeData, (err: Error, data: any) => {
         if (err) {
            return res.status(500).json({
                  success: false,
                  message: "Error updating employee position",
                  error: {
                     code: err || 'UNKNOWN_ERROR',
                     details: err.message
                  }
            });
         }
         res.status(200).json({
            success: true,
            message: "Employee position updated successfully",
            data: data
         });
      });
   },
    
   // Get employee position details
   getEmployeePosition: (req: Request, res: Response) => {
      const { employeeId } = req.params

      PositionModel.getEmployeePosition(Number(employeeId), (err: Error, data: any) => {
         if (err) {
         res.status(500).json({
            success: false,
            message: "Error fetching employee position", 
            error: err
         })
         } else if (!data) {
         res.status(404).json({
            success: false,
            message: "Employee not found"
         })
         } else {
         res.status(200).json({
            success: true,
            data: data
         })
         }
      })
   },

   // Get total employees by category
   totalCategoryFaculty: (req: Request, res: Response) => {
      PositionModel.getTotalFaculty((err: Error, totalFaculty: number) => {
         if(err) {
            res.status(400).json({ 
               success: false,
               message: "Error fetching categories",
               error: err
            })
         } else {
            // const totalCategories = data.length
            res.status(200).json(totalFaculty)
         }
      })
   },

   // Get total employees by category
   totalCategoryNonteachingStaff: (req: Request, res: Response) => {
      PositionModel.getTotalNonTeachingStaff((err: Error, totalFaculty: number) => {
         if(err) {
            res.status(400).json({ 
               success: false,
               message: "Error fetching categories",
               error: err
            })
         } else {
            // const totalCategories = data.length
            res.status(200).json(totalFaculty)
         }
      })
   },

   getEmployeesPosition: (req: Request, res: Response) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
  
      PositionModel.getAllEmployeesPositions(page, limit, (err: Error, result: any) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Error fetching employees',
            error: err
          });
        }
        return res.status(200).json({
          success: true,
          data: result.data,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(result.total / limit),
            totalItems: result.total,
            itemsPerPage: limit
          }
        });
      });
    },

   // Search
   search: (req: Request, res: Response) => {
      const searchTerm = req.query.searchTerm;
      PositionModel.search(String(searchTerm), (err: Error, results: any) => {
          if (err) {
              return res.status(500).json({
               success: false,
               message: 'Error fetching employees',
               error: err.message
            });
          }
          console.log('Search results:', results);
          return res.status(200).json(results);
      });
   }

}

export default PositionController
