import { UserRole } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { fileUploader } from "../../helper/fileUploader";
import auth from "../../middlewares/auth";
import { SpecialtiesController } from "./specialties.controller";
import { SpecialtiesValidtaion } from "./specialties.validation";

const router = express.Router();

router.get("/", SpecialtiesController.getAllFromDB);

router.post(
  "/",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesValidtaion.create.parse(JSON.parse(req.body.data));
    return SpecialtiesController.inserIntoDB(req, res, next);
  },
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.ADMIN),
  SpecialtiesController.deleteFromDB,
);

export const SpecialtiesRoutes = router;
