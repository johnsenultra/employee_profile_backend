import { Request, Response } from "express"
import { route } from "express-extract-routes"
import { getRepository } from "typeorm"
import { Employee } from "../database/entities/employee.entity"
import { comparePassword } from "../utils/bcrypt"
import { generateAccessToken, generateRefreshToken } from "../utils/jwt"
import { getCookieOptions } from "../utils/helper"
import * as jwt from "jsonwebtoken"

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
      username,
      employeeId: employee.employeeId,
    })

    response.cookie("refreshToken", refreshToken, getCookieOptions())

    return response.status(200).send({ accessToken: accessToken })
  }

  @route.get("/refresh-token")
  async refreshToken(request: Request, response: Response) {
    const refreshToken = request.cookies.refreshToken

    if (!refreshToken)
      return response.status(406).send({ message: "refresh token is required" })

    return jwt.verify(
      refreshToken,
      process.env?.JWT_KEY,
      (error: any, data: { data: Employee }) => {
        if (error)
          return response
            .status(406)
            .send({ message: "refresh token is expired" })

        const accessToken = generateAccessToken({ ...data?.data })

        return response.status(200).send({ accessToken })
      }
    )
  }
}
