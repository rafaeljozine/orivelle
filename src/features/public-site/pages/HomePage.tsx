import { ArrowRight, Clock3, Feather, Heart, Smartphone } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import { CatalogHighlights } from './parts/CatalogHighlights'

const heroBenefits = [
  { label: 'Personalizado', icon: Feather },
  { label: 'Interativo', icon: Smartphone },
  { label: 'Envio Rápido', icon: Clock3 },
]

const categories = ['Todos', 'Casamento', 'Aniversário', 'Lobolo', 'Formatura', 'Infantil', 'Religioso']

export function HomePage() {
  return (
    <>
      <section className="hero reference-hero" aria-labelledby="hero-title">
        <img className="hero-image" src="/assets/orivelle-hero.png" alt="Flores azuis e brancas, alianças douradas e um convite num envelope azul" fetchPriority="high" />
        <div className="hero-shade" />
        <motion.div className="hero-content" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
          <span className="reference-kicker"><span /> Convites digitais personalizados <span /></span>
          <h1 id="hero-title">Transforme o seu Evento<br />em uma Experiência<em>Inesquecível.</em></h1>
          <p>Convites digitais elegantes, interativos e feitos à medida<br className="desktop-break" /> do seu momento especial.</p>
          <div className="reference-benefits" aria-label="Vantagens">
            {heroBenefits.map(({ label, icon: Icon }) => <div key={label}><Icon aria-hidden="true" /><strong>{label}</strong></div>)}
          </div>
        </motion.div>
        <svg className="hero-wave" viewBox="0 0 1440 92" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,44 C170,2 325,94 540,54 C766,12 914,24 1084,60 C1215,88 1324,34 1440,24 L1440,92 L0,92 Z" fill="#f8fbff" />
          <path d="M0,39 C170,-2 325,88 540,49 C766,7 914,19 1084,55 C1215,83 1324,29 1440,19" fill="none" stroke="#38aaf0" strokeWidth="4" />
        </svg>
      </section>

      <section className="home-models" aria-labelledby="models-title">
        <div className="home-models-heading">
          <h2 id="models-title">Explore os nossos Modelos</h2>
          <p>Diversos temas para casamentos, aniversários, bodas, formaturas e muito mais.</p>
        </div>
        <div className="home-category-filter" aria-label="Categorias de modelos">
          {categories.map((category, index) => <Link key={category} className={index === 0 ? 'selected' : ''} to={index === 0 ? '/modelos' : `/modelos?categoria=${encodeURIComponent(category)}`}>{category}</Link>)}
        </div>
        <CatalogHighlights limit={5} variant="showcase" />
      </section>

      <section className="invitation-showcase" aria-labelledby="invitation-showcase-title">
        <motion.div className="invitation-showcase-visual" initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.65, ease: 'easeOut' }}>
          <span className="invitation-glow" aria-hidden="true" />
          <img src="/assets/orivelle-phone-invitation-real.png" alt="Telemóvel com convite de casamento de Jozine e Verónica, rodeado por lírios brancos e detalhes dourados" loading="lazy" />
        </motion.div>
        <motion.div className="invitation-showcase-copy" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.65, delay: 0.08, ease: 'easeOut' }}>
          <span className="invitation-eyebrow">Convites digitais exclusivos</span>
          <h2 id="invitation-showcase-title">A arte de convidar<br />começa nos detalhes.</h2>
          <div className="invitation-ornament" aria-hidden="true"><span /><Heart size={26} /><span /></div>
          <p>Mais do que um simples convite, criamos experiências digitais elegantes, interativas e personalizadas, que refletem a essência do seu momento especial e encantam os seus convidados.</p>
          <Link className="button invitation-demo-button" to="/modelos/casamento">Ver Demonstração <ArrowRight size={20} /></Link>
        </motion.div>
      </section>
    </>
  )
}
