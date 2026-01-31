import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { DoctorScheduleController } from "./doctorSchedule.contoller";

const router = express.Router();
router.post(
  "/",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.createDoctorSchedule,
);
export const doctorScheduleRoutes = router;
