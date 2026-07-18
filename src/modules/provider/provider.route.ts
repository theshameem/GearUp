import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { providerController } from "./provider.controller";

const route = Router();

/**
 * @swagger
 * /provider/gear:
 *   post:
 *     tags: [Provider]
 *     summary: Add a gear item to provider inventory
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [categoryId, name, dailyRentalPrice, totalStock, condition]
 *             properties:
 *               categoryId: { type: "string", format: "uuid" }
 *               name: { type: "string" }
 *               description: { type: "string", nullable: true }
 *               brand: { type: "string", nullable: true }
 *               model: { type: "string", nullable: true }
 *               dailyRentalPrice: { type: "string", example: "12.50" }
 *               depositAmount: { type: "string", example: "50.00" }
 *               totalStock: { type: "integer", example: 10 }
 *               availableStock: { type: "integer", example: 10 }
 *               condition: { $ref: "#/components/schemas/GearCondition" }
 *               imageUrl: { type: "string", nullable: true }
 *               specifications: { type: "object", nullable: true }
 *               isActive: { type: "boolean", example: true }
 *     responses:
 *       201:
 *         description: Gear created
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
 *                         gear: { $ref: "#/components/schemas/GearItem" }
 */
route.post(
  "/gear",
  auth(UserRole.PROVIDER),
  providerController.addGearToInventory,
);

/**
 * @swagger
 * /provider/gear/{id}:
 *   put:
 *     tags: [Provider]
 *     summary: Update a gear item you own
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
 *             properties:
 *               categoryId: { type: "string", format: "uuid" }
 *               name: { type: "string" }
 *               description: { type: "string", nullable: true }
 *               brand: { type: "string", nullable: true }
 *               model: { type: "string", nullable: true }
 *               dailyRentalPrice: { type: "string", example: "12.50" }
 *               depositAmount: { type: "string", example: "50.00" }
 *               totalStock: { type: "integer" }
 *               availableStock: { type: "integer" }
 *               condition: { $ref: "#/components/schemas/GearCondition" }
 *               imageUrl: { type: "string", nullable: true }
 *               specifications: { type: "object", nullable: true }
 *               isActive: { type: "boolean" }
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
 *                         gear: { $ref: "#/components/schemas/GearItem" }
 *       403:
 *         description: Not the owner
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 */
route.put(
  "/gear/:id",
  auth(UserRole.PROVIDER),
  providerController.updateGearById,
);

/**
 * @swagger
 * /provider/gear/{id}:
 *   delete:
 *     tags: [Provider]
 *     summary: Remove a gear item from inventory
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
 *         description: Deleted
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
 *                         id: { type: "string", format: "uuid" }
 *       400:
 *         description: Gear has active rental orders
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 */
route.delete(
  "/gear/:id",
  auth(UserRole.PROVIDER),
  providerController.deleteGearById,
);

/**
 * @swagger
 * /provider/orders:
 *   get:
 *     tags: [Provider]
 *     summary: List incoming rental orders for the provider
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Incoming orders
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
 *                         orders:
 *                           type: array
 *                           items: { $ref: "#/components/schemas/RentalOrder" }
 *                         count: { type: "integer" }
 */
route.get(
  "/orders",
  auth(UserRole.PROVIDER),
  providerController.getProvidersIncomingOrder,
);

/**
 * @swagger
 * /provider/orders/{id}:
 *   patch:
 *     tags: [Provider]
 *     summary: Update rental order status (provider's portion)
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [CONFIRMED, PAID, PICKED_UP, RETURNED, CANCELLED]
 *                 description: |
 *                   Next status. Allowed transitions:
 *                   PLACED -> CONFIRMED | CANCELLED
 *                   CONFIRMED -> PAID | CANCELLED
 *                   PAID -> PICKED_UP | CANCELLED
 *                   PICKED_UP -> RETURNED
 *     responses:
 *       200:
 *         description: Status updated
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
 *                         order: { $ref: "#/components/schemas/RentalOrder" }
 *       400:
 *         description: Invalid transition
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 */
route.patch(
  "/orders/:id",
  auth(UserRole.PROVIDER),
  providerController.updateRentalOrderStatusById,
);

export const providerRoutes = route;