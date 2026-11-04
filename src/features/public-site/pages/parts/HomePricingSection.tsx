import { ArrowRight, Heart, PenTool, Send } from 'lucide-react'
import { Link } from 'react-router'

const benefits = [
  {
    title: 'Design exclusivo',
    description: 'Criado com elegância e personalidade.',
    icon: PenTool,
  },
  {
    title: 'Detalhes adaptados',
    description: 'De acordo com o estilo da sua celebração.',
    icon: Heart,
  },
  {
    title: 'Partilha digital',
    description: 'Prático, moderno e inesquecível.',
    icon: Send,
  },
]

export function HomePricingSection() {
  return (
    <section className="home-pricing home-section" aria-labelledby="home-pricing-title">
      <img className="pricing-lilies pricing-lilies-top" src="/assets/pricing-lilies.png" alt="" aria-hidden="true" />
      <img className="pricing-lilies pricing-lilies-bottom" src="/assets/pricing-lilies.png" alt="" aria-hidden="true" />

      <div className="pricing-content">
        <header className="pricing-heading">
          <span className="pricing-eyebrow"><i /> Pacotes e preços <i /></span>
          <h2 id="home-pricing-title">Cada celebração é única.</h2>
          <span className="pricing-flourish" aria-hidden="true"><i /><Heart /></span>
          <p>O teu convite merece a mesma atenção e elegância que dedicas ao teu momento especial.</p>
        </header>

        <div className="pricing-benefits">
          {benefits.map(({ title, description, icon: Icon }) => (
            <article className="pricing-benefit" key={title}>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>

        <Link className="button pricing-cta" to="/contactos">
          Solicitar orçamento <ArrowRight aria-hidden="true" />
        </Link>

        <p className="pricing-note"><i /> <span>Proposta personalizada, <em>sem compromisso.</em></span> <i /></p>
      </div>
    </section>
  )
}
