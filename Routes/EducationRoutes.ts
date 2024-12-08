import * as express from "express";
const router = express.Router();
import { 
   getEducation, 
   addEducation, 
   updateEducation, 
   getUpdateEducation, 
   deleteEducation 

} from "../controller/educationController";

// Get all education information
router.get("/getEducation/:employee_id", getEducation);

// Post education information
router.post("/addEducation", addEducation);

// Update education information
router.put("/updateEducation/:education_id", updateEducation);

// Get Update Education
router.get("/getUpdate/:employee_id", getUpdateEducation)

// Delete education information
router.delete("/deleteEducation/:education_id", deleteEducation);

export default router;