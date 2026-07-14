import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IGearFilters } from "./gear.interface";
import { gearService } from "./gear.service";

const getGearList = catchAsync(async (req: Request, res: Response) => {
  const filters = parseFilters(req.query);

  const result = await gearService.getGearList(filters);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear items retrieved successfully",
    data: { result, count: result.length },
  });
});

const getGearDetailsById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await gearService.getGearDetailsById(id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear item details retrieved successfully",
    data: { result },
  });
});

const getGearCategoryList = catchAsync(async (req: Request, res: Response) => {
  const result = await gearService.getGearCategoryList();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories retrieved successfully",
    data: { result, count: result.length },
  });
});

const parseFilters = (query: Request["query"]): IGearFilters => {
  const filters: IGearFilters = {};

  if (typeof query.searchTerm === "string" && query.searchTerm.length > 0) {
    filters.searchTerm = query.searchTerm;
  }

  if (typeof query.categoryId === "string" && query.categoryId.length > 0) {
    filters.categoryId = query.categoryId;
  }

  if (typeof query.brand === "string" && query.brand.length > 0) {
    filters.brand = query.brand;
  }

  if (typeof query.minPrice === "string") {
    const value = Number(query.minPrice);
    if (!Number.isNaN(value)) filters.minPrice = value;
  }

  if (typeof query.maxPrice === "string") {
    const value = Number(query.maxPrice);
    if (!Number.isNaN(value)) filters.maxPrice = value;
  }

  if (typeof query.availableOnly === "string") {
    filters.availableOnly = query.availableOnly === "true";
  }

  if (typeof query.isActive === "string") {
    filters.isActive = query.isActive === "true";
  }

  return filters;
};

export const gearController = {
  getGearList,
  getGearDetailsById,
  getGearCategoryList,
};
