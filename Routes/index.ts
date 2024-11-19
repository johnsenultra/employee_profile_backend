import { extract } from "express-extract-routes"
import { UserController } from "../controllers/user.controller"

const routes = extract(UserController)

export default routes
