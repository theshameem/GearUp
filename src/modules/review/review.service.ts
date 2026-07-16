import { RentalStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload } from "./review.interface";

const createReviewIntoDb = async (
  customerId: string,
  payload: ICreateReviewPayload,
) => {
  const rentalOrder = await prisma.rentalOrder.findUniqueOrThrow({
    where: { id: payload.rentalOrderId },
    include: {
      items: {
        where: { gearItemId: payload.gearItemId },
      },
    },
  });

  if (rentalOrder.status !== RentalStatus.RETURNED) {
    throw new Error(
      "You can only leave a review after the rental order is returned",
    );
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      customerId,
      rentalOrderId: payload.rentalOrderId,
      gearItemId: payload.gearItemId,
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this gear from this rental");
  }

  return prisma.review.create({
    data: {
      customerId,
      gearItemId: payload.gearItemId,
      rentalOrderId: payload.rentalOrderId,
      rating: payload.rating,
      comment: payload.comment,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      gearItem: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const reviewService = {
  createReviewIntoDb,
};
