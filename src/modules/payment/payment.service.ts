import {
  PaymentMethod,
  PaymentStatus,
  Prisma,
  RentalStatus,
} from "../../../generated/prisma/client";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { IConfirmPaymentPayload } from "./payment.interface";

const createCheckoutSession = async (
  customerId: string,
  payload: { rentalOrderId: string },
) => {
  const rental = await prisma.rentalOrder.findUniqueOrThrow({
    where: { id: payload.rentalOrderId },
  });

  if (rental.customerId !== customerId) {
    throw new Error("You are not authorized to pay for this rental order");
  }

  if (
    rental.status !== RentalStatus.PLACED &&
    rental.status !== RentalStatus.CONFIRMED
  ) {
    throw new Error(
      `Cannot create payment for rental order in status ${rental.status}`,
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Rental Order ${rental.orderNumber}`,
            description: `Payment for rental order ${rental.orderNumber}`,
          },
          unit_amount: Math.round(Number(rental.totalAmount) * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${config.app_url}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.app_url}/payments/cancel`,
    metadata: {
      rentalOrderId: rental.id,
      customerId: rental.customerId,
    },
  });

  const payment = await prisma.payment.create({
    data: {
      rentalOrderId: rental.id,
      transactionId: session.id,
      amount: rental.totalAmount,
      paymentMethod: PaymentMethod.STRIPE,
      providerReference: session.id,
      status: PaymentStatus.PENDING,
    },
  });

  return {
    paymentUrl: session.url,
    sessionId: session.id,
    payment,
  };
};

const handleCheckoutCompleted = async (
  session: import("stripe").Stripe.Checkout.Session,
) => {
  const rentalOrderId = session.metadata?.rentalOrderId;

  if (!rentalOrderId) {
    console.log("Webhook: missing rentalOrderId in metadata");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.updateMany({
      where: { transactionId: session.id },
      data: {
        status: PaymentStatus.COMPLETED,
        paidAt: new Date(),
      },
    });

    await tx.rentalOrder.update({
      where: { id: rentalOrderId },
      data: { status: RentalStatus.PAID },
    });
  });
};

const handleCheckoutFailed = async (
  session: import("stripe").Stripe.Checkout.Session,
) => {
  await prisma.payment.updateMany({
    where: { transactionId: session.id },
    data: { status: PaymentStatus.FAILED },
  });
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret as string,
  );

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);
      break;
    case "checkout.session.async_payment_failed":
    case "checkout.session.expired":
      await handleCheckoutFailed(event.data.object);
      break;
    default:
      console.log(`No handler for event type ${event.type}`);
      break;
  }
};

const confirmPayment = async (
  customerId: string,
  payload: IConfirmPaymentPayload,
) => {
  const payment = await prisma.payment.findUniqueOrThrow({
    where: { transactionId: payload.transactionId },
    include: { rentalOrder: true },
  });

  if (payment.rentalOrder.customerId !== customerId) {
    throw new Error("You are not authorized to confirm this payment");
  }

  if (payment.status === PaymentStatus.COMPLETED) {
    return payment;
  }

  const session = await stripe.checkout.sessions.retrieve(
    payload.transactionId,
  );

  if (session.payment_status === "paid") {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.COMPLETED,
          paidAt: new Date(),
        },
      });

      await tx.rentalOrder.update({
        where: { id: payment.rentalOrderId },
        data: { status: RentalStatus.PAID },
      });

      return updated;
    });
  }

  return payment;
};

const getPaymentHistory = async (userId: string, role: string) => {
  const where: Prisma.PaymentWhereInput =
    role === "ADMIN" ? {} : { rentalOrder: { customerId: userId } };

  return prisma.payment.findMany({
    where,
    include: {
      rentalOrder: {
        select: {
          id: true,
          orderNumber: true,
          totalAmount: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getPaymentDetails = async (
  paymentId: string,
  userId: string,
  role: string,
) => {
  const payment = await prisma.payment.findUniqueOrThrow({
    where: { id: paymentId },
    include: {
      rentalOrder: {
        include: {
          customer: {
            select: { id: true, name: true, email: true },
          },
          items: {
            include: {
              gearItem: {
                select: { id: true, name: true, brand: true, imageUrl: true },
              },
            },
          },
        },
      },
    },
  });

  if (role !== "ADMIN" && payment.rentalOrder.customer.id !== userId) {
    throw new Error("You are not authorized to view this payment");
  }

  return payment;
};

export const paymentService = {
  createCheckoutSession,
  handleWebhook,
  confirmPayment,
  getPaymentHistory,
  getPaymentDetails,
};