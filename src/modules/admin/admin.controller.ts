import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {});

const updateUserById = catchAsync(async (req: Request, res: Response) => {});

const getGearList = catchAsync(async (req: Request, res: Response) => {});

const getRentalList = catchAsync(async (req: Request, res: Response) => {});

export const adminController = {
  getAllUsers,
  updateUserById,
  getGearList,
  getRentalList,
};
