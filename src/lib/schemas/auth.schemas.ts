import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().min(1, "Email jest wymagany").email("Niepoprawny format emaila"),
  password: z
    .string()
    .min(8, "Hasło musi mieć co najmniej 8 znaków")
    .max(100, "Hasło nie może być dłuższe niż 100 znaków"),
  username: z
    .string()
    .min(1, "Nazwa użytkownika jest wymagana")
    .max(50, "Nazwa użytkownika nie może być dłuższa niż 50 znaków")
    .trim(),
});

export const loginSchema = z.object({
  email: z.string().min(1, "Email jest wymagany").email("Niepoprawny format emaila"),
  password: z.string().min(1, "Hasło jest wymagane"),
  rememberMe: z.boolean().optional().default(false),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email jest wymagany").email("Niepoprawny format emaila"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
