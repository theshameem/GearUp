import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { authController } from "./auth.controller";

const route = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     description: Create a customer or provider account.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name: { type: "string", example: "Shameem Alam" }
 *               email: { type: "string", format: "email", example: "shameem@gmail.com" }
 *               password: { type: "string", example: "1234" }
 *               profileImage: { type: "string", nullable: true, example: "www.google.com" }
 *               role:
 *                 $ref: "#/components/schemas/UserRole"
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: "#/components/schemas/SuccessResponse"
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user: { $ref: "#/components/schemas/User" }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 */
route.post("/register", authController.registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in and obtain tokens
 *     description: Returns access + refresh tokens and sets refreshToken cookie.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: "string", format: "email" }
 *               password: { type: "string" }
 *     responses:
 *       200:
 *         description: Logged in
 *         headers:
 *           Set-Cookie:
 *             schema: { type: "string" }
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: "#/components/schemas/SuccessResponse"
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         accessToken: { type: "string" }
 *                         refreshToken: { type: "string" }
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 */
route.post("/login", authController.loginUser);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current authenticated user
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: "#/components/schemas/SuccessResponse"
 *                 - type: object
 *                   properties:
 *                     data: { $ref: "#/components/schemas/User" }
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 */
route.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER),
  authController.myDetails,
);

export const authRoutes = route;