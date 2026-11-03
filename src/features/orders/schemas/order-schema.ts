import { z } from 'zod'
import { getTodayIso, isValidIsoDate } from '../../../lib/format'

export const orderSchema = z.object({
  eventName: z.string().trim().min(2, 'Indique o nome da celebração.').max(120),
  eventType: z.enum(['casamento', 'aniversario', 'noivado', 'cha', 'outro'], { error: 'Escolha o tipo de celebração.' }),
  eventDate: z.string().min(1, 'Indique a data da celebração.').refine((value) => {
    return isValidIsoDate(value) && value >= getTodayIso()
  }, 'A data deve ser hoje ou posterior.'),
  guestEstimate: z.coerce.number().int().min(1, 'Indique pelo menos um convidado.').max(10000),
  location: z.string().trim().max(180, 'Máximo de 180 caracteres.').optional(),
  details: z.string().trim().max(1500, 'Máximo de 1.500 caracteres.').optional(),
  templateId: z.string().uuid().optional().or(z.literal('')),
})

export type OrderFormInput = z.input<typeof orderSchema>
export type OrderFormValues = z.infer<typeof orderSchema>
