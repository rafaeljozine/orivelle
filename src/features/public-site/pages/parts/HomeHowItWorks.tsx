import { LayoutTemplate, Send, SlidersHorizontal } from 'lucide-react'
import { motion } from 'motion/react'

const steps = [
  { number: '01', title: 'Escolha o seu modelo', body: 'Explore a nossa colecção de convites e escolha o estilo ideal para a sua celebração.', icon: LayoutTemplate },
  { number: '02', title: 'Personalize os detalhes', body: 'Adicione nomes, datas, fotografias, localização e todos os detalhes especiais do seu evento.', icon: SlidersHorizontal },
  { number: '03', title: 'Partilhe o seu convite', body: 'Envie o convite digital aos seus convidados através de uma ligação ou do WhatsApp.', icon: Send },
]

export function HomeHowItWorks() {
  return (
    <section className="home-process home-section" aria-labelledby="home-process-title">
      <div className="home-section-heading centered-heading"><span className="home-eyebrow">Simples, cuidado e acompanhado</span><h2 id="home-process-title">Como funciona</h2><p>Da escolha do estilo à partilha com os convidados, acompanhamos cada detalhe consigo.</p></div>
      <div className="home-process-grid">
        {steps.map(({ number, title, body, icon: Icon }, index) => <motion.article className="home-process-step" key={number} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.45, delay: index * 0.1 }}><span className="process-number">{number}</span><span className="process-icon"><Icon size={22} /></span><h3>{title}</h3><p>{body}</p></motion.article>)}
      </div>
    </section>
  )
}
