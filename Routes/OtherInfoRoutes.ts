import * as express from "express";
import { addOtherInfo, deleteOtherInfo, getOtherInfo, updateOtherInfo } from "../controller/OtherInfoController";

const route = express.Router();

// Get all other information records
route.get("/getOtherInfo/:employee_id", getOtherInfo)

// Post other information records
route.post("/addOtherInfo/:employee_id", addOtherInfo)

// Update other information records
route.put("/updateOtherInfo/:other_info_id", updateOtherInfo)

// Delete other information records
route.delete("deleteOtherInfo/:other_info_id", deleteOtherInfo)

export default route;