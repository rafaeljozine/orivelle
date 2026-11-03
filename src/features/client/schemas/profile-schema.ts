import { z } from 'zod'

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, 'Indique o seu nome.').max(120),
  phoneMz: z.string().trim().max(20, 'Máximo de 20 caracteres.').optional(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>