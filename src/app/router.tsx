import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute'
import { PublicLayout } from '../features/public-site/components/PublicLayout'

const AuthPage = lazy(() => import('../features/auth/pages/AuthPage').then((module) => ({ default: module.AuthPage })))
const ClientDashboardPage = lazy(() => import('../features/client/pages/ClientDashboardPage').then((module) => ({ default: module.ClientDashboardPage })))
const ProfilePage = lazy(() => import('../features/client/pages/ProfilePage').then((module) => ({ default: module.ProfilePage })))
const NewOrderPage = lazy(() => import('../features/orders/pages/NewOrderPage').then((module) => ({ default: module.NewOrderPage })))
const HomePage = lazy(() => import('../features/public-site/pages/HomePage').then((module) => ({ default: module.HomePage })))
const CatalogPage = lazy(() => import('../features/public-site/pages/CatalogPage').then((module) => ({ default: module.CatalogPage })))
const TemplateDetailPage = lazy(() => import('../features/public-site/pages/TemplateDetailPage').then((module) => ({ default: module.TemplateDetailPage })))
const InformationPage = lazy(() => import('../features/public-site/pages/InformationPage').then((module) => ({ default: module.InformationPage })))

const routeTitles: Record<string, string> = {
  '/': 'Orivelle | Convites digitais',
  '/modelos': 'Modelos | Orivelle',
  '/precos': 'Preços | Orivelle',
  '/como-funciona': 'Como funciona | Orivelle',
  '/sobre': 'Sobre nós | Orivelle',
  '/contactos': 'Contactos | Orivelle',
  '/entrar': 'Entrar | Orivelle',
  '/registar': 'Criar conta | Orivelle',
  '/recuperar-acesso': 'Recuperar acesso | Orivelle',
  '/pedido': 'Novo pedido | Orivelle',
  '/cliente': 'A minha área | Orivelle',
  '/perfil': 'Perfil | Orivelle',
}

function RouteEffects() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    document.title = routeTitles[pathname] ?? (pathname.startsWith('/modelos/') ? 'Modelo | Orivelle' : 'Orivelle | Convites digitais')
    if (!hash) window.scrollTo({ top: 0, left: 0 })
  }, [pathname, hash])

  return null
}

export function AppRoutes() {
  return (
    <>
      <RouteEffects />
      <Suspense fallback={<div className="page-loading" role="status">A carregar página…</div>}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="modelos" element={<CatalogPage />} />
            <Route path="modelos/:slug" element={<TemplateDetailPage />} />
            <Route path="precos" element={<InformationPage page="precos" />} />
            <Route path="como-funciona" element={<InformationPage page="como-funciona" />} />
            <Route path="sobre" element={<InformationPage page="sobre" />} />
            <Route path="contactos" element={<InformationPage page="contactos" />} />
            <Route path="entrar" element={<AuthPage />} />
            <Route path="registar" element={<AuthPage />} />
            <Route path="recuperar-acesso" element={<AuthPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="pedido" element={<NewOrderPage />} />
              <Route path="cliente" element={<ClientDashboardPage />} />
              <Route path="perfil" element={<ProfilePage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}
