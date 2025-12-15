const { z } = require("zod");

const userLoginSchema = z
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

    role: z.string({
        required_error:""
    })
  })
  .strict();

module.exports = { loginSchema };
