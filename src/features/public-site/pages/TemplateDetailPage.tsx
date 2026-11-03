import { ArrowLeft, ArrowRight, Check, MoveUpRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import { getTemplateBySlug } from '../services/catalog-service'
import { DemoNotice } from '../components/DemoNotice'
import { TemplatePreviewImage } from '../components/TemplatePreviewImage'

export function TemplateDetailPage() {
  const { slug = '' } = useParams()
  const { data, isLoading, isError } = useQuery({ queryKey: ['template', slug], queryFn: () => getTemplateBySlug(slug) })
  if (isLoading) return <div className="page-loading" role="status">A carregar modelo…</div>
  if (isError) return <div className="catalog-empty" role="alert"><h1>Não foi possível carregar este modelo.</h1><Link className="text-link" to="/modelos"><ArrowLeft size={15} /> Voltar aos modelos</Link></div>
  if (!data) return <div className="catalog-empty"><h1>Este modelo não está disponível.</h1><Link className="text-link" to="/modelos"><ArrowLeft size={15} /> Voltar aos modelos</Link></div>

  return <div className="template-detail page-shell"><Link className="back-link" to="/modelos"><ArrowLeft size={15} /> Todos os modelos</Link>{data.demo && <DemoNotice />}<div className="detail-layout"><div className="detail-image"><TemplatePreviewImage src={data.imageUrl} alt={data.imageAlt} loading="eager" /><span>{data.category}</span></div><div className="detail-copy"><span className="eyebrow">Uma ideia para celebrar</span><h1>{data.name}<em>.</em></h1><p>{data.summary} Esta referência é um ponto de partida; cada convite é criado e finalizado pela nossa equipa.</p><ul>{['Design preparado pela nossa equipa', 'Detalhes adaptados à sua celebração', 'Um link para partilhar com os convidados'].map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul><Link className="button button-dark" to="/contactos">Conversar sobre uma ideia <MoveUpRight size={15} /></Link>{data.demo && <span className="detail-note">Amostra demonstrativa. Não disponível para encomenda.</span>}</div></div><div className="detail-next"><span className="eyebrow">O processo é simples</span><Link to="/como-funciona">Veja como criamos o seu convite <ArrowRight size={15} /></Link></div></div>
}
