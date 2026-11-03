import { ArrowRight, Flower2, SlidersHorizontal } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { DemoNotice } from '../components/DemoNotice'
import { TemplatePreviewImage } from '../components/TemplatePreviewImage'
import { getTemplates } from '../services/catalog-service'

export function CatalogPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ['templates'], queryFn: getTemplates })
  const [category, setCategory] = useState('Todos')
  const categories = ['Todos', ...new Set(data?.templates.map((item) => item.category) ?? [])]
  const templates = useMemo(() => data?.templates.filter((item) => category === 'Todos' || item.category === category) ?? [], [data, category])

  return (
    <div className="page-shell catalog-page">
      <section className="page-heading"><span className="eyebrow">Modelos de convite</span><h1>Um ponto de partida<br /><em>para a vossa história.</em></h1><p>Conheça algumas direcções visuais e imagine o que podemos criar em conjunto.</p></section>
      {data?.demo && <DemoNotice />}
      <div className="catalog-toolbar"><span className="results-count">{data?.demo ? 'Referências visuais' : `${templates.length} ${templates.length === 1 ? 'modelo' : 'modelos'}`}</span><div className="filter-controls"><SlidersHorizontal size={15} /><span>Categoria</span>{categories.map((item) => <button key={item} className={`filter-chip ${category === item ? 'selected' : ''}`} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}</div></div>
      {isLoading ? <div className="catalog-state" role="status">A carregar modelos…</div> : null}
      {isError ? <div className="catalog-state" role="alert">Não foi possível carregar o catálogo. Tente novamente mais tarde.</div> : null}
      {!isLoading && !isError && templates.length > 0 && <div className="catalog-grid">{templates.map((template, index) => <Link className="template-card" to={`/modelos/${template.slug}`} key={template.id}><div className="template-image-wrap"><TemplatePreviewImage src={template.imageUrl} alt={template.imageAlt} /><span className="template-number">0{index + 1}</span><span className="template-arrow"><ArrowRight size={16} /></span></div><div className="template-meta"><div><span className="template-category">{template.category}</span><h2>{template.name}</h2></div><p>{template.summary}</p></div></Link>)}</div>}
      {!isLoading && !isError && templates.length === 0 && <div className="catalog-empty"><Flower2 className="empty-flower" size={28} aria-hidden="true" /><h2>Novas ideias a caminho.</h2><p>Estamos a preparar modelos para partilhar consigo.</p><Link className="text-link" to="/contactos">Conte-nos o que procura <ArrowRight size={15} /></Link></div>}
    </div>
  )
}
