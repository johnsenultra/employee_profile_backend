import { extract } from "express-extract-routes"
import { EmployeeController } from "../controllers/employee.controller"
import { FamilyInfoController } from "../controllers/family_info.controller"
import { AuthController } from "../controllers/auth.controller"

const routes = extract(EmployeeController, FamilyInfoController, AuthController)

export default routes
