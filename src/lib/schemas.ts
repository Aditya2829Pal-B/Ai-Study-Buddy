import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});
export type LoginFormFields = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});
export type RegisterFormFields = z.infer<typeof RegisterSchema>;

export const CookieSettingsSchema = z.object({
  essential: z.boolean(),
  analytics: z.boolean(),
  marketing: z.boolean()
});
export type CookieSettings = z.infer<typeof CookieSettingsSchema>;
