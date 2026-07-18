import express, { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { paymentController } from "./payment.controller";

const router = Router();

/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     tags: [Payments]
 *     summary: Stripe webhook receiver (raw body)
 *     description: |
 *       Endpoint called by Stripe. The route is mounted separately before
 *       `express.json()` so Stripe's signature can be verified against the
 *       raw request body. Do not call this directly.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: "object" }
 *     parameters:
 *       - in: header
 *         name: stripe-signature
 *         required: true
 *         schema: { type: "string" }
 *     responses:
 *       200:
 *         description: Webhook processed
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: "#/components/schemas/SuccessResponse"
 *                 - type: object
 *                   properties:
 *                     data: { type: "object", nullable: true }
 *       400:
 *         description: Invalid signature
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook,
);

router.use(auth(UserRole.CUSTOMER, UserRole.ADMIN));

/**
 * @swagger
 * /payments/create:
 *   post:
 *     tags: [Payments]
 *     summary: Create a Stripe Checkout session for a rental order
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rentalOrderId]
 *             properties:
 *               rentalOrderId: { type: "string", format: "uuid" }
 *     responses:
 *       200:
 *         description: Checkout session created
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
 *                         paymentUrl: { type: "string" }
 *                         sessionId: { type: "string" }
 *                         payment: { $ref: "#/components/schemas/Payment" }
 *       400:
 *         description: Rental not in payable state
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 */
router.post("/create", paymentController.createCheckoutSession);

/**
 * @swagger
 * /payments/confirm:
 *   post:
 *     tags: [Payments]
 *     summary: Manually confirm a payment (fallback for missing webhooks)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [transactionId]
 *             properties:
 *               transactionId:
 *                 type: string
 *                 description: Stripe Checkout session id
 *     responses:
 *       200:
 *         description: Payment confirmed (or already completed)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: "#/components/schemas/SuccessResponse"
 *                 - type: object
 *                   properties:
 *                     data: { $ref: "#/components/schemas/Payment" }
 */
router.post("/confirm", paymentController.confirmPayment);

/**
 * @swagger
 * /payments:
 *   get:
 *     tags: [Payments]
 *     summary: List payments (current customer's, or all for admin)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Payment history
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
 *                         payments:
 *                           type: array
 *                           items: { $ref: "#/components/schemas/Payment" }
 *                         count: { type: "integer" }
 */
router.get("/", paymentController.getPaymentHistory);

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     tags: [Payments]
 *     summary: Get payment details by id
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
 *         description: Payment details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: "#/components/schemas/SuccessResponse"
 *                 - type: object
 *                   properties:
 *                     data: { $ref: "#/components/schemas/Payment" }
 *       403:
 *         description: Not your payment
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 */
router.get("/:id", paymentController.getPaymentDetails);

export const paymentRoutes = router;