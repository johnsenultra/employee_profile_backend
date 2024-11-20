import { sign } from "jsonwebtoken"
import { Employee } from "../database/entities/employee.entity"
import { config } from "dotenv"
config()

const JWT_KEY = process?.env?.JWT_KEY

export const generateAccessToken = (employee: Partial<Employee>) =>
  sign(
    {
      data: employee,
    },
    JWT_KEY,
    { expiresIn: process.env.NODE_ENV === "production" ? "5m" : "10m" }
  )

export const generateRefreshToken = (employee: Partial<Employee>) =>
  sign(
    {
      data: employee,
    },
    JWT_KEY,
    { expiresIn: "7d" }
  )
