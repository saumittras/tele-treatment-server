import z from "zod";

const doctorScheduleValidationSchema = z.object({
  body: z.object({
    scheduleIds: z.array(z.string()),
  }),
});

export const DoctorScheduleValidation = {
  doctorScheduleValidationSchema,
};
