import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import {
  UserRole,
  UserStatus,
} from "../../../generated/prisma/client";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";

const asString = (value: unknown): string | undefined => {
  if (typeof value !== "string" || value.length === 0) return undefined;
  return value;
};

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await adminService.getAllUsers();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: { users, count: users.length },
  });
});

const updateUserById = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const id = asString(req.params.id);
    if (!id) {
      throw new Error("User id is required");
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    const payload: { status?: UserStatus; role?: UserRole } = {};

    const status = asString(body.status);
    if (status && Object.values(UserStatus).includes(status as UserStatus)) {
      payload.status = status as UserStatus;
    }

    const role = asString(body.role);
    if (role && Object.values(UserRole).includes(role as UserRole)) {
      payload.role = role as UserRole;
    }

    if (payload.status === undefined && payload.role === undefined) {
      throw new Error("Provide at least one of 'status' or 'role' to update");
    }

    const user = await adminService.updateUserById(id, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User updated successfully",
      data: { user },
    });
  },
);

const getGearList = catchAsync(async (req: Request, res: Response) => {
  const items = await adminService.getGearList();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear items retrieved successfully",
    data: { items, count: items.length },
  });
});

const getRentalList = catchAsync(async (req: Request, res: Response) => {
  const rentals = await adminService.getRentalList();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental orders retrieved successfully",
    data: { rentals, count: rentals.length },
  });
});

export const adminController = {
  getAllUsers,
  updateUserById,
  getGearList,
  getRentalList,
};