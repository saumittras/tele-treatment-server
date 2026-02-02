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
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const { specialties, ...doctorData } = payload;

  console.log(specialties, doctorData, id);

  return await prisma.$transaction(async (tnx) => {
    if (specialties && specialties.length > 0) {
      const deleteSpecialtyIds = specialties.filter(
        (specialty) => specialty.isDeleted == true,
      );

      console.log("deleteSpecialtyIds", deleteSpecialtyIds);

      for (const specialty of deleteSpecialtyIds) {
        await tnx.doctorSpecialties.deleteMany({
          where: {
            doctorId: id,
            specialitiesId: specialty.specialtyId,
          },
        });
      }

      const createSpecialtyIds = specialties.filter(
        (specialty) => specialty.isDeleted == false,
      );

      console.log("createSpecialtyIds", createSpecialtyIds);

      for (const specialty of createSpecialtyIds) {
        await tnx.doctorSpecialties.create({
          data: {
            doctorId: id,
            specialitiesId: specialty.specialtyId,
          },
        });
      }
    }

    const updatedData = await tnx.doctor.update({
      where: {
        id: doctorInfo.id,
      },
      data: doctorData,
      include: {
        doctorSpecialties: {
          include: {
            specialities: true,
          },
        },
      },

      //  doctor - doctorSpecailties - specialities
    });

    return updatedData;
  });
};

export const DoctorService = { getAllFromDB, updateIntoDB };
