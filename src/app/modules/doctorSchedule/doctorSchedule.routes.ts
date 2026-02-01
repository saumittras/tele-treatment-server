import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorScheduleController } from "./doctorSchedule.contoller";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";

const router = express.Router();
router.post(
  "/",
  auth(UserRole.DOCTOR),
  validateRequest(DoctorScheduleValidation.doctorScheduleValidationSchema),
  DoctorScheduleController.createDoctorSchedule,
);
export const doctorScheduleRoutes = router;
