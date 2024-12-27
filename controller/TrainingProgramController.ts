import { Request, Response } from 'express';
import TrainingProgramModel from '../models/TrainingProgramModel';

// Get training programs for an employee
export const getTraining = (req: Request, res: Response) => {
   const employee_id = req.params.employee_id;

   TrainingProgramModel.getTraining(Number(employee_id), (err: Error, result) => {
      if(err) {
         return res.status(500).json({
            message: 'Failed to get training programs', 
            error: err.message 
         })
      } else {
         res.status(200).json(result);
      }
   })
}

export const addTraining = (req: Request, res: Response) => {
   const employee_id = parseInt(req.params.employee_id);
   
   const trainingData = {
      ...req.body,
      employee_id: employee_id
   }

   TrainingProgramModel.addTraining(trainingData, (err: Error, result) => {
      if(err) {
         return res.status(500).json({
            message: 'Failed to add training program',
            error: err.message
         });
      } else {
         return res.status(201).json({
            message: "Training program added successfullty",
            training_program_id: result.insertId
         })
      }
   })
}

// Update training program information by id
export const updateTraining = (req: Request, res: Response) => {
   const training_program_id = req.params.id;
   const trainingProgramData = req.body;

   TrainingProgramModel.updateTraining(parseInt(training_program_id), trainingProgramData, (err: Error, result) => {
      if(err) {
         return res.status(500).json({
            message: "Failde to update training program",
            error: err.message
         })
      } else {
         return res.status(200).json({
            message: "Training program updated successfully",
            training_program_id: training_program_id
         })
      }
   })
}

// Delete training program by id informato
export const deleteTraining = (req: Request, res: Response) => {
   const training_program_id = req.params.id;

   TrainingProgramModel.deleteTraining(parseInt(training_program_id), (err: Error, result: any) => {
      if(err) {
         return res.status(500).json({
            message: "Failed to delete training program",
            error: err.message
         })
      } else {
         return res.status(200).json({
            message: "Training program deleted successfully",
            training_program_id: training_program_id
         })
      }
   })
}