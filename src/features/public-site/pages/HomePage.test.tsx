import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { HomePage } from './HomePage'

vi.mock('../services/catalog-service', () => ({
  getTemplates: vi.fn().mockResolvedValue({ templates: [], demo: true }),
}))

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders the service introduction and the models link', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter><HomePage /></MemoryRouter>
      </QueryClientProvider>,
    )

    expect(screen.getByRole('heading', { name: /Transforme o seu Evento/ })).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: 'Todos' })).toHaveAttribute('href', '/modelos')
  })

  it('updates the invitation preview and expands an FAQ answer', async () => {
    const user = userEvent.setup()
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter><HomePage /></MemoryRouter>
      </QueryClientProvider>,
    )

    const countdownButton = screen.getByRole('button', { name: /Contagem decrescente/ })
    const rsvpButton = screen.getByRole('button', { name: /Confirmação de presença/ })
    await user.click(countdownButton)
    expect(countdownButton).toHaveAttribute('aria-pressed', 'true')
    expect(rsvpButton).toHaveAttribute('aria-pressed', 'false')

    const faqButton = screen.getByRole('button', { name: 'Posso personalizar o meu convite?' })
    expect(faqButton).toHaveAttribute('aria-expanded', 'false')
    await user.click(faqButton)
    expect(faqButton).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(/Nomes, data, texto, fotografias/)).toBeInTheDocument()
  })
})
