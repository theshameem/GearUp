import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { reviewController } from "./review.controller";

const route = Router();

/**
 * @swagger
 * /reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Leave a review on returned gear
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rentalOrderId, gearItemId, rating]
 *             properties:
 *               rentalOrderId: { type: "string", format: "uuid" }
 *               gearItemId: { type: "string", format: "uuid" }
 *               rating: { type: "integer", minimum: 1, maximum: 5 }
 *               comment: { type: "string", nullable: true }
 *     responses:
 *       201:
 *         description: Review created
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
 *                         review: { $ref: "#/components/schemas/Review" }
 *       400:
 *         description: Invalid request (e.g. rental not returned, duplicate)
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 */
route.post("/", auth(UserRole.CUSTOMER), reviewController.createReview);

export const reviewRoutes = route;