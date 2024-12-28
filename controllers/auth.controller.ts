import { Request, Response } from "express";
import { route } from "express-extract-routes";
import { getRepository } from "typeorm";
import { User } from "../database/entities/user.entity";
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

    const user = await getRepository(User)
      .createQueryBuilder("users")
      .where("users.username = :username", { username })
      .addSelect("users.password") // Include password in the query
      .addSelect("users.id")
      .addSelect("users.username")
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
    });

    const refreshToken = generateRefreshToken({
      username,
      id: user.id
    });

    response.cookie("refreshToken", refreshToken, getCookieOptions());

    return response.status(200).json({ accessToken });
  }

  @route.post("/signup")
  async signup(request: Request, response: Response) {
    try {
      const { username, password, confirmPassword, userType } = request.body;

      // Input validation
      if (!username || !password || !confirmPassword) {
        return response.status(400).json({ message: "All fields are required" });
      }

      if (password !== confirmPassword) {
        return response.status(422).json({ message: "Passwords do not match" });
      }

      const userRepository = getRepository(User);

      // Check if username already exists
      const existingUser = await userRepository.findOne({ where: { username } });
      if (existingUser) {
        return response.status(409).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create and save the new user
      const newUser = userRepository.create({
        username,
        password: hashedPassword,
        userType: userType || "staff", // Default to 'staff' if not provided
      });
      await userRepository.save(newUser);

      // Automatically log in the new user
      const accessToken = generateAccessToken({ id: newUser.id, username: newUser.username });
      const refreshToken = generateRefreshToken({ id: newUser.id, username: newUser.username });

      response.cookie("refreshToken", refreshToken, getCookieOptions());

      return response.status(201).json({ accessToken });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: "Internal server error" });
    }
  }

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
