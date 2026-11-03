import type { User } from '@supabase/supabase-js'
import { supabase } from '../../../lib/supabase/client'
import type { OrderFormValues } from '../schemas/order-schema'

export async function createOrder(values: OrderFormValues, user: User) {
  if (!supabase) throw new Error('O serviço de pedidos ainda não está configurado.')
  const { data, error } = await supabase.from('orders').insert({
    customer_id: user.id,
    template_id: values.templateId || null,
    event_name: values.eventName,
    event_type: values.eventType,
    event_date: values.eventDate,
    guest_estimate: values.guestEstimate,
    event_location: values.location || null,
    brief: values.details || null,
    status: 'submitted',
  }).select('id').single()

  if (error) throw error
  return data.id as string
}