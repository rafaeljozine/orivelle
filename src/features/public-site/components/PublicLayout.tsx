import { Menu, MoveUpRight, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import { signOut } from '../../auth/services/auth-service'
import { BrandMark } from '../../../components/BrandMark'

const navItems = [
  { to: '/', label: 'Início' },
  { to: '/modelos', label: 'Modelos' },
  { to: '/como-funciona', label: 'Como funciona' },
  { to: '/precos', label: 'Preços' },
  { to: '/contactos', label: 'Contato' },
]

export function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user } = useAuth()
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <>
      <a className="skip-link" href="#main-content">Saltar para o conteúdo</a>
      <header className={`site-header ${isHome ? 'site-header-home' : ''}`}>
        <BrandMark light={isHome} />
        <nav id="main-navigation" className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegação principal">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setMenuOpen(false)}>{item.label}</NavLink>
          ))}
        </nav>
        <div className="header-actions">
          {user ? <><Link className="header-login" to="/cliente">Minha área</Link><button type="button" className="header-login nav-signout" onClick={() => void signOut()}>Sair</button></> : <Link className="header-login" to="/entrar">Entrar</Link>}
          <Link className="button header-cta" to="/pedido">Criar Pedido <MoveUpRight size={15} /></Link>
        </div>
        <button type="button" className="menu-toggle" aria-controls="main-navigation" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>
      <main id="main-content" className="min-h-screen"><Outlet /></main>
      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <BrandMark light />
            <p>Convites digitais personalizados,<br />criados em Moçambique com cuidado.</p>
          </div>
          <div className="footer-links"><span className="footer-label">Explore</span><Link to="/modelos">Modelos</Link><Link to="/como-funciona">Como funciona</Link><Link to="/precos">Preços</Link></div>
          <div className="footer-links"><span className="footer-label">Estamos por perto</span><Link to="/sobre">Sobre nós</Link><Link to="/contactos">Contactos</Link><Link to="/entrar">Área do cliente</Link></div>
          <div className="footer-contact"><span className="footer-label">Uma ideia em mente?</span><p>Vamos começar por uma conversa.</p><Link to="/contactos" className="footer-contact-link">Fale connosco <MoveUpRight size={14} /></Link></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Orivelle. Todos os direitos reservados.</span><span>Moçambique <span aria-hidden="true">·</span> MZN</span></div>
      </footer>
    </>
  )
}
