import { Request, Response } from "express";
import ServiceEligibilityModel from "../models/ServiceEligibilityModel";

// Get service eligibility for an employee
export const getServiceEligibility = async (req: Request, res: Response) => {
   const employee_id = parseInt(req.params.employee_id);
   
   ServiceEligibilityModel.getServiceEligibility(employee_id, (err: Error, result) => {
      if(err)  {
         return res.status(500).json({ 
            message: "Failed to get service eligibility",
            error: err.message,
         });
      } else {
         res.status(200).json(result); 
      }
   });
}

// Add a new service eligibility record
export const addServiceEligibility = (req: Request, res: Response) => {
   const employeeId = parseInt(req.params.employee_id);
   
   // Create service eligibility data object with employee_id from route parameter
   const serviceEligibilityData = {
      ...req.body,
      employee_id: employeeId
   };

   ServiceEligibilityModel.addServiceEligibilityRecord(serviceEligibilityData, (err, result) => {
      if(err) {
         return res.status(500).json({ 
            message: "Failed to add service eligibility record",
            error: err.message, 
         });
      } else {
         res.status(201).json({ 
            message: "Service eligibility record added successfully",
            service_eligibility_id: result.insertId,
         });
      }
   });
};

// Update service eligibility information
export const updateServiceEligibility = (req: Request, res: Response) => {
   const service_eligibility_id = parseInt(req.params.service_eligibility_id);
   const serviceEligibilityData = req.body;

   ServiceEligibilityModel.updateServiceEligibility(service_eligibility_id, serviceEligibilityData, (err: any, result: any) => {
      if(err) {
         return res.status(500).json({ 
            error: err.message,
            message: "Failed to update service eligibility record",
          });
      } else {
         res.status(200).json({
            message: "Service eligibility record updated successfully",
            service_eligibility_id: service_eligibility_id,
         });
      }
   });
};

// Get update service eligibility information
export const getUpdateServiceEligibility = (req: Request, res: Response) => {
   const employee_id = parseInt(req.params.employee_id);
   ServiceEligibilityModel.getUpdateServiceEligibility(employee_id, (err: any, result: any) => {
      if(err) {
         return res.status(500).json({ 
            error: err.message,
            message: "Failed to get service eligibility record", 
         });
      } else {
         res.status(200).json({
            message: "Service eligibility record retrieved successfully",
            service_eligibility: result,
         });
      }
   });
}

// Delete service eligibility information by id
export const deleteServiceEligibility = async (req: Request, res: Response) => {
   const service_eligibility_id = parseInt(req.params.service_eligibility_id);
   ServiceEligibilityModel.deleteServiceEligibility(service_eligibility_id, (err: any, result: any) => {
      if(err) {
         return res.status(500).json({ 
            error: err.message,
            message: "Failed to delete service eligibility record",
         });
      } else {
         res.status(200).json({ 
            message: "Service eligibility record deleted successfully",
            service_eligibility_id: result.deleteId,
         });
      }
   });
}