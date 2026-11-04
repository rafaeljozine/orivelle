import { useQuery } from '@tanstack/react-query'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { TemplatePreviewImage } from '../../components/TemplatePreviewImage'
import { getTemplates } from '../../services/catalog-service'

const categoryDescriptions: Record<string, string> = {
  Casamento: 'Elegância e delicadeza para celebrar uma história a dois.',
  Aniversário: 'Composições cheias de personalidade para uma nova etapa.',
  Noivado: 'Um anúncio especial para o início de uma grande promessa.',
  Baptizado: 'Uma apresentação serena para um momento de fé e família.',
  Corporativo: 'Convites distintos para encontros e celebrações profissionais.',
  Lobolo: 'Tradição e sofisticação para celebrar com toda a família.',
  Formatura: 'Uma conquista marcante apresentada com elegância.',
  Infantil: 'Cor e alegria para celebrar os mais pequenos.',
}

export function OccasionGallery() {
  const { data, isLoading, isError } = useQuery({ queryKey: ['templates'], queryFn: getTemplates })
  const occasions = Array.from(new Map((data?.templates ?? []).map((template) => [template.category, template])).values()).slice(0, 5)

  return (
    <section className="occasions-section home-section" aria-labelledby="occasions-title">
      <div className="home-section-heading occasions-heading"><div><span className="home-eyebrow">Uma colecção para descobrir</span><h2 id="occasions-title">Um convite para<br /><em>cada ocasião.</em></h2></div><p>Explore categorias construídas a partir dos modelos disponíveis no nosso catálogo.</p></div>
      {isLoading && <div className="home-section-state" role="status">A preparar as ocasiões…</div>}
      {isError && <div className="home-section-state" role="alert">Não foi possível carregar as ocasiões de momento.</div>}
      {!isLoading && !isError && occasions.length > 0 && <div className="occasions-grid">{occasions.map((template, index) => <Link className={`occasion-card occasion-card-${index + 1}`} to={`/modelos?categoria=${encodeURIComponent(template.category)}`} key={template.category}><TemplatePreviewImage src={template.imageUrl} alt={template.imageAlt} /><span className="occasion-shade" /><span className="occasion-index">0{index + 1}</span><div className="occasion-copy"><small>{template.category}</small><h3>{template.name}</h3><p>{categoryDescriptions[template.category] ?? template.summary}</p></div><span className="occasion-link" aria-hidden="true"><ArrowUpRight size={18} /></span></Link>)}</div>}
      {!isLoading && !isError && occasions.length === 0 && <div className="home-section-state">As categorias serão apresentadas assim que existirem modelos publicados.</div>}
    </section>
  )
}
