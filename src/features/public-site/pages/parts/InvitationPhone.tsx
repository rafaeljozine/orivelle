import { AnimatePresence, motion } from 'motion/react'
import { Check, Clock3, Image as ImageIcon, MapPin, MessageCircle, Music2, UserRoundCheck } from 'lucide-react'
import { useState } from 'react'

export type InvitationDemoFeature = 'rsvp' | 'countdown' | 'map' | 'gallery' | 'music' | 'whatsapp'

type InvitationPhoneProps = {
  activeFeature?: InvitationDemoFeature
  decorative?: boolean
}

function FeaturePreview({ feature }: { feature: InvitationDemoFeature }) {
  if (feature === 'rsvp') {
    return <div className="phone-feature-card"><span><Check size={13} /> Confirmação de presença</span><strong>Contamos consigo?</strong><div className="phone-rsvp-actions"><span>Confirmar</span><span>Não posso ir</span></div></div>
  }

  if (feature === 'countdown') {
    return <div className="phone-feature-card"><span><Clock3 size={13} /> Contagem decrescente</span><strong>Faltam apenas</strong><div className="phone-countdown"><b>142<small>dias</small></b><b>08<small>horas</small></b><b>26<small>min.</small></b></div></div>
  }

  if (feature === 'map') {
    return <div className="phone-feature-card"><span><MapPin size={13} /> Localização</span><div className="phone-map"><i /><i /><i /><MapPin size={22} /></div><strong>Quinta das Acácias · Maputo</strong></div>
  }

  if (feature === 'gallery') {
    return <div className="phone-feature-card"><span><ImageIcon size={13} /> Galeria de fotografias</span><div className="phone-gallery"><img src="/assets/wedding-gallery-couple.jpg" alt="" width="480" height="480" /><img src="/assets/wedding-gallery-rings.jpg" alt="" width="480" height="480" /><img src="/assets/wedding-gallery-table.jpg" alt="" width="480" height="480" /><img src="/assets/wedding-gallery-dance.jpg" alt="" width="480" height="480" /></div><strong>Momentos para recordar</strong></div>
  }

  if (feature === 'music') {
    return <div className="phone-feature-card"><span><Music2 size={13} /> Música de fundo</span><div className="phone-player"><i><Music2 size={15} /></i><div><strong>A nossa canção</strong><span className="phone-wave" /></div></div></div>
  }

  return <div className="phone-feature-card"><span><MessageCircle size={13} /> Partilha simples</span><div className="phone-message"><MessageCircle size={20} /><div><strong>Partilhar convite</strong><small>Enviar através do WhatsApp</small></div></div></div>
}

export function InvitationPhone({ activeFeature, decorative = false }: InvitationPhoneProps) {
  const [isPresenceConfirmed, setIsPresenceConfirmed] = useState(false)

  return (
    <div className={`invite-phone-composition ${decorative ? 'is-decorative' : ''}`}>
      <div className="invite-phone" aria-label={decorative ? 'Convite de casamento apresentado num telemóvel' : 'Convite digital interactivo'}>
        <span className="phone-side-button phone-side-button-one" aria-hidden="true" />
        <span className="phone-side-button phone-side-button-two" aria-hidden="true" />
        <div className="phone-screen">
          <span className="phone-speaker" aria-hidden="true" />
          <span className="invite-floral invite-floral-top" aria-hidden="true"><i /><i /><i /></span>
          <span className="invite-floral invite-floral-bottom" aria-hidden="true"><i /><i /><i /></span>
          <p className="phone-invite-kicker">Convite de casamento</p>
          <span className="phone-gold-rule" aria-hidden="true" />
          <h3>Inês <em>&amp;</em> Miguel</h3>
          <p className="phone-invite-copy">Temos a alegria de convidar para a celebração do nosso casamento</p>
          <div className="phone-invite-date"><strong>12 · 09 · 2027</strong><span>Quinta das Acácias · Maputo</span></div>
          {activeFeature ? <AnimatePresence mode="wait"><motion.div className="phone-feature-preview" key={activeFeature} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}><FeaturePreview feature={activeFeature} /></motion.div></AnimatePresence> : <span className="phone-invite-footer">Celebre connosco</span>}
        </div>
      </div>
      {decorative && <div className="phone-quick-actions" aria-label="Ações do convite"><button type="button" className={`phone-float phone-float-rsvp ${isPresenceConfirmed ? 'is-confirmed' : ''}`} aria-pressed={isPresenceConfirmed} onClick={() => setIsPresenceConfirmed((confirmed) => !confirmed)}><span className="phone-float-icon">{isPresenceConfirmed ? <Check size={17} /> : <UserRoundCheck size={17} />}</span><span><small>Presença</small><strong>{isPresenceConfirmed ? 'Confirmada' : 'Confirmar'}</strong></span></button><a className="phone-float phone-float-place" href="https://www.google.com/maps/search/?api=1&query=Quinta%20das%20Ac%C3%A1cias%20Maputo" target="_blank" rel="noreferrer" aria-label="Abrir a localização Quinta das Acácias, Maputo, no mapa"><span className="phone-float-icon"><MapPin size={17} /></span><span><small>Localização</small><strong>Maputo</strong></span></a></div>}
    </div>
  )
}
