import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { rentalController } from "./rental.controller";

const route = Router();

/**
 * @swagger
 * /rentals/gear:
 *   post:
 *     tags: [Rentals]
 *     summary: Place a new rental order (single gear item)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [gearItemId, quantity, rentalStartDate, rentalEndDate]
 *             properties:
 *               gearItemId: { type: "string", format: "uuid" }
 *               quantity: { type: "integer", minimum: 1 }
 *               rentalStartDate: { type: "string", format: "date-time" }
 *               rentalEndDate: { type: "string", format: "date-time" }
 *               pickupAddress: { type: "string", nullable: true }
 *               notes: { type: "string", nullable: true }
 *     responses:
 *       201:
 *         description: Rental placed
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
 *                         rental: { $ref: "#/components/schemas/RentalOrder" }
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 */
route.post("/gear", auth(UserRole.CUSTOMER), rentalController.createRental);

/**
 * @swagger
 * /rentals/rentals:
 *   get:
 *     tags: [Rentals]
 *     summary: List the authenticated customer's rental orders
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
route.get(
  "/rentals",
  auth(UserRole.CUSTOMER),
  rentalController.getUserRentals,
);

/**
 * @swagger
 * /rentals/rentals/{id}:
 *   get:
 *     tags: [Rentals]
 *     summary: Get a single rental order
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: "string", format: "uuid" }
 *     responses:
 *       200:
 *         description: Rental
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
 *                         rental: { $ref: "#/components/schemas/RentalOrder" }
 *       403:
 *         description: Not your rental
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 */
route.get(
  "/rentals/:id",
  auth(UserRole.CUSTOMER),
  rentalController.getRentalById,
);

export const rentalRoutes = route;