import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { adminController } from "./admin.controller";

const route = Router();

/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: List all users
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Users
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
 *                         users:
 *                           type: array
 *                           items: { $ref: "#/components/schemas/User" }
 *                         count: { type: "integer" }
 */
route.get("/users", adminController.getAllUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   patch:
 *     tags: [Admin]
 *     summary: Update a user's status and/or role
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: "string", format: "uuid" }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               status: { $ref: "#/components/schemas/UserStatus" }
 *               role: { $ref: "#/components/schemas/UserRole" }
 *     responses:
 *       200:
 *         description: Updated
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
 */
route.patch("/users/:id", adminController.updateUserById);

/**
 * @swagger
 * /admin/gear:
 *   get:
 *     tags: [Admin]
 *     summary: List all gear items in the platform
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Gear items
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
 *                         items:
 *                           type: array
 *                           items: { $ref: "#/components/schemas/GearItem" }
 *                         count: { type: "integer" }
 */
route.get("/gear", adminController.getGearList);

/**
 * @swagger
 * /admin/rentals:
 *   get:
 *     tags: [Admin]
 *     summary: List all rental orders
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Rentals
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
 *                         rentals:
 *                           type: array
 *                           items: { $ref: "#/components/schemas/RentalOrder" }
 *                         count: { type: "integer" }
 */
route.get("/rentals", adminController.getRentalList);

export const adminRoutes = route;