import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email est requis')
    .email('Email invalide'),
  password: z
    .string()
    .min(1, 'Mot de passe est requis')
    .min(6, 'Mot de passe doit contenir au moins 6 caractères'),
  role: z.enum(['PATIENT', 'DOCTOR', 'HOSPITAL_ADMIN']),
})

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Prénom est requis')
    .max(50, 'Prénom trop long'),
  lastName: z
    .string()
    .min(1, 'Nom est requis')
    .max(50, 'Nom trop long'),
  email: z
    .string()
    .min(1, 'Email est requis')
    .email('Email invalide'),
  phone: z
    .string()
    .min(1, 'Téléphone est requis')
    .regex(/^\+?[\d\s-]{8,}$/, 'Numéro de téléphone invalide'),
  password: z
    .string()
    .min(1, 'Mot de passe est requis')
    .min(8, 'Mot de passe doit contenir au moins 8 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Doit contenir majuscule, minuscule et chiffre'
    ),
  role: z.enum(['PATIENT', 'DOCTOR', 'HOSPITAL_ADMIN']),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
