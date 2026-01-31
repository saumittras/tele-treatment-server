import { prisma } from "../../shared/prisma";
import { IJWTPayload } from "../types/common";

const createDoctorSchedule = async (
  user: IJWTPayload,
  payload: { scheduleIds: string[] },
) => {
  const doctorData = await prisma.doctor.findFirstOrThrow({
    where: {
      email: user.email,
    },
  });

  const scheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId: scheduleId,
  }));

  return await prisma.doctorSchedule.createMany({
    data: scheduleData,
  });
};

export const DoctorScheduleService = {
  createDoctorSchedule,
};
