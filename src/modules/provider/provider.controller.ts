import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {
  IAddGearPayload,
  IUpdateGearPayload,
  OrderStatusUpdate,
} from "./provider.interface";
import { providerService } from "./provider.service";

const addGearToInventory = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user?.id as string;

  const payload = req.body as IAddGearPayload;

  const gear = await providerService.addGearToInventory(providerId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Gear added to inventory successfully",
    data: { gear },
  });
});

const updateGearById = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user?.id as string;
  const gearId = req.params?.id as string;

  const payload = req.body as IUpdateGearPayload;

  const gear = await providerService.updateGearById(
    providerId,
    gearId,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear updated successfully",
    data: { gear },
  });
});

const deleteGearById = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user?.id as string;
  const gearId = req.params?.id as string;

  const result = await providerService.deleteGearById(providerId, gearId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear removed from inventory successfully",
    data: result,
  });
});

const getProvidersIncomingOrder = catchAsync(
  async (req: Request, res: Response) => {
    const providerId = req.user?.id as string;

    const orders = await providerService.getProvidersIncomingOrder(providerId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Incoming orders retrieved successfully",
      data: { orders, count: orders.length },
    });
  },
);

const updateRentalOrderStatusById = catchAsync(
  async (req: Request, res: Response) => {
    const providerId = req.user?.id as string;
    const orderId = req.params?.id as string;
    const { status } = req.body as { status: OrderStatusUpdate };

    const order = await providerService.updateRentalOrderStatusById(
      providerId,
      orderId,
      status,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental order status updated successfully",
      data: { order },
    });
  },
);

export const providerController = {
  addGearToInventory,
  updateGearById,
  deleteGearById,
  getProvidersIncomingOrder,
  updateRentalOrderStatusById,
};
