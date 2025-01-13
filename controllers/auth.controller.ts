import { Request, Response } from "express";
import { route } from "express-extract-routes";
import { getRepository } from "typeorm";
import { User } from "../database/entities/user.entity";
import { SuperAdmin } from "../database/entities/super_admin.entity";
import { Employee } from "../database/entities/employee.entity";
import { comparePassword, hashPassword } from "../utils/bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { getCookieOptions } from "../utils/helper";
import * as jwt from "jsonwebtoken";

@route("/auth")
export class AuthController {
  @route.post("/signin")
  async signin(request: Request, response: Response) {
    const username = request.body?.username as string;
    const password = request.body?.password as string;
    
    try {

      // First try super admin login
      const superAdmin = await getRepository(SuperAdmin)
      .createQueryBuilder("super_admin")
      .where("super_admin.username = :username", { username })
      .addSelect("super_admin.password")
      .getOne();

      if (superAdmin && await comparePassword(password, superAdmin.password)) {
        const accessToken = generateAccessToken({
          username,
          id: superAdmin.id,
          userType: "super_admin",
        });

        const refreshToken = generateRefreshToken({
          username,
          id: superAdmin.id,
          userType: "super_admin",
        });

        response.cookie("refreshToken", refreshToken, getCookieOptions());

        return response.status(200).json({
          accessToken,
          user: {
            id: superAdmin.id,
            username: superAdmin.username,
            userType: "super_admin"
          }
        });
      }

      const user = await getRepository(User)
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.employee", "employee")
      .where("user.username = :username", { username })
      .addSelect("user.password") // Include password in the query
      .addSelect("user.id")
      .addSelect("user.username")
      .getOne();

      if (!user || !(await comparePassword(password, user.password))) {
        return response.status(401).json({ message: "Invalid username or password!" });
      }

      if(user?.username !== username) {
        return response.status(401).json({ message: "Invalid username or password!" });
      }

      const accessToken = generateAccessToken({
        username,
        id: user.id,
        userType: user.userType,
      });

      const refreshToken = generateRefreshToken({
        username,
        id: user.id,
        userType: user.userType
      });

      response.cookie("refreshToken", refreshToken, getCookieOptions());

      return response.status(200).json({
        accessToken,
        user: {
          id: user.id,
          username: user.username,
          userType: user.userType
        }
      });
      
    } catch (error) {
      console.error("Singin Error:", error);
      return response.status(500).json({ message: "Internal Server Error"});
    }
  }

  @route.post("/signup")
  async signup(request: Request, response: Response) {
    try {
      const { username, password, confirmPassword, userType, firstName, surname } = request.body;
  
      // Input validation
      if (!username || !password || !confirmPassword || !firstName || !surname) {
        return response.status(400).json({ message: "All fields are required" });
      }
  
      if (password !== confirmPassword) {
        return response.status(422).json({ message: "Passwords do not match" });
      }
  
      const userRepository = getRepository(User);
      const employeeRepository = getRepository(Employee);
  
      // Check if username already exists
      const existingUser = await userRepository.findOne({ where: { username } });
      if (existingUser) {
        return response.status(409).json({ message: "Username already exists" });
      }
  
      const hashedPassword = await hashPassword(password);
      // Create the Employee
      const newEmployee = employeeRepository.create({ firstName, surname });
      await employeeRepository.save(newEmployee);
      // Create the User and link to the new Employee
      const newUser = userRepository.create({
        username,
        password: hashedPassword,
        userType: userType || "staff",
        employee: newEmployee, // Automatically links to the employee
      });
      await userRepository.save(newUser);
  
      return response.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: "Internal server error" });
    }
  }
// async signup(request: Request, response: Response) {
//    try {
//       const { username, password, confirmPassword, userType, employeeId } = request.body;

//       // Input validation
//       if (!username || !password || !confirmPassword) {
//          return response.status(400).json({ message: "All fields are required" });
//       }

//       if (password !== confirmPassword) {
//          return response.status(422).json({ message: "Passwords do not match" });
//       }

//       const userRepository = getRepository(User);
//       const employeeRepository = getRepository(Employee);

//       // Check if username already exists
//       const existingUser = await userRepository.findOne({ where: { username } });
//       if (existingUser) {
//          return response.status(409).json({ message: "Username already exists" });
//       }

//       // Hash password
//       const hashedPassword = await hashPassword(password);

//       // Create and save the new employee record (if applicable)
//       let newEmployee = null;
//       if (employeeId) {
//          newEmployee = employeeRepository.create({
//             employeeId,  // Assuming employeeId is passed from frontend
//             // Other employee fields (e.g., name, department) can also be added here
//          });
//          await employeeRepository.save(newEmployee);
//       }

//       // Create and save the new user
//       const newUser = userRepository.create({
//          username,
//          password: hashedPassword,
//          userType: userType || "staff", // Default to 'staff' if not provided
//          employee: newEmployee, // Link the new employee to the user
//       });
//       await userRepository.save(newUser);

//       // Automatically log in the new user
//       const accessToken = generateAccessToken({ 
//          id: newUser.id, 
//          username: newUser.username,
//          userType: newUser.userType,
//          // Optionally include employee data (employeeId)
//       });

//       const refreshToken = generateRefreshToken({
//          id: newUser.id,
//          username: newUser.username 
//       });

//       response.cookie("refreshToken", refreshToken, getCookieOptions());

//       return response.status(201).json({
//          accessToken,
//          user: {
//             id: newUser.id,
//             username: newUser.username,
//             userType: newUser.userType,
//             employeeId: newEmployee ? newEmployee.employeeId : null, // Include employee data if available
//          },
//       });
//    } catch (error) {
//       console.error(error);
//       return response.status(500).json({ message: "Internal server error" });
//    }


  @route.get("/refresh-token")
  async refreshToken(request: Request, response: Response) {
    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) {
      return response.status(406).json({ message: "Refresh token is required" });
    }

    jwt.verify(refreshToken, process.env.JWT_KEY, (error: any, decoded: any) => {
      if (error) {
        return response.status(406).json({ message: "Refresh token is expired" });
      }

      const accessToken = generateAccessToken({
        id: decoded.id,
        username: decoded.username,
        userType: decoded.userType,
      });

      return response.status(200).json({ accessToken });
    });
  }
}
