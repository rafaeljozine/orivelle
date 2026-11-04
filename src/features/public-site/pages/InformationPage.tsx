import { ArrowRight, Check, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router'

type InformationPageProps = { page: 'precos' | 'como-funciona' | 'sobre' | 'contactos' }

const content = {
  precos: {
    eyebrow: 'Preços claros, conversa aberta',
    title: <>Cada celebração tem<br /><em>o seu próprio valor.</em></>,
    intro: 'O preço depende dos detalhes do convite, das funcionalidades pretendidas e do número de convidados. Partilhamos uma proposta clara antes de começar.',
  },
  'como-funciona': {
    eyebrow: 'Um processo acompanhado',
    title: <>Da primeira ideia<br />à <em>grande partilha.</em></>,
    intro: 'Trabalhamos consigo em cada etapa. A equipa Orivelle cria o convite, apresenta uma versão para aprovação e só publica depois da sua confirmação.',
  },
  sobre: {
    eyebrow: 'Criado com intenção',
    title: <>Detalhes que contam.<br /><em>Momentos que ficam.</em></>,
    intro: 'A Orivelle é um serviço de criação personalizada de convites digitais. A nossa equipa transforma as informações da sua celebração numa experiência simples e cuidada para os convidados.',
  },
  contactos: {
    eyebrow: 'Vamos conversar',
    title: <>Conte-nos sobre<br /><em>o vosso momento.</em></>,
    intro: 'Partilhe a sua ideia, a data e o tipo de celebração. A nossa equipa entrará em contacto para perceber como podemos ajudar.',
  },
}

export function InformationPage({ page }: InformationPageProps) {
  const item = content[page]

  return (
    <div className={`info-page page-shell info-${page}`}>
      <div className="info-heading"><span className="eyebrow">{item.eyebrow}</span><h1>{item.title}</h1><p>{item.intro}</p></div>
      {page === 'como-funciona' && <div className="steps-grid">{[
        ['01', 'Conte-nos a ideia', 'Partilhe o tipo de celebração, a data e o que gostaria de incluir.'],
        ['02', 'A equipa cria', 'Preparamos uma proposta visual personalizada e partilhamos para revisão.'],
        ['03', 'Aprove e partilhe', 'Depois da sua aprovação, publicamos o convite e entregamos o link.'],
      ].map(([number, title, body]) => <article className="step-item" key={number}><span>{number}</span><h2>{title}</h2><p>{body}</p></article>)}</div>}
      {page === 'precos' && <div className="price-note"><span className="price-note-icon"><Check size={18} /></span><div><h2>Uma proposta feita para o seu pedido</h2><p>Receberá uma proposta detalhada com os custos, serviços incluídos e prazos antes de confirmar qualquer trabalho.</p></div><Link className="text-link" to="/contactos">Pedir informações <ArrowRight size={15} /></Link></div>}
      {page === 'sobre' && <div className="about-values">{[['Personalizado', 'Nenhum convite é publicado sem a sua aprovação.'], ['Próximo', 'A equipa acompanha o pedido do início ao fim.'], ['Claro', 'Prazos, valores e revisões são combinados consigo.']].map(([title, body]) => <article key={title}><span className="value-mark"><Check size={16} /></span><h2>{title}</h2><p>{body}</p></article>)}</div>}
      {page === 'contactos' && <div className="contact-grid"><article><span><Mail size={18} /></span><div><h2>Email</h2><p>Canal de contacto a configurar antes do lançamento.</p></div></article><article><span><Phone size={18} /></span><div><h2>Telefone</h2><p>Canal de contacto a configurar antes do lançamento.</p></div></article><article><span><MapPin size={18} /></span><div><h2>Fuso horário</h2><p>Africa/Maputo</p></div></article><Link className="button button-dark contact-cta" to="/registar">Criar conta para pedir <ArrowRight size={15} /></Link></div>}
      {page !== 'contactos' && <div className="info-cta"><Link className="button button-dark" to="/contactos">Fale connosco <ArrowRight size={15} /></Link></div>}
    </div>
  )
}
