import * as express from "express";
import {
   getWorkExperience,
   addWorkExperience,
   updateWorkExperience,
   getUpdateWorkExperience,
   deleteWorkExperience
} from "../controller/WorkExperienceController";
const route = express.Router();

// Get all work experience information
route.get("/getWorkExperience/:employee_id", getWorkExperience);

// Post work experience information
route.post("/addWorkExperience/:employee_id", addWorkExperience);

// Update work experience information
route.put("/updateWorkExperience/:work_experience_id", updateWorkExperience);

// Get Update Work Experience
route.get("/getUpdateWorkExperience/:employee_id", getUpdateWorkExperience)

// Delete work experience information
route.delete("/deleteWorkExperience/:work_experience_id", deleteWorkExperience);

export default route;