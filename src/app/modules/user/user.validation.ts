import z from "zod";

const createPatientValidationSchema = z.object({
  password: z.string(),
  patient: z.object({
    name: z.string({ error: "Name is required" }),
    email: z.string({ error: "Email is required" }),
    address: z.string().optional(),
  }),
});

const createAdminValidationSchema = z.object({
  password: z.string(),
  admin: z.object({
    name: z.string({ error: "Name is required" }),
    email: z.string({ error: "Email is required" }),
    contactNumber: z.string({ error: "Contact NUmber is required" }),
  }),
});

const createDoctorValidationSchema = z.object({
  password: z.string(),
  doctor: z.object({
    name: z.string({ error: "Name is required" }),
    email: z.string({ error: "Email is required" }),
    contactNumber: z.string({ error: "Contact NUmber is required" }),
    address: z.string({ error: "Address is required" }),
    registrationNumber: z.string({ error: "Registration Number is required" }),
    appointmentFee: z.number({ error: "Appointment Fee is required" }),
    qualification: z.string({ error: "Qualification is required" }),
    currentWorkingPlace: z.string({
      error: "Current Working Place is required",
    }),
    designation: z.string({ error: "Designation is required" }),
  }),
});

export const UserValidation = {
  createPatientValidationSchema,
  createAdminValidationSchema,
  createDoctorValidationSchema,
};
