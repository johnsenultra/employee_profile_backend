import { Request, Response } from "express"
import { route } from "express-extract-routes"

const users = [
  { id: 123, username: "admin" },
  { id: 456, username: "user" },
]

@route("/users")
export class UserController {
  @route.get("/")
  async getAll() {
    return users
  }
  @route.get("/:id")
  async getOne(request: Request, response: Response) {
    return users.find((user) => user.id === +request.params.id)
  }
}
