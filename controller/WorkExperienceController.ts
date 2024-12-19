// controllers/workExperienceController.ts
import { Request, Response } from "express";
import WorkExperienceModel from "../models/WorkExperienceModel";

// Get work experience for an employee
export const getWorkExperience = async (req: Request, res: Response) => {
   const employee_id = parseInt(req.params.employee_id);
   
   WorkExperienceModel.getWorkExperience(employee_id, (err, result) => {
      if(err)  {
         return res.status(500).json({ error: err.message });
      } else {
         res.status(200).json(result);
      }
   });
}

// Add a new work experience record
export const addWorkExperience = (req: Request, res: Response) => {
   const employeeId = parseInt(req.params.employee_id);
   
   // Create work experience data object with employee_id from route parameter
   const workExperienceData = {
      ...req.body,
      employee_id: employeeId
   };

   WorkExperienceModel.addWorkExperienceRecord(workExperienceData, (err, result) => {
      if(err) {
         return res.status(500).json({ 
            message: "Failed to add work experience record",
            error: err.message, 
         });
      } else {
         res.status(201).json({ 
            message: "Work experience record added successfully",
            work_experience_id: result.insertId,
         });
      }
   });
};

// Update work experience information
export const updateWorkExperience = (req: Request, res: Response) => {
   const work_experience_id = parseInt(req.params.work_experience_id);
   const workExperienceData = req.body;

   WorkExperienceModel.updateWorkExperience(work_experience_id, workExperienceData, (err: any, result: any) => {
      if(err) {
         return res.status(500).json({ error: err.message });
      } else {
         res.status(200).json({ message: "Work experience record updated successfully" });
      }
   });
};

// Get update work experience information
export const getUpdateWorkExperience = (req: Request, res: Response) => {
   const employee_id = parseInt(req.params.employee_id);
   WorkExperienceModel.getUpdateWorkExperience(employee_id, (err: any, result: any) => {
      if(err) {
         return res.status(500).json({ 
            error: err.message,
            message: "Failed to get work experience record", 
         });
      } else {
         res.status(200).json(result);
      }
   });
}

// Delete work experience information by id
export const deleteWorkExperience = async (req: Request, res: Response) => {
   const work_experience_id = parseInt(req.params.work_experience_id);
   WorkExperienceModel.deleteWorkExperience(work_experience_id, (err: any, result: any) => {
      if(err) {
         return res.status(500).json({ error: err.message });
      } else {
         res.status(200).json({ 
            message: "Work experience record deleted successfully",
            work_experience_id: result.deleteId,
         });
      }
   });
}