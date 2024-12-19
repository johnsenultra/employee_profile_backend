
import * as express from "express";
import { 
   getVoluntaryWork, 
   addVoluntaryWork, 
   updateVoluntaryWork, 
   getUpdateVoluntaryWork, 
   deleteVoluntaryWork 
} from "../controller/VoluntaryWorkController";
const route = express.Router();

// Get all voluntary work information
route.get("/getVoluntaryWork/:employee_id", getVoluntaryWork);

// Post voluntary work information
route.post("/addVoluntaryWork/:employee_id", addVoluntaryWork);

// Update voluntary work information
route.put("/updateVoluntaryWork/:voluntary_work_id", updateVoluntaryWork);

// Get Update Voluntary Work
route.get("/getUpdateVoluntaryWork/:employee_id", getUpdateVoluntaryWork)

// Delete voluntary work information
route.delete("/deleteVoluntaryWork/:voluntary_work_id", deleteVoluntaryWork);

export default route;