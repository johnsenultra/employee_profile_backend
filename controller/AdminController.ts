import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../database/entities/user.entity";
import { Employee } from "../database/entities/employee.entity";
import { comparePassword, hashPassword } from "../utils/bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { getCookieOptions } from "../utils/helper";
import * as jwt from "jsonwebtoken";

export class AdminController {
  async signin(request: Request, response: Response) {
    const { username, password } = request.body;

    try {
      const admin = await getRepository(User)
        .createQueryBuilder("admin")
        .where("admin.username = :username", { username })
        .addSelect("admin.password")
        .getOne();

      if (!admin || !(await comparePassword(password, admin.password))) {
        return response.status(401).json({ message: "Invalid credentials" });
      }

      const tokenUser: Partial<User> = {
        id: admin.id,
        username: admin.username,
        userType: "admin"
      };

      const accessToken = generateAccessToken(tokenUser);
      const refreshToken = generateRefreshToken(tokenUser);

      response.cookie("refreshToken", refreshToken, getCookieOptions());

      return response.status(200).json({
        accessToken,
        user: {
          id: admin.id,
          username: admin.username,
          role: "admin"
        }
      });
    } catch (error) {
      console.error("Admin Signin Error:", error);
      return response.status(500).json({ message: "Internal Server Error" });
    }
  }

  async createUser(request: Request, response: Response) {
    try {
      const { username, password, userType, firstName, surname } = request.body;

      const token = request.headers.authorization?.split(' ')[1];
      if (!token) {
        return response.status(401).json({ message: "Authorization required" });
      }

      const decoded = jwt.verify(token, process.env.JWT_KEY) as { data: Partial<User> };
      if (decoded.data.userType !== 'admin') {
        return response.status(403).json({ message: "Access denied" });
      }

      if (!username || !password || !userType || !firstName || !surname) {
        return response.status(400).json({ message: "All fields are required" });
      }

      if (userType !== "staff" && userType !== "admin") {
        return response.status(400).json({ 
          message: "Invalid user type. Must be either 'staff' or 'admin'" 
        });
      }

      const userRepository = getRepository(User);
      const employeeRepository = getRepository(Employee);

      const existingUser = await userRepository.findOne({ where: { username } });
      if (existingUser) {
        return response.status(409).json({ message: "Username already exists" });
      }

      const newEmployee = employeeRepository.create({ firstName, surname });
      await employeeRepository.save(newEmployee);

      const hashedPassword = await hashPassword(password);
      
      const newUser = userRepository.create({
        username,
        password: hashedPassword,
        userType,
        employee: newEmployee
      });
        
      await userRepository.save(newUser);

      return response.status(201).json({
        message: "User created successfully",
        user: {
          id: newUser.id,
          username: newUser.username,
          userType: newUser.userType,
          employee: {
            firstName: newEmployee.firstName,
            surname: newEmployee.surname
          }
        }
      });
    } catch (error) {
        console.error("Create User Error:", error);
        return response.status(500).json({ message: "Internal server error" });
    }
  }

  async getUsers(request: Request, response: Response) {
    try {
      const token = request.headers.authorization?.split(' ')[1];
      if (!token) {
          return response.status(401).json({ message: "Authorization required" });
      }

      const decoded = jwt.verify(token, process.env.JWT_KEY) as { data: Partial<User> };
      if (decoded.data.userType !== 'admin') {
        return response.status(403).json({ message: "Access denied" });
      }

      const users = await getRepository(User)
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.employee", "employee")
        .select([
          "user.id",
          "user.username",
          "user.userType",
          "user.createdAt",
          "employee.firstName",
          "employee.surname"
        ])
        .getMany();

        return response.status(200).json(users);
    } catch (error) {
      console.error("Get Users Error:", error);
      return response.status(500).json({ message: "Internal server error" });
    }
  }

  async getUsersCount(request: Request, response: Response) {
    try {
      const token = request.headers.authorization?.split(' ')[1];
      if (!token) {
        return response.status(401).json({ message: "Authorization required" });
      }

      const decoded = jwt.verify(token, process.env.JWT_KEY) as { data: Partial<User> };
      if (decoded.data.userType !== 'admin') {
        return response.status(403).json({ message: "Access denied" });
      }

      const userRepository = getRepository(User);

      const staffCount = await userRepository.count({ where: { userType: "staff" } });
      const adminCount = await userRepository.count({ where: { userType: "admin" } });
      const totalUsers = staffCount + adminCount;

      return response.json({
        staff: staffCount,
        admin: adminCount,
        total: totalUsers
      });
    } catch (error) {
      console.error("Get Users Count Error:", error);
      return response.status(500).json({ message: "Internal server error" });
    }
  }
}