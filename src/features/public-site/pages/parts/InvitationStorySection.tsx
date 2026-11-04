import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import { InvitationPhone } from './InvitationPhone'

export function InvitationStorySection() {
  return (
    <section className="story-section home-section" aria-labelledby="story-title">
      <span className="story-floral story-floral-top" aria-hidden="true"><i /><i /><i /></span>
      <span className="story-floral story-floral-bottom" aria-hidden="true"><i /><i /><i /></span>
      <motion.div className="story-visual" initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.65, ease: 'easeOut' }}>
        <InvitationPhone decorative />
      </motion.div>
      <motion.div className="story-copy" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.6, delay: 0.08, ease: 'easeOut' }}>
        <span className="home-eyebrow">Convites digitais exclusivos</span>
        <h2 id="story-title">A arte de convidar<br />começa nos detalhes.</h2>
        <span className="gold-rule" aria-hidden="true" />
        <p>Cada celebração tem uma história única. Na Orivelle, transformamos os seus momentos especiais em convites digitais elegantes, personalizados e memoráveis.</p>
        <Link className="button home-primary-button" to="/modelos">Explorar convites <ArrowRight size={18} /></Link>
      </motion.div>
    </section>
  )
}
