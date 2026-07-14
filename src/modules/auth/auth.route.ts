import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { authController } from "./auth.controller";

const route = Router();

route.post("/register", authController.registerUser);

route.post("/login", authController.loginUser);

route.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER),
  authController.myDetails,
);

export const authRoutes = route;
