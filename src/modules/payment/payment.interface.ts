import { Prisma } from "../../../generated/prisma/client";

export interface ICreatePaymentPayload {
  rentalOrderId: string;
}

export interface IConfirmPaymentPayload {
  transactionId: string;
}