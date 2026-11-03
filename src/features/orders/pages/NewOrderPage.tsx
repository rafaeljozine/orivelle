import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Check, ClipboardList } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import { DemoNotice } from '../../public-site/components/DemoNotice'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getTemplates } from '../../public-site/services/catalog-service'
import { orderSchema, type OrderFormInput, type OrderFormValues } from '../schemas/order-schema'
import { createOrder } from '../services/order-service'
import { getTodayIso } from '../../../lib/format'

export function NewOrderPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: catalog } = useQuery({ queryKey: ['templates'], queryFn: getTemplates })
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<OrderFormInput, unknown, OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: { guestEstimate: 50, eventType: 'casamento' },
  })

  async function onSubmit(values: OrderFormValues) {
    if (!user) return
    setSubmitting(true)
    setErrorMessage('')
    try {
      const orderId = await createOrder(values, user)
      await queryClient.invalidateQueries({ queryKey: ['client-orders', user.id] })
      navigate(`/cliente?pedido=${encodeURIComponent(orderId)}`, { replace: true })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível enviar o pedido.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="order-page page-shell">
      <div className="order-intro"><span className="eyebrow">Um bom começo</span><h1>Conte-nos sobre<br /><em>a vossa celebração.</em></h1><p>Partilhe alguns detalhes. A nossa equipa entrará em contacto para conversar sobre as próximas etapas.</p><div className="order-assurance"><Check size={16} /><span>O seu pedido fica associado à sua conta e só é visível para si e para a equipa autorizada.</span></div></div>
      <section className="order-form-panel">
        <div className="form-panel-heading"><span className="form-panel-icon"><ClipboardList size={18} /></span><div><span className="eyebrow">Novo pedido</span><h2>Detalhes da celebração</h2></div></div>
        {catalog?.demo && <DemoNotice />}
        {errorMessage && <div className="error-message" role="alert">{errorMessage}</div>}
        <form className="order-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="field-label">Nome da celebração<input placeholder="Ex.: Casamento de Ana e Paulo" {...register('eventName')} />{errors.eventName && <span className="field-error">{errors.eventName.message}</span>}</label>
          <div className="field-grid"><label className="field-label">Tipo de celebração<select {...register('eventType')}><option value="casamento">Casamento</option><option value="aniversario">Aniversário</option><option value="noivado">Noivado</option><option value="cha">Chá de bebé</option><option value="outro">Outro</option></select>{errors.eventType && <span className="field-error">{errors.eventType.message}</span>}</label><label className="field-label">Data prevista<input type="date" min={getTodayIso()} {...register('eventDate')} />{errors.eventDate && <span className="field-error">{errors.eventDate.message}</span>}</label></div>
          <div className="field-grid"><label className="field-label">Número aproximado de convidados<input type="number" min="1" max="10000" {...register('guestEstimate')} />{errors.guestEstimate && <span className="field-error">{errors.guestEstimate.message}</span>}</label><label className="field-label">Local da celebração <span className="optional-label">Opcional</span><input placeholder="Cidade ou local" {...register('location')} />{errors.location && <span className="field-error">{errors.location.message}</span>}</label></div>
          {!catalog?.demo && catalog?.templates.length ? <label className="field-label">Modelo de referência <span className="optional-label">Opcional</span><select {...register('templateId')}><option value="">Ainda não escolhi</option>{catalog.templates.map((template) => <option value={template.id} key={template.id}>{template.name}</option>)}</select></label> : null}
          <label className="field-label">O que gostaria que soubéssemos? <span className="optional-label">Opcional</span><textarea rows={4} placeholder="Conte-nos sobre o ambiente, os detalhes ou as funcionalidades que imagina." {...register('details')} />{errors.details && <span className="field-error">{errors.details.message}</span>}</label>
          <div className="form-footer"><p>Sem compromisso. A proposta e os valores serão partilhados consigo antes de avançarmos.</p><button className="button button-dark" type="submit" disabled={submitting}>{submitting ? 'A enviar…' : 'Enviar pedido'} <ArrowRight size={16} /></button></div>
        </form>
        <Link className="form-back-link" to="/cliente">Voltar à minha área</Link>
      </section>
    </div>
  )
}
