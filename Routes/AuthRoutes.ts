import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const authController = new AuthController();

// Singup route
router.post("/signup", (req, res) => {
   authController.signup(req, res);
});

export default router;