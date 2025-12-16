import { z } from "zod";

export const userLoginSchema = z
  .object({
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .email("Invalid email format"),

    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .min(8, "Password must be at least 8 characters"),
  })
  .strict();

export const adminUserCreateValidator = z.object({
  name: z.string({
    required_error: "Name is Required",
    invalid_type_error: "Name must be string",
  }),

  dob: z.string({
    // change  this if there is a type change from string to Date in Schema
    required_error: "DOB is Required",
    invalid_type_error: "DOB must be string",
  }),

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

  phone: z
    .number({
      required_error: "Phone number is Required",
      invalid_type_error: "Phone must be Number",
    })
    .min(10)
    .max(10),

  address: z.string({
    required_error: "Address is Required",
    invalid_type_error: "Address must be string",
  }),

  currentWeight: z.number({
    required_error: "Weight is Required",
    invalid_type_error: "Weight must be Number",
  }),

  targetWeight: z.number({
    required_error: "Target Weight is Required",
    invalid_type_error: "Target Weight must be Number",
  }),

  medicalConditions: z
    .array({
      required_error: "Medical conditions is Required",
      invalid_type_error: "Medical conditions Must be an array",
    })
    .min(1),

  allergies: z
    .array({
      required_error: "Allergies is Required",
      invalid_type_error: "Allergies Must be an array",
    })
    .min(0),

  foodPreferances: z.string({
    required_error: "Food Preferances is Required",
    invalid_type_error: "Food Preferances Must be a string",
  }),

  duration: z.number({
    required_error:"Duration is required",
    invalid_type_error: "Duration must be number",
  }),

  programStartDate: z.date({
    required_error: "Program Start Date is Required",
    invalid_type_error: "Program Start Date must be a date",
  }),

  programEndDate: z.date({
    required_error:"Program End Date is Required",
    invalid_type_error:"Program End date is required"
  }).refine(
  (data) => data.programEndDate.getTime() !== data.programStartDate.getTime(),
  {
    message: "Program end date cannot be same as start date",
    path: ["programEndDate"], 
  }
),


});
