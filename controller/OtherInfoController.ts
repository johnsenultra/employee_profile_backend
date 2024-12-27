import { Request, Response } from "express";
import { OtherInfoModel } from "../models/OtherInfoModel";

// Get other information record
export const getOtherInfo = (req: Request, res: Response) => {
   const employee_id = parseInt(req.params.employee_id);
   OtherInfoModel.getOtherInfo(employee_id, (err: Error, result: any) => {
      if(err) {
         return res.status(500).json({
            message: "Failed to get other information",
            error: err.message
         })
      } else {
         return res.status(200).json(result)
      }
   })
}

// Add other information record
export const addOtherInfo = (req: Request, res: Response) => {
   const employee_id = parseInt(req.params.employee_id);

   // Create other information data object with employee_id from route parameter
   const otherInfoData = {
      ...req.body,
      employee_id: employee_id
   }

   OtherInfoModel.addOtherInfo(otherInfoData, (err: Error, result: any) => {
      if(err) {
         return res.status(500).json({
            message: "Failed to add other information",
            error: err.message
         })
      } else {
         return res.status(201).json({
            message: "Other information added successfully",
            other_info_id: result.insertId
         })
      }
   })
}

// Update other information record
export const updateOtherInfo = (req: Request, res: Response) => {
   const other_info_id = parseInt(req.params.id);
   const otherInfoData = req.body;

   OtherInfoModel.updateOtherInfo(other_info_id, otherInfoData, (err: Error, result: any) => {
      if(err) {
         return res.status(500).json({
            message: "Failed to update other information",
            errorr: err.message
         })
      } else {
         return res.status(200).json({
            message: "Other information update successfully",
            other_inf_id: other_info_id
         })
      }
   })
}

// Delete other information record
export const deleteOtherInfo = (req: Request, res: Response) => {
   const other_info_id = parseInt(req.params.id);
   OtherInfoModel.deleteOtherInfo(other_info_id, (err: Error, result: any) => {
      if(err) {
         return res.status(500).json({
            message: "Failed to delete other information",
            error: err.message
         })
      } else {
         return res.status(200).json({
            message: "Other information deleted successfully",
            other_info_id: result.deleteId
         })
      }
   })
}