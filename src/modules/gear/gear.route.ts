import { Router } from "express";
import { gearController } from "./gear.controller";

const route = Router();

/**
 * @swagger
 * /gear:
 *   get:
 *     tags: [Gear]
 *     summary: List gear items
 *     description: Public catalog of active gear items with optional filters.
 *     security: []
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema: { type: "string" }
 *         description: Matches name/brand/description (case-insensitive).
 *       - in: query
 *         name: categoryId
 *         schema: { type: "string", format: "uuid" }
 *       - in: query
 *         name: brand
 *         schema: { type: "string" }
 *       - in: query
 *         name: minPrice
 *         schema: { type: "number" }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: "number" }
 *       - in: query
 *         name: availableOnly
 *         schema: { type: "boolean" }
 *     responses:
 *       200:
 *         description: Gear list
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
route.get("/gear", gearController.getGearList);

/**
 * @swagger
 * /gear/{id}:
 *   get:
 *     tags: [Gear]
 *     summary: Get gear item details
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: "string", format: "uuid" }
 *     responses:
 *       200:
 *         description: Gear details
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
 *                         item: { $ref: "#/components/schemas/GearItem" }
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 */
route.get("/gear/:id", gearController.getGearDetailsById);

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Gear]
 *     summary: List all gear categories
 *     security: []
 *     responses:
 *       200:
 *         description: Category list
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
 *                         categories:
 *                           type: array
 *                           items: { $ref: "#/components/schemas/Category" }
 *                         count: { type: "integer" }
 */
route.get("/categories", gearController.getGearCategoryList);

export const gearRoutes = route;