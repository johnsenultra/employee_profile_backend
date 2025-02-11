import { Request, Response } from "express";
import { route } from "express-extract-routes";
import { getRepository } from "typeorm";
import { User } from "../database/entities/user.entity";
import { Employee } from "../database/entities/employee.entity";
import { SuperAdmin } from "../database/entities/super_admin.entity";
import { comparePassword, hashPassword } from "../utils/bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { getCookieOptions } from "../utils/helper";
import * as jwt from "jsonwebtoken";

@route("/super-admin")
export class SuperAdminController {
  @route.post("/signin")
  async signin(request: Request, response: Response) {
    const { username, password } = request.body;
  
    try {
      const superAdmin = await getRepository(SuperAdmin)
        .createQueryBuilder("super_admin")
        .where("super_admin.username = :username", { username })
        .addSelect("super_admin.password")
        .getOne();

      if (!superAdmin || !(await comparePassword(password, superAdmin.password))) {
        return response.status(401).json({ message: "Invalid credentials" });
      }

      if (!superAdmin.isActive) {
        return response.status(403).json({ message: "Account is deactivated" });
      }

      // Create a partial user object for token generation
      const tokenUser: Partial<User> = {
        id: superAdmin.id,
        username: superAdmin.username,
        userType: "super_admin"
      };

      const accessToken = generateAccessToken(tokenUser);
      const refreshToken = generateRefreshToken(tokenUser);

      response.cookie("refreshToken", refreshToken, getCookieOptions());

      return response.status(200).json({
        accessToken,
        user: {
          id: superAdmin.id,
          username: superAdmin.username,
          role: "super_admin"
        }
      });
    } catch (error) {
      console.error("Super Admin Signin Error:", error);
      return response.status(500).json({ message: "Internal Server Error" });
    }
  }

  @route.post("/create-user")
  async createUser(request: Request, response: Response) {
    try {
      const { username, password, userType, firstName, surname } = request.body;

      const token = request.headers.authorization?.split(' ')[1];
      if (!token) {
        return response.status(401).json({ message: "Authorization required" });
      }

      const decoded = jwt.verify(token, process.env.JWT_KEY) as { data: Partial<User> };
      if (decoded.data.userType !== 'super_admin') {
        return response.status(403).json({ message: "Access denied" });
      }

      // Validate input
      if (!username || !password || !userType || !firstName || !surname) {
        return response.status(400).json({ message: "All fields are required" });
      }

      // Validate userType
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
        userType,   // This will be either "staff" or "admin"
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

  @route.get("/users")
  async getUsers(request: Request, response: Response) {
    try {
      const token = request.headers.authorization?.split(' ')[1];
      if (!token) {
          return response.status(401).json({ message: "Authorization required" });
      }

      const decoded = jwt.verify(token, process.env.JWT_KEY) as { data: Partial<User> };
      if (decoded.data.userType !== 'super_admin') {
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

  @route.get("/users/count")
  async getUsersCount(request: Request, response: Response) {
    try {
      // Verify authorization token
      const token = request.headers.authorization?.split(' ')[1];
      if (!token) {
        return response.status(401).json({ message: "Authorization"})
      } 

      // Verify super admin access
      const decoded = jwt.verify(token, process.env.JWT_KEY) as { data: Partial<User> };
      if (decoded.data.userType !== 'super_admin') {
        return response.status(403).json({ message: "Access denied" });
      }

      // Get user repository
      const userRepository = getRepository(User);

      // Get count for staff users
      const staffCount = await userRepository.count({ where: { userType: "staff" } });

      // Get count for admin users
      const adminCount = await userRepository.count({ where: { userType: "admin" } });

      // Calculate the total users
      const totalUsers = staffCount + adminCount;

      // Return the total users
      return response.json({
        staff: staffCount,
        admin: adminCount,
        total: totalUsers
      })
    } catch (error) {
      console.error("Get Users Count Error:", error);
      return response.status(500).json({ message: "Internal server error" });
    }
  }

  @route.get("/users/search")
  async searchUsers(request: Request, response: Response) {
    try {
      // Verify authorization token
      const token = request.headers.authorization?.split(' ')[1];
      if (!token) {
        return response.status(401).json({ message: "Authorization required" });
      }

      // Verify super admin access
      const decoded = jwt.verify(token, process.env.JWT_KEY) as { data: Partial<User> };
      if (decoded.data.userType !== 'super_admin') {
        return response.status(403).json({ message: "Access denied" });
      }

      // Get search parameters from query and convert search strings to lowercase
      const {
        username,
        userType,
        firstName,
        surname,
        startDate,
        endDate,
        page = 1,
        limit = 10
      } = request.query;

      // Create query builder
      const queryBuilder = getRepository(User)
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.employee", "employee")
        .select([
          "user.id",
          "user.username",
          "user.userType",
          "user.createdAt",
          "employee.firstName",
          "employee.surname"
        ]);

      // Add search conditions with LOWER() function for case-insensitive search
      if (username) {
        queryBuilder.andWhere("LOWER(user.username) LIKE LOWER(:username)", { 
          username: `%${(username as string).toLowerCase()}%` 
        });
      }

      if (userType) {
        queryBuilder.andWhere("user.userType = :userType", { userType });
      }

      if (firstName) {
        queryBuilder.andWhere("LOWER(employee.firstName) LIKE LOWER(:firstName)", {
          firstName: `%${(firstName as string).toLowerCase()}%`
        });
      }

      if (surname) {
        queryBuilder.andWhere("LOWER(employee.surname) LIKE LOWER(:surname)", {
          surname: `%${(surname as string).toLowerCase()}%`
        });
      }

      if (startDate) {
        queryBuilder.andWhere("user.createdAt >= :startDate", {
          startDate: new Date(startDate as string)
        });
      }

      if (endDate) {
        queryBuilder.andWhere("user.createdAt <= :endDate", {
          endDate: new Date(endDate as string)
        });
      }

      // Add pagination
      const skip = (Number(page) - 1) * Number(limit);
      queryBuilder.skip(skip).take(Number(limit));

      // Get results and total count
      const [users, total] = await queryBuilder.getManyAndCount();

      return response.status(200).json({
        users,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit))
        }
      });

    } catch (error) {
      console.error("Search Users Error:", error);
      return response.status(500).json({ message: "Internal server error" });
    }
  }

  @route.delete("/users/:id")
  async deleteUser(request: Request, response: Response) {
    try {
      // Verify authorization token
      const token = request.headers.authorization?.split(' ')[1];
      if (!token) {
        return response.status(401).json({ message: "Authorization required" });
      }

      // Verify super admin access
      const decoded = jwt.verify(token, process.env.JWT_KEY) as { data: Partial<User> };
      if (decoded.data.userType !== 'super_admin') {
        return response.status(403).json({ message: "Access denied" });
      }

      const userId = request.params.id;
      const userRepository = getRepository(User);

      // Check if user exists
      const user = await userRepository.findOne({ 
        where: { id: userId },
        relations: ["employee"]
      });

      if (!user) {
        return response.status(404).json({ message: "User not found" });
      }

      // Delete the user (this will also delete the associated employee due to cascade)
      await userRepository.remove(user);

      return response.status(200).json({ 
        message: "User deleted successfully" 
      });

    } catch (error) {
      console.error("Delete User Error:", error);
      return response.status(500).json({ message: "Internal server error" });
    }
  }

  @route.put("/users/:id/password")
  async changeUserPassword(request: Request, response: Response) {
    try {
      // Verify authorization token
      const token = request.headers.authorization?.split(' ')[1];
      if (!token) {
        return response.status(401).json({ message: "Authorization required" });
      }

      // Verify super admin access
      const decoded = jwt.verify(token, process.env.JWT_KEY) as { data: Partial<User> };
      if (decoded.data.userType !== 'super_admin') {
        return response.status(403).json({ message: "Access denied" });
      }

      const userId = request.params.id;
      const { newPassword } = request.body;

      // Validate new password
      if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
        return response.status(400).json({ 
          message: "New password must be at least 6 characters long" 
        });
      }

      const userRepository = getRepository(User);

      // Check if user exists
      const user = await userRepository
        .createQueryBuilder("user")
        .where("user.id = :id", { id: userId })
        .addSelect("user.password")
        .getOne();

      if (!user) {
        return response.status(404).json({ message: "User not found" });
      }

      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Update the password
      user.password = hashedPassword;
      await userRepository.save(user);

      return response.status(200).json({ 
        message: "Password updated successfully" 
      });

    } catch (error) {
      console.error("Change Password Error:", error);
      return response.status(500).json({ message: "Internal server error" });
    }
  }
}