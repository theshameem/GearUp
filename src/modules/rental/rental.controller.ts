import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ICreateRentalPayload } from "./rental.interface";
import { rentalService } from "./rental.service";

const createRental = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;

  const {
    gearItemId,
    quantity,
    rentalStartDate,
    rentalEndDate,
    pickupAddress,
  } = req.body;

  const payload: ICreateRentalPayload = {
    gearItemId,
    quantity,
    rentalStartDate,
    rentalEndDate,
    pickupAddress,
  };

  const rental = await rentalService.createRentalIntoDb(customerId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rental order placed successfully",
    data: { rental },
  });
});

const getUserRentals = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;

  const rentals = await rentalService.getUserRentals(customerId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental orders retrieved successfully",
    data: { rentals, count: rentals.length },
  });
});

const getRentalById = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;
  const rentalId = req.params?.id as string;

  const rental = await rentalService.getRentalsById(customerId, rentalId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental order retrieved successfully",
    data: { rental },
  });
});

export const rentalController = {
  createRental,
  getUserRentals,
  getRentalById,
};
