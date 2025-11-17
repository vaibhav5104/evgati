const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  phone: z.number().min(10, "Phone must be at least 10 characters long"),
  role: z.enum(["user", "admin"]).optional(), // optional, defaults in model
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const googleLoginSchema = z.object({
  credential: z.string().min(1, "Google credential is required"),
});

module.exports = { registerSchema, loginSchema, googleLoginSchema };
