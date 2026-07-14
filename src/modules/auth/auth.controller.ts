import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  console.log("indise gerre");

  const user = await authService.registerUserIntoDB(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: { user },
  });
});

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const myDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const authController = {
  loginUser,
  myDetails,
  registerUser,
};
