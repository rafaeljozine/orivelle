import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen } from '@testing-library/react'
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
})
