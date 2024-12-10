import { Request, Response } from "express"
import { route } from "express-extract-routes"
import { getRepository } from "typeorm"
import { Employee } from "../database/entities/employee.entity"
import { comparePassword, hashPassword } from "../utils/bcrypt"
import { generateAccessToken, generateRefreshToken } from "../utils/jwt"
import { getCookieOptions } from "../utils/helper"
import * as jwt from "jsonwebtoken"
const bcrypt = require('bcrypt')

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

  @route.post("/signup")
  async signup(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Validate email format (optional but recommended)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      const userRepository = getRepository(Employee);
      
      // Check if the username or email already exists
      const existingUser = await userRepository.findOne({
        where: [{ username }, { email }]
      });

      if (existingUser) {
        return res.status(400).json({ 
          message: existingUser.username === username 
            ? "Username already exists" 
            : "Email already exists" 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = userRepository.create({
        username,
        email,
        password: hashedPassword
      });

      await userRepository.save(newUser);

      // Generate Tokens
      const accessToken = generateAccessToken({ 
        username, 
        employeeId: newUser.employeeId 
      });
      const refreshToken = generateRefreshToken({ 
        username, 
        employeeId: newUser.employeeId 
      });

      res.cookie("refreshToken", refreshToken, getCookieOptions());

      return res.status(201).json({ 
        message: "User registered successfully",
        accessToken
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
