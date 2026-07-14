import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const getGearList = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const getGearDetailsById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const getGearCategoryList = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const gearController = {
  getGearList,
  getGearDetailsById,
  getGearCategoryList,
};
