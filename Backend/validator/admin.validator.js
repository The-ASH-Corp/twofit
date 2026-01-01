import z from "zod";

export const adminValidationSchema = z.object({
  fullname: z.string({
    required_error: "Fullname is required",
    invalid_type_error: "Fullname must be a string",
  }),
  dob: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, "DOB must be DD-MM-YYYY"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
    invalid_type_error: "Gender must be a string",
  }),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email format"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  address: z.string({
    required_error: "Address is Required",
    invalid_type_error: "Address must be string",
  }),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(8, "Password must be at least 8 characters"),
  specialisation: z.array(z.string(), {
    required_error: "Specialisation is Required",
    invalid_type_error: "Specialisation must be string",
  }),
  program: z.string({
    required_error: "Program is Required",
    invalid_type_error: "Program must be string",
  }),
});
