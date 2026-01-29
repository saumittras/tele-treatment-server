import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { IOptions, paginationHelpers } from "../../helper/paginationHelpers";
import { prsima } from "../../shared/prisma";
import { userSearchableFields } from "./user.constant";

const createPatient = async (req: Request) => {
  if (req.file) {
    const result = await fileUploader.uploadFileToCloudinary(req.file);
    console.log("Cloudinary upload result:", result);
    req.body.patient.profilePhoto = result?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const result = await prsima.$transaction(async (tnx) => {
    const userResult = await tnx.user.create({
      data: {
        email: req.body.patient.email,
        password: hashedPassword,
      },
    });

    const patientResult = await tnx.patient.create({
      data: req.body.patient,
    });
    return { user: userResult, patient: patientResult };
  });

  return result;
};

const createAdmin = async (req: Request) => {
  if (req.file) {
    const result = await fileUploader.uploadFileToCloudinary(req.file);
    console.log("Cloudinary upload result:", result);
    req.body.admin.profilePhoto = result?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const result = await prsima.$transaction(async (tnx) => {
    const userResult = await tnx.user.create({
      data: {
        email: req.body.admin.email,
        password: hashedPassword,
      },
    });

    const adminResult = await tnx.admin.create({
      data: req.body.admin,
    });
    return { user: userResult, admin: adminResult };
  });

  return result;
};

const createDoctor = async (req: Request) => {
  if (req.file) {
    const result = await fileUploader.uploadFileToCloudinary(req.file);
    console.log("Cloudinary upload result:", result);
    req.body.doctor.profilePhoto = result?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const result = await prsima.$transaction(async (tnx) => {
    const userResult = await tnx.user.create({
      data: {
        email: req.body.doctor.email,
        password: hashedPassword,
      },
    });

    const patientResult = await tnx.doctor.create({
      data: req.body.doctor,
    });
    return { user: userResult, patient: patientResult };
  });

  return result;
};

const getAllFromDB = async (params: any, options: IOptions) => {
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: { equals: (filterData as any)[key] },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const result = await prsima.user.findMany({
    skip,
    take: limit,

    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prsima.user.count({
    where: whereConditions,
  });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

export const UserService = {
  createPatient,
  createAdmin,
  createDoctor,
  getAllFromDB,
};
