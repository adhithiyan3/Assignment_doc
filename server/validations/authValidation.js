const { z } = require("zod");

const registerSchema = z.object({
  firstname: z.string().min(2, "Firstname too short"),
  lastname: z.string().min(2, "Lastname too short"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]).optional()
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

module.exports = { registerSchema, loginSchema };
