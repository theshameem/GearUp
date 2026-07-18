import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const customerId = req.user?.id as string;

    const result = await paymentService.createCheckoutSession(customerId, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Stripe checkout session created successfully",
      data: result,
    });
  },
);

const handleWebhook = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const event = req.body as Buffer;
    const signature = req.headers["stripe-signature"]!;

    await paymentService.handleWebhook(event, signature as string);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Webhook processed successfully",
      data: null,
    });
  },
);

const confirmPayment = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const customerId = req.user?.id as string;

    const result = await paymentService.confirmPayment(customerId, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment confirmed successfully",
      data: result,
    });
  },
);

const getPaymentHistory = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user?.id as string;
    const role = req.user?.role as string;

    const payments = await paymentService.getPaymentHistory(userId, role);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment history retrieved successfully",
      data: { payments, count: payments.length },
    });
  },
);

const getPaymentDetails = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user?.id as string;
    const role = req.user?.role as string;
    const paymentId = req.params?.id as string;

    const payment = await paymentService.getPaymentDetails(paymentId, userId, role);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment details retrieved successfully",
      data: payment,
    });
  },
);

export const paymentController = {
  createCheckoutSession,
  handleWebhook,
  confirmPayment,
  getPaymentHistory,
  getPaymentDetails,
};