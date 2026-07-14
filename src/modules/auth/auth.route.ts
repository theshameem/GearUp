import { Router } from "express";
import { authController } from "./auth.controller";

const route = Router();

route.post("/register", authController.registerUser);

route.post("/login", authController.loginUser);

route.get("/me", authController.myDetails);

export const authRoutes = route;
