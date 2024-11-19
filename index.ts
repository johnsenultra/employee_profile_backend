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

const app = express()

config()

const httpServer = createServer(app)

app.use(cookieParser())
app.use(bodyParser.json())

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))

createConnection()

app.use("/api/employees", EmployeeRoutes)
app.use("/api/family", FamilyRoutes)

//generate routes base on controllers decorators
routes.forEach((route) => {
  app[route.method](`/v2/api` + route.path, createController(route))
})

const PORT = 3000
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
