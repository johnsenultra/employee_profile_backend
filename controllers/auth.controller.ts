import { Request, Response } from "express"
import { route } from "express-extract-routes"
import { getRepository } from "typeorm"
import { Employee } from "../database/entities/employee.entity"
import { comparePassword } from "../utils/bcrypt"
import { generateAccessToken, generateRefreshToken } from "../utils/jwt"
import { getCookieOptions } from "../utils/helper"

@route("/auth")
export class AuthController {
  @route.post("/signin")
  async signin(request: Request, response: Response) {
    const username = request.body?.username as string
    const password = request.body?.password as string

    const employee = await getRepository(Employee)
      .createQueryBuilder("employees_table")
      .where("employees_table.username = :username", { username })
      .select("employees_table.password")
      .addSelect("employees_table.employeeId")
      .addSelect("employees_table.username")
      .getOne()

    if (!employee || !(await comparePassword(password, employee.password))) {
      return { message: "Invalid username or password!", status: 401 }
    }

    if (employee?.username !== username) {
      return { message: "Invalid username or password!", status: 401 }
    }

    const accessToken = generateAccessToken({
      username,
      employeeId: employee?.employeeId,
    })

    const refreshToken = generateRefreshToken({
      employeeId: employee.employeeId,
    })

    response.cookie("refreshToken", refreshToken, getCookieOptions())

    return response.status(200).send({ accessToken: accessToken })
  }
}
