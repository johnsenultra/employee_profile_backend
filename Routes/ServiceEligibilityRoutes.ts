import * as express from "express";
import { 
   getServiceEligibility, 
   addServiceEligibility, 
   updateServiceEligibility, 
   getUpdateServiceEligibility, 
   deleteServiceEligibility 

} from "../controller/ServiceEligbilityController";
const route = express.Router();

// Get service eligibility information
route.get("/getServiceEligibility/:employee_id", getServiceEligibility);

// Post service eligibility information
route.post("/addServiceEligibility/:employee_id", addServiceEligibility);

// Update service eligibility information
route.put("/updateServiceEligibility/:service_eligibility_id", updateServiceEligibility);

// Get update service eligibility information
route.get("/getUpdateServiceEligibility/:employee_id", getUpdateServiceEligibility);

// Delete service eligibility information
route.delete("/deleteServiceEligibility/:service_eligibility_id", deleteServiceEligibility);

export default route;