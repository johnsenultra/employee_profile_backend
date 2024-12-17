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
import ServiceEligibility from "./Routes/ServiceEligibilityRoutes"
import ServiceEligibity from "./Routes/serviceEligibityRoutes"
import VoluntaryWork from "./Routes/VoluntaryWorkRoutes"
import TrainingProgram from "./Routes/TrainingProgramRoutes"
import { authenticateToken } from "./middlewares/auth.middleware"

const app = express()

config()

const httpServer = createServer(app)
  
app.use(cookieParser())
app.use(express.json());
app.use(bodyParser.json())

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))

createConnection()

app.use("/auth", AuthRoutes)

app.use("/api/employees", EmployeeRoutes)
app.use("/api/family", FamilyRoutes)
app.use("/api/education", EducationRoutes)
app.use("/api/work", WorkExperience);
app.use("/api/service-eligibility", ServiceEligibility);
app.use("/api/service", ServiceEligibity);
app.use("/api/voluntary", VoluntaryWork);
app.use("/api/training", TrainingProgram);

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
