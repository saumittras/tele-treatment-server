import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { authService } from "./auth.service";

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  const { accessToken, refressToken } = result;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.cookie("refressToken", refressToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User loggedin successfully",
    data: result,
  });
});

export const authController = {
  login,
};
