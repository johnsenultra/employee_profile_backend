// controllers/voluntaryWorkController.ts
import { Request, Response } from "express";
import VoluntaryWorkModel from "../models/VoluntaryWorkModel";

// Get voluntary work for an employee
export const getVoluntaryWork = async (req: Request, res: Response) => {
   const employee_id = parseInt(req.params.employee_id);
   
   VoluntaryWorkModel.getVoluntaryWork(employee_id, (err, result) => {
      if(err)  {
         return res.status(500).json({ error: err.message });
      } else {
         res.status(200).json(result);
      }
   });
}

// Add a new voluntary work record
export const addVoluntaryWork = (req: Request, res: Response) => {
   const employeeId = parseInt(req.params.employee_id);
   
   // Create voluntary work data object with employee_id from route parameter
   const voluntaryWorkData = {
      ...req.body,
      employee_id: employeeId
   };

   VoluntaryWorkModel.addVoluntaryWorkRecord(voluntaryWorkData, (err, result) => {
      if(err) {
         return res.status(500).json({ 
            message: "Failed to add voluntary work record",
            error: err.message, 
         });
      } else {
         res.status(201).json({ 
            message: "Voluntary work record added successfully",
            voluntary_work_id: result.insertId,
         });
      }
   });
};

// Update voluntary work information
export const updateVoluntaryWork = (req: Request, res: Response) => {
   const voluntary_work_id = parseInt(req.params.voluntary_work_id);
   const voluntaryWorkData = req.body;

   VoluntaryWorkModel.updateVoluntaryWork(voluntary_work_id, voluntaryWorkData, (err: any, result: any) => {
      if(err) {
         return res.status(500).json({ error: err.message });
      } else {
         res.status(200).json({ message: "Voluntary work record updated successfully" });
      }
   });
};

// Get update voluntary work information
export const getUpdateVoluntaryWork = (req: Request, res: Response) => {
   const employee_id = parseInt(req.params.employee_id);
   VoluntaryWorkModel.getUpdateVoluntaryWork(employee_id, (err: any, result: any) => {
      if(err) {
         return res.status(500).json({ 
            error: err.message,
            message: "Failed to get voluntary work record", 
         });
      } else {
         res.status(200).json(result);
      }
   });
}

// Delete voluntary work information by id
export const deleteVoluntaryWork = async (req: Request, res: Response) => {
   const voluntary_work_id = parseInt(req.params.voluntary_work_id);
   VoluntaryWorkModel.deleteVoluntaryWork(voluntary_work_id, (err: any, result: any) => {
      if(err) {
         return res.status(500).json({ error: err.message });
      } else {
         res.status(200).json({ 
            message: "Voluntary work record deleted successfully",
            voluntary_work_id: result.deleteId,
         });
      }
   });
}