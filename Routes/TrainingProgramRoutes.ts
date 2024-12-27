import * as express from "express";
import {
   getTraining,
   addTraining,
   updateTraining,
   deleteTraining
} from "../controller/TrainingProgramController";

const route = express.Router();

// Get all training information
route.get("/getTraining/:employee_id", getTraining);

// Add training information
route.post("/addTraining/:employee_id", addTraining);

// Update training information
route.put("/updateTraining/:training_program_id", updateTraining);

// Get the training information to update

// Delete training information
route.delete("/deleteTraining/:training_program_id", deleteTraining);

export default route;