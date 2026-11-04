import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const questions = [
  ['Como funciona um convite digital?', 'A nossa equipa prepara o convite com as informações da celebração, apresenta uma versão para aprovação e, depois da sua confirmação, entrega uma ligação para partilhar com os convidados.'],
  ['Posso personalizar o meu convite?', 'Sim. Nomes, data, texto, fotografias, localização e direcção visual são combinados no pedido. A personalização final depende do modelo e da proposta aprovada.'],
  ['Como recebo o convite depois de efectuar o pedido?', 'Depois da criação e da sua aprovação, a equipa publica o convite e envia-lhe a ligação final através do canal de contacto acordado.'],
  ['Posso partilhar através do WhatsApp?', 'Sim. A ligação do convite pode ser enviada pelo WhatsApp ou por outra aplicação de mensagens, sem exigir uma instalação adicional.'],
  ['Posso alterar informações depois de criar o convite?', 'As alterações podem ser pedidas durante a fase de revisão. Depois da publicação, contacte a equipa para confirmar a viabilidade, o prazo e qualquer custo associado.'],
  ['Os meus convidados precisam de instalar alguma aplicação?', 'Não. O convite é aberto através de uma ligação num navegador compatível, no telemóvel ou no computador.'],
  ['Como funciona a confirmação de presença?', 'Os convidados confirmam a presença diretamente no convite digital, ajudando a manter a lista de respostas organizada num só lugar.'],
] as const

export function HomeFaqSection() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="home-faq home-section" aria-labelledby="home-faq-title">
      <div className="home-section-heading faq-heading"><span className="home-eyebrow">Perguntas frequentes</span><h2 id="home-faq-title">Antes de começar,<br /><em>esclareça as suas dúvidas.</em></h2></div>
      <div className="faq-list">{questions.map(([question, answer], index) => { const isOpen = openIndex === index; const panelId = `faq-panel-${index}`; return <article className={`faq-item ${isOpen ? 'is-open' : ''}`} key={question}><h3><button type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpenIndex(isOpen ? -1 : index)}><span>{question}</span><ChevronDown size={20} /></button></h3><div className="faq-answer" id={panelId} aria-hidden={!isOpen}><div><p>{answer}</p></div></div></article> })}</div>
    </section>
  )
}
