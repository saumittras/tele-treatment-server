import { Prisma } from "@prisma/client";
import { IOptions, paginationHelpers } from "../../helper/paginationHelpers";
import { prisma } from "../../shared/prisma";
import { doctorSearchableFields } from "./doctor.constants";
import { IDoctorUpdateInput } from "./doctor.interface";

const getAllFromDB = async (filters: any, option: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(option);
  const { searchTerm, specialties, ...filterData } = filters;

  const andConditiond: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditiond.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));

    andConditiond.push(...filterConditions);
  }

  const whereConditions: Prisma.DoctorWhereInput =
    andConditiond.length > 0 ? { AND: andConditiond } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.doctor.count({ where: whereConditions });

  return {
    meta: { total, page, limit },
    data: result,
  };
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IDoctorUpdateInput>,
) => {
  const isDataExist = await prisma.doctor.findUniqueOrThrow({ where: { id } });
  const { specialties, ...doctorData } = payload;

  if (specialties && specialties.length > 0) {
  }

  const updatedData = await prisma.doctor.update({
    where: { id: isDataExist.id },
    data: doctorData,
  });

  return updatedData;
};

export const DoctorService = { getAllFromDB, updateIntoDB };
