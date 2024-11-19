import * as express from "express"
import * as cors from "cors"
import { config } from "dotenv"
import "reflect-metadata"
import { createServer } from "http"
import { createConnection } from "typeorm"
import routes from "./Routes"
import { createController } from "express-extract-routes"

const app = express()

config()

const httpServer = createServer(app)

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))

createConnection()

//generate routes base on controllers decorators
routes.forEach((route) => {
  app[route.method](`/api` + route.path, createController(route))
})

const PORT = 3000
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
