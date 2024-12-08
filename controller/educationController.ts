import * as express from "express";
import { Request, Response } from "express";
import  EducationalModel  from "../models/EducationModel";

// Get all education information
export const getEducation = async (req: Request, res: Response) => {
   const employee_id = parseInt(req.params.employee_id);
   EducationalModel.getEducation(employee_id, (err, result) => {
      if(err)  {
         return res.status(500).json({ error: err.message });
      } else {
         res.status(200).json(result);
      }
   })
}

// Add a new education information
export const addEducation = (req, res) => {
   const data = req.body;
   EducationalModel.addEducationRecord(data, (err, result) => {
      if(err) {
         return res.status(500).json({ 
            message: "Failed to add education record",
            error: err.message, 
         })
      } else {
         res.status(201).json({ 
            message: "Education record added successfully",
            edication_id: result.insertId,
         });
      }
   })
}

// Update education information
export const updateEducation = (req: Request, res: Response) => {
   const education_id = parseInt(req.params.education_id);
   const educationData = req.body;

   EducationalModel.updateEducation(education_id, educationData, (err: any, result: any) => {
      if(err) {
         return res.status(500).json({ error: err.message });
      } else {
         res.status(200).json({ message: "Education record updated successfully" });
      }
   });
};

// export const updateEducation = async (req: Request, res: Response) => {
//    const employee_id = parseInt(req.params.employee_id);
//    const educationDataArray = req.body; // expecting an array of education records

//    console.log(req.body);
   
//    EducationalModel.updateEducation(employee_id, educationDataArray, (err: any, result: any) => {
//       if(err) {
//          return res.status(500).json({ 
//             error: "Failed to update education record",
//             details: err.message,
//          });
//       } else {
//          res.status(200).json({ message: "Education record updated successfully", result });
//       }
//    })
// }

// getUpdate education information
export const getUpdateEducation = (req: Request, res: Response) => {
   const employee_id = parseInt(req.params.employee_id);
   EducationalModel.getUpdateEducation(employee_id, (err: any, result: any) => {
      if(err) {
         return res.status(500).json({ 
            error: err.meesage,
            message: "GET UPDATE ERROR", 
         });
      } else {
         res.status(200).json({ 
            message: "Education record deleted successfully",
            education_id: result.deleteId,
         })
      }
   })
}

// Delete education iformation by id
export const deleteEducation = async (req: Request, res: Response) => {
   const education_id = parseInt(req.params.education_id);
   EducationalModel.deleteEducation(education_id, (err: any, results: any) => {
      if(err) {
            return res.status(500).json({ error: err.message });
      }  else {
            res.status(200).json({ message: "Education record deleted successfully" });
      }
   })
}