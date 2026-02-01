import { Request, Response } from "express";
import pick from "../../helper/pick";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { doctorFilterableFields } from "./doctor.constants";
import { DoctorService } from "./doctor.service";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, doctorFilterableFields);
  const options = pick(req.query, ["page", "limit", "shortBy", "sortOrder"]);
  const result = await DoctorService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Schedules created successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const updatedData = await DoctorService.updateIntoDB(id, payload);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor Data updated successfully",

    data: updatedData,
  });
});

export const DoctorController = { getAllFromDB, updateIntoDB };
