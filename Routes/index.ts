import { extract } from "express-extract-routes"
import { EmployeeController } from "../controllers/employee.controller"
import { FamilyInfoController } from "../controllers/family_info.controller"

const routes = extract(EmployeeController, FamilyInfoController)

export default routes
