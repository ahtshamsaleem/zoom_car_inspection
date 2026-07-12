import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["manager", "inspector"]).default("inspector"),
});

export const customerSchema = z.object({
  name: z.string().min(2, "Customer name is required"),
  mobile: z.string().min(8, "Valid mobile number is required"),
  email: z.string().email().optional().or(z.literal("")),
  emiratesId: z.string().optional(),
});

export const vehicleSchema = z.object({
  vin: z.string().optional(),
  plateNumber: z.string().min(2, "Plate number is required"),
  make: z.string().optional(),
  model: z.string().optional(),
  trim: z.string().optional(),
  year: z.coerce.number().min(1900).max(2030).optional(),
  mileage: z.coerce.number().min(0).optional(),
  engineSize: z.string().optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  color: z.string().optional(),
  chassisNumber: z.string().optional(),
});





export const employeeSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  role: z.enum(["manager", "inspector"]),
  password: z.string().min(6).optional(),
});


export const updateEmployeeSchema = z.object({
  fullName: z.string().min(2, "Name is required").optional(),
  phone: z.string().optional(),
  role: z.enum(["manager", "inspector"]).optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  isActive: z.boolean().optional(),
});





export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.input<typeof signupSchema>;
export type CustomerFormValues = z.infer<typeof customerSchema>;
export type VehicleFormValues = z.input<typeof vehicleSchema>;

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
export type UpdateEmployeeFormValues = z.infer<typeof updateEmployeeSchema>;

