import { CalendarClock, Camera, MapPinned, MessageCircle, Music2, UserRoundCheck, type LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { InvitationPhone, type InvitationDemoFeature } from './InvitationPhone'

type Feature = {
  id: InvitationDemoFeature
  label: string
  description: string
  icon: LucideIcon
}

const features: Feature[] = [
  { id: 'rsvp', label: 'Confirmação de presença', description: 'Uma resposta simples para organizar a lista de convidados.', icon: UserRoundCheck },
  { id: 'countdown', label: 'Contagem decrescente', description: 'A expectativa cresce à medida que o grande dia se aproxima.', icon: CalendarClock },
  { id: 'map', label: 'Localização do evento', description: 'Indicações claras para ajudar os convidados a chegar.', icon: MapPinned },
  { id: 'gallery', label: 'Galeria de fotografias', description: 'Um espaço visual para partilhar momentos importantes.', icon: Camera },
  { id: 'music', label: 'Música de fundo', description: 'Uma banda sonora opcional para acompanhar a experiência.', icon: Music2 },
  { id: 'whatsapp', label: 'Partilha por WhatsApp', description: 'Uma forma familiar de fazer chegar a ligação aos convidados.', icon: MessageCircle },
]

export function InteractiveInvitationSection() {
  const [activeFeature, setActiveFeature] = useState<InvitationDemoFeature>('rsvp')

  return (
    <section className="experience-section home-section" aria-labelledby="experience-title">
      <div className="home-section-heading experience-heading">
        <span className="home-eyebrow">Convites que ganham vida</span>
        <h2 id="experience-title">Mais do que um convite.<br /><em>Uma experiência.</em></h2>
        <p>Descubra como cada detalhe pode transformar um simples convite numa experiência especial para os seus convidados.</p>
      </div>
      <div className="experience-layout">
        <motion.div className="experience-phone" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
          <InvitationPhone activeFeature={activeFeature} />
        </motion.div>
        <div className="experience-controls" aria-label="Funcionalidades dos convites digitais">
          {features.map(({ id, label, description, icon: Icon }, index) => <motion.button type="button" className={`experience-control ${activeFeature === id ? 'is-active' : ''}`} key={id} aria-pressed={activeFeature === id} onClick={() => setActiveFeature(id)} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.35, delay: index * 0.05 }}><span className="experience-control-icon"><Icon size={19} /></span><span><strong>{label}</strong><small>{description}</small></span><i aria-hidden="true">0{index + 1}</i></motion.button>)}
        </div>
      </div>
    </section>
  )
}
