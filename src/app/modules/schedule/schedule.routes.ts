import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { ScheduleController } from "./schedule.controller";

const router = express.Router();

router.post("/", auth(UserRole.ADMIN), ScheduleController.insertIntoDB);

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.DOCTOR),
  ScheduleController.scheduleForDoctor,
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  ScheduleController.deleteScheduleFromDB,
);

export const scheduleRoutes = router;
