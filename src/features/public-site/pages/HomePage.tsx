import { Clock3, Feather, Smartphone } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import { CatalogHighlights } from './parts/CatalogHighlights'
import { HomeFaqSection } from './parts/HomeFaqSection'
import { HomeFinalCta } from './parts/HomeFinalCta'
import { HomeHowItWorks } from './parts/HomeHowItWorks'
import { HomePricingSection } from './parts/HomePricingSection'
import { InteractiveInvitationSection } from './parts/InteractiveInvitationSection'
import { InvitationStorySection } from './parts/InvitationStorySection'
import { OccasionGallery } from './parts/OccasionGallery'

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
        <picture>
          <source media="(max-width: 768px)" srcSet="/assets/orivelle-hero-roses-mobile.png" width={1024} height={1536} />
          <img className="hero-image" src="/assets/orivelle-hero-roses.png" alt="Rosas azuis e brancas, alianças douradas e um convite num envelope azul" width={1672} height={941} fetchPriority="high" />
        </picture>
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

      <InvitationStorySection />
      <InteractiveInvitationSection />
      <HomeHowItWorks />
      <OccasionGallery />
      <HomePricingSection />
      <HomeFaqSection />
      <HomeFinalCta />
    </>
  )
}
