import { sign } from "jsonwebtoken"
import { Employee } from "../database/entities/employee.entity"
import { User } from "../database/entities/user.entity"
import { config } from "dotenv"
config()

const JWT_KEY = process?.env?.JWT_KEY

export const generateAccessToken = (user: Partial<User>) =>
  sign(
    {
      data: user,
    },
    JWT_KEY,
    { expiresIn: process.env.NODE_ENV === "production" ? "2d" : "3d" }
  )

export const generateRefreshToken = (user: Partial<User>) => {

  const expirationTime = user.userType === "super_admin" 
  ? "2d"  // 2 days for super admin
  : "7d"  // 7 days for regular users

  return sign(
    {
      data: user,
    },
    JWT_KEY,
    { expiresIn: expirationTime }
  )
}
