import { UserRole } from "@prisma/client";
import * as z from "zod";

export const CredentialSigninSchema = z.object({
  email: z.string().email({ message: "Email is required." }),
  password: z.string().min(1, { message: "Password is required" }), // no need to limit the length here, should be  in register
  code: z.optional(z.string()),
});

export const EmailSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z
    .string()
    .min(6, {
      message: "Minimum 6 characters required",
    })
    .max(50, "password is too long!"),
  name: z
    .string()
    .min(1, {
      message: "Name is required",
    })
    .max(50, "Name is too long!"),
});

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6)),
});
// .refine(
//   (data) => {
//     if (data.password && !data.newPassword) return false;
//     if (data.newPassword && !data.password) return false;

//     return true;
//   },
//   {
//     message: "New password is required.",
//     path: ["newPassword"],
//   }
// );

export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Minimum 6 characters required." })
    .max(50, "password is too long!"),
});

export const ResetSchema = z.object({
  email: z.string().email({ message: "Email is required." }),
});
