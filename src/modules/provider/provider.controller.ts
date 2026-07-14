import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const addGearToInventory = catchAsync(
  async (req: Request, res: Response) => {},
);

const updateGearById = catchAsync(async (req: Request, res: Response) => {});

const deleteGearById = catchAsync(async (req: Request, res: Response) => {});

const getProvidersIncomingOrder = catchAsync(
  async (req: Request, res: Response) => {},
);

const updateRentalOrderStatusById = catchAsync(
  async (req: Request, res: Response) => {},
);

export const providerController = {
  addGearToInventory,
  updateGearById,
  deleteGearById,
  getProvidersIncomingOrder,
  updateRentalOrderStatusById,
};
