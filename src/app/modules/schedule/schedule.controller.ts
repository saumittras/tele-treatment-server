import { Request, Response } from "express";
import pick from "../../helper/pick";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../types/common";
import { scheduleSearchableFields } from "./schedule.constant";
import { ScheduleService } from "./schedule.service";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Schedules created successfully",
    data: result,
  });
});

const scheduleForDoctor = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const filters = pick(req.query, scheduleSearchableFields);
    const options = pick(req.query, ["page", "limit", "shortBy", "sortOrder"]);

    const result = await ScheduleService.scheduleForDoctor(
      filters,
      options,
      req.user as IJWTPayload,
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Schedules data retrived successfully",
      data: result,
    });
  },
);

const deleteScheduleFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.deleteScheduleFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Schedules Deleted successfully",
    data: result,
  });
});

export const ScheduleController = {
  insertIntoDB,
  scheduleForDoctor,
  deleteScheduleFromDB,
};
