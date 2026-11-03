import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { getTemplates } from '../../services/catalog-service'
import { DemoNotice } from '../../components/DemoNotice'
import { TemplatePreviewImage } from '../../components/TemplatePreviewImage'

type CatalogHighlightsProps = { limit?: number; variant?: 'default' | 'showcase' }

export function CatalogHighlights({ limit = 3, variant = 'default' }: CatalogHighlightsProps) {
  const { data, isLoading, isError } = useQuery({ queryKey: ['templates'], queryFn: getTemplates })
  const templates = data?.templates.slice(0, limit) ?? []

  if (isLoading) return <div className="section-wrap catalog-state" role="status">A preparar o mostruário…</div>
  if (isError) return <div className="section-wrap catalog-state" role="alert">Não foi possível carregar o mostruário de momento.</div>

  return (
    <>
      {data?.demo && variant === 'default' && <DemoNotice />}
      <div className={`section-wrap template-grid ${variant === 'showcase' ? 'template-grid-showcase' : ''}`}>
        {templates.map((template, index) => (
          <Link className={`template-card template-card-${index + 1}`} to={`/modelos/${template.slug}`} key={template.id}>
            <div className="template-image-wrap"><TemplatePreviewImage src={template.imageUrl} alt={template.imageAlt} /><span className="template-number">0{index + 1}</span><span className="template-arrow"><ArrowUpRight size={17} /></span></div>
            <div className="template-meta"><div><span className="template-category">{template.category}</span><h3>{template.name}</h3></div><p>{template.summary}</p></div>
          </Link>
        ))}
        {templates.length === 0 && <div className="empty-catalog"><span className="eyebrow">Estamos a preparar novidades</span><p>O catálogo ainda não tem modelos publicados.</p><Link className="text-link" to="/contactos">Fale connosco sobre a sua ideia <ArrowUpRight size={15} /></Link></div>}
      </div>
    </>
  )
}
