import { z } from 'zod'

export const authSchema = z.object({
  name: z.string().trim().optional(),
  email: z.email('Introduza um endereço de email válido.').optional(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).superRefine((values, context) => {
  if (values.confirmPassword !== undefined && values.confirmPassword !== values.password) {
    context.addIssue({ code: 'custom', path: ['confirmPassword'], message: 'As palavras-passe não coincidem.' })
  }
})

export type AuthFormValues = z.infer<typeof authSchema>