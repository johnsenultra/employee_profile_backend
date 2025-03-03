import * as express from "express"
import * as cors from "cors"
import * as bodyParser from "body-parser"
import * as cookieParser from "cookie-parser"
import { config } from "dotenv"
import "reflect-metadata"
import { createServer } from "http"
import { createConnection } from "typeorm"
import routes from "./Routes"
import { createController } from "express-extract-routes"
import EmployeeRoutes from "./Routes/EmployeeRoutes"
import FamilyRoutes from "./Routes/FamilyRoutes"
import EducationRoutes from "./Routes/EducationRoutes"
import AuthRoutes from "./Routes/AuthRoutes"
import WorkExperience from "./Routes/WorkExperienceRoutes"
import ServiceEligibity from "./Routes/ServiceEligibilityRoutes"
import VoluntaryWork from "./Routes/VoluntaryWorkRoutes"
import TrainingProgram from "./Routes/TrainingProgramRoutes"
import OtherInfo from "./Routes/OtherInfoRoutes"
import Position from "./Routes/PositionRoutes"
import SuperAdmin from "./Routes/superAdminRoutes"
import Admin from "./Routes/AdminRoutes"
import Excel from "./Routes/PDsRoutes"
import { authenticateToken } from "./middlewares/auth.middleware"

const app = express()

config()

const httpServer = createServer(app)
  
app.use(cookieParser())
app.use(express.json());
app.use(bodyParser.json())
app.use('/uploads', express.static('public/uploads'));
app.use(
  cors({ 
    origin: process.env.CLIENT_URL, credentials: true,
    exposedHeaders: ["Content-Disposition"]
  })
)

createConnection()

app.use("/auth", AuthRoutes)

app.use("/api/employees", EmployeeRoutes)
app.use("/api/family", FamilyRoutes)
app.use("/api/education", EducationRoutes)
app.use("/api/work", WorkExperience);
app.use("/api/service", ServiceEligibity);
app.use("/api/voluntary", VoluntaryWork);
app.use("/api/training", TrainingProgram);
app.use("/api/other", OtherInfo)
app.use("/api", Position )
app.use('/super-admin', SuperAdmin);
app.use('/admin', Admin)
app.use('/api', Excel);

//generate routes base on controllers decorators
routes.forEach((route) => {
  app[route.method](
    `/v2/api` + route.path,
    authenticateToken(route.options?.protected),
    createController(route)
  )
})

const PORT = 3000
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
