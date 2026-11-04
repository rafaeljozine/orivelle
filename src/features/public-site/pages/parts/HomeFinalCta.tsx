import { ArrowRight, Flower2 } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router'

export function HomeFinalCta() {
  return (
    <section className="home-final-cta" aria-labelledby="home-final-title">
      <span className="final-ornament final-ornament-one" aria-hidden="true" />
      <span className="final-ornament final-ornament-two" aria-hidden="true" />
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.55 }}>
        <Flower2 className="final-flower" size={30} aria-hidden="true" />
        <span className="home-eyebrow final-eyebrow">
          <svg className="final-moustache final-moustache-left" viewBox="0 0 64 30" aria-hidden="true"><path d="M62 21C50 21 46 12 37 12C29 12 26 17 29 22C32 27 39 26 42 21C46 14 40 6 31 6C19 6 15 15 9 15C5 15 2 12 3 8C4 5 7 4 10 5" /></svg>
          <span>A sua celebração merece este cuidado</span>
          <svg className="final-moustache final-moustache-right" viewBox="0 0 64 30" aria-hidden="true"><path d="M62 21C50 21 46 12 37 12C29 12 26 17 29 22C32 27 39 26 42 21C46 14 40 6 31 6C19 6 15 15 9 15C5 15 2 12 3 8C4 5 7 4 10 5" /></svg>
        </span>
        <h2 id="home-final-title">Os momentos especiais começam<br />com um convite inesquecível.</h2>
        <p>Transforme a sua próxima celebração numa experiência única, criada com elegância e atenção a cada detalhe.</p>
        <Link className="button final-cta-button" to="/pedido">Criar o meu convite <ArrowRight size={18} /></Link>
      </motion.div>
    </section>
  )
}
