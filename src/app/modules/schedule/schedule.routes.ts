import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { ScheduleController } from "./schedule.controller";

const router = express.Router();

router.post("/", ScheduleController.insertIntoDB);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.DOCTOR),
  ScheduleController.scheduleForDoctor,
);
router.delete("/:id", ScheduleController.deleteScheduleFromDB);

export const scheduleRoutes = router;
