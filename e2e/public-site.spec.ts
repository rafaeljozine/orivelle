import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route(/images\.unsplash\.com|fonts\.googleapis\.com|fonts\.gstatic\.com/, (route) => route.abort())
})

test('página inicial apresenta o serviço e o catálogo demonstrativo', async ({ page }) => {
  await page.goto('/', { waitUntil: 'commit' })
  await expect(page).toHaveTitle(/Orivelle/)
  await expect(page.getByRole('heading', { name: /Transforme o seu Evento/ })).toBeVisible()
  await page.getByRole('link', { name: 'Todos' }).click()
  await expect(page).toHaveURL(/\/modelos$/)
  await expect(page.getByRole('heading', { name: /Um ponto de partida/ })).toBeVisible()
})

test('pedido requer sessão e redirecciona para autenticação', async ({ page }) => {
  await page.goto('/pedido', { waitUntil: 'domcontentloaded' })
  await expect(page).toHaveURL(/\/entrar\?destino=/)
  await expect(page.getByRole('heading', { name: /Que bom ter de volta/ })).toBeVisible()
})

test('navegação móvel abre e fecha com controlo acessível', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const menuButton = page.getByRole('button', { name: 'Abrir menu' })
  await menuButton.click()
  await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true')
})
