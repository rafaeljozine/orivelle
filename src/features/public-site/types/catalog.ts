import type { EntityId } from '../../../types/common'

export type InvitationTemplate = {
  id: EntityId
  name: string
  slug: string
  summary: string
  category: string
  priceMzn: number | null
  imageUrl: string
  imageAlt: string
  demo?: boolean
}