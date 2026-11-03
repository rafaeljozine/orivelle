import { ArrowRight, CalendarDays, CircleHelp, ClipboardList, Plus, Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import { supabase } from '../../../lib/supabase/client'
import { formatDate, getTodayIso } from '../../../lib/format'
import type { EntityId, ISODate } from '../../../types/common'

type ClientOrder = {
  id: EntityId
  event_name: string
  event_type: string
  event_date: ISODate
  status: string
  created_at: string
}

const statusLabels: Record<string, string> = {
  submitted: 'Recebido', reviewing: 'Em análise', awaiting_payment: 'A aguardar pagamento',
  in_progress: 'Em criação', awaiting_approval: 'A aguardar aprovação',
  approved: 'Aprovado', published: 'Publicado', cancelled: 'Cancelado',
}

const eventTypeLabels: Record<string, string> = {
  casamento: 'Casamento',
  aniversario: 'Aniversário',
  noivado: 'Noivado',
  cha: 'Chá de bebé',
  outro: 'Outro',
}

export function ClientDashboardPage() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ['client-orders', user?.id],
    enabled: Boolean(user && supabase),
    queryFn: async () => {
      if (!user || !supabase) return [] as ClientOrder[]
      const { data, error } = await supabase.from('orders')
        .select('id, event_name, event_type, event_date, status, created_at')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as ClientOrder[]
    },
  })
  const requestedOrder = searchParams.get('pedido')
  const today = getTodayIso()
  const nextOrder = orders
    .filter((order) => order.status !== 'cancelled' && order.event_date >= today)
    .sort((a, b) => a.event_date.localeCompare(b.event_date))[0]
  const submittedOrderIsVisible = Boolean(requestedOrder && orders.some((order) => order.id === requestedOrder))

  return (
    <div className="dashboard page-shell">
      <div className="dashboard-topline"><div><span className="eyebrow">A sua área</span><h1>Bem-vindo{user?.user_metadata.full_name ? `, ${String(user.user_metadata.full_name).split(' ')[0]}` : ''}.</h1><p>Um lugar simples para acompanhar cada celebração.</p></div><Link className="button button-dark" to="/pedido"><Plus size={16} /> Novo pedido</Link></div>
      {submittedOrderIsVisible && <div className="success-message dashboard-success" role="status">Pedido enviado com sucesso. A equipa entrará em contacto consigo.</div>}
      <div className="dashboard-stats"><article><span className="dashboard-stat-icon"><Search size={17} /></span><span className="stat-label">Pedidos</span><strong>{isLoading ? '—' : orders.length}</strong><span className="stat-caption">no total</span></article><article><span className="dashboard-stat-icon"><CalendarDays size={17} /></span><span className="stat-label">Próxima celebração</span><strong>{nextOrder ? formatDate(nextOrder.event_date) : '—'}</strong><span className="stat-caption">{nextOrder ? 'data mais próxima' : 'sem eventos futuros'}</span></article><article><span className="dashboard-stat-icon"><CircleHelp size={17} /></span><span className="stat-label">Precisa de ajuda?</span><strong>Estamos por perto</strong><Link to="/contactos" className="stat-link">Falar connosco <ArrowRight size={13} /></Link></article></div>
      <section className="orders-section"><div className="orders-heading"><div><span className="eyebrow">Acompanhe o processo</span><h2>Os seus pedidos</h2></div><span className="orders-count">{orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}</span></div>
        {isLoading && <div className="table-empty" role="status">A carregar os seus pedidos…</div>}
        {isError && <div className="error-message" role="alert">Não foi possível carregar os seus pedidos. Atualize a página ou contacte a equipa.</div>}
        {!isLoading && !isError && orders.length > 0 && <div className="orders-table-wrap"><table className="orders-table"><thead><tr><th>Nome</th><th>Tipo</th><th>Data do evento</th><th>Estado</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><strong>{order.event_name}</strong><span className="order-id">Pedido {order.id.slice(0, 8).toUpperCase()}</span></td><td>{eventTypeLabels[order.event_type] ?? 'Celebração'}</td><td>{formatDate(order.event_date)}</td><td><span className={`status-badge status-${order.status}`}>{statusLabels[order.status] ?? 'Em acompanhamento'}</span></td></tr>)}</tbody></table></div>}
        {!isLoading && !isError && orders.length === 0 && <div className="table-empty"><span className="empty-order-mark"><ClipboardList size={21} /></span><h3>A sua próxima celebração começa aqui.</h3><p>Quando enviar um pedido, verá aqui o estado e os detalhes do acompanhamento.</p><Link className="button button-outline" to="/pedido">Criar o primeiro pedido <ArrowRight size={15} /></Link></div>}
      </section>
    </div>
  )
}
