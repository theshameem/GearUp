import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ICreateReviewPayload } from "./review.interface";
import { reviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;

  const { rentalOrderId, gearItemId, rating, comment } = req.body;

  const payload: ICreateReviewPayload = {
    rentalOrderId,
    gearItemId,
    rating,
    comment,
  };

  const review = await reviewService.createReviewIntoDb(customerId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review created successfully",
    data: { review },
  });
});

export const reviewController = {
  createReview,
};
