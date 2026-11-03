import { appEnv } from '../../../config/env'
import { supabase } from '../../../lib/supabase/client'
import type { InvitationTemplate } from '../types/catalog'

const demoTemplates: InvitationTemplate[] = [
  {
    id: 'demo-jardim', name: 'Casamento', slug: 'casamento',
    summary: 'Uma composição botânica, leve e intemporal.', category: 'Casamento', priceMzn: null,
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Mesa de celebração ao ar livre rodeada por flores', demo: true,
  },
  {
    id: 'demo-luz', name: 'Aniversário 18 Anos', slug: 'aniversario-18-anos',
    summary: 'Tons suaves para celebrar a chegada de uma nova etapa.', category: 'Aniversário', priceMzn: null,
    imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Decoração delicada de uma recepção festiva', demo: true,
  },
  {
    id: 'demo-festa', name: 'Lobolo', slug: 'lobolo',
    summary: 'Tradição, cor e elegância para celebrar em família.', category: 'Lobolo', priceMzn: null,
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Decoração colorida de uma festa de aniversário', demo: true,
  },
  {
    id: 'demo-formatura', name: 'Formatura', slug: 'formatura',
    summary: 'Elegância azul e dourada para celebrar uma grande conquista.', category: 'Formatura', priceMzn: null,
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Celebração de formatura em tons azuis', demo: true,
  },
  {
    id: 'demo-infantil', name: 'Aniversário Infantil', slug: 'aniversario-infantil',
    summary: 'Um convite alegre e colorido para os mais pequenos.', category: 'Infantil', priceMzn: null,
    imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Celebração infantil alegre e colorida', demo: true,
  },
]

export async function getTemplates(): Promise<{ templates: InvitationTemplate[]; demo: boolean }> {
  if (!supabase) return { templates: demoTemplates, demo: true }

  const { data, error } = await supabase
    .from('templates')
    .select('id, name, slug, summary, price_mzn, preview_image_url, categories(name)')
    .eq('is_published', true)
    .order('sort_order')

  if (error) throw error

  const templates = (data ?? []).map((row) => {
    const categoryData = row.categories as unknown as { name?: string } | null
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      summary: row.summary ?? '',
      category: categoryData?.name ?? 'Convite',
      priceMzn: row.price_mzn,
      imageUrl: row.preview_image_url ?? '',
      imageAlt: `Pré-visualização do modelo ${row.name}`,
    }
  })
  return { templates, demo: false }
}

export async function getTemplateBySlug(slug: string) {
  const result = await getTemplates()
  return result.templates.find((template) => template.slug === slug) ?? null
}

export const catalogMode = appEnv.hasSupabase ? 'live' : 'demo'
