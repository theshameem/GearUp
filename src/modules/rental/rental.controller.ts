import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const createRental = catchAsync(async (req: Request, res: Response) => {});

const getUserRentals = catchAsync(async (req: Request, res: Response) => {});

const getRentalById = catchAsync(async (req: Request, res: Response) => {});

export const rentalController = {
  createRental,
  getUserRentals,
  getRentalById,
};
