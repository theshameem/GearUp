import express, { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook,
);

router.use(auth(UserRole.CUSTOMER, UserRole.ADMIN));

router.post("/create", paymentController.createCheckoutSession);
router.post("/confirm", paymentController.confirmPayment);
router.get("/", paymentController.getPaymentHistory);
router.get("/:id", paymentController.getPaymentDetails);

export const paymentRoutes = router;