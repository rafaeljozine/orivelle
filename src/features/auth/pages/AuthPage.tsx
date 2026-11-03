import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import { appEnv } from '../../../config/env'
import { getSafeInternalPath } from '../../../lib/navigation'
import { authSchema, type AuthFormValues } from '../schemas/auth-schema'
import { requestPasswordReset, signIn, signUp, updatePassword } from '../services/auth-service'

type AuthMode = 'login' | 'register' | 'recovery' | 'update'

function modeForPath(pathname: string, search: string): AuthMode {
  if (pathname === '/registar') return 'register'
  if (pathname === '/recuperar-acesso') return 'recovery'
  if (new URLSearchParams(search).get('recuperacao') === 'concluida') return 'update'
  return 'login'
}

export function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const mode = modeForPath(location.pathname, location.search)
  const passwordUpdated = new URLSearchParams(location.search).get('password_actualizada') === '1'
  const [message, setMessage] = useState(passwordUpdated ? 'Palavra-passe actualizada. Já pode entrar na sua conta.' : '')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, setError, formState: { errors } } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
  })

  async function onSubmit(values: AuthFormValues) {
    setMessage('')
    setErrorMessage('')
    if (mode !== 'update' && !values.email) {
      setError('email', { message: 'Introduza um endereço de email válido.' })
      return
    }
    if (mode !== 'recovery' && (!values.password || values.password.length < 8)) {
      setError('password', { message: 'A palavra-passe deve ter pelo menos 8 caracteres.' })
      return
    }
    if (mode === 'update' && values.password !== values.confirmPassword) {
      setError('confirmPassword', { message: 'As palavras-passe não coincidem.' })
      return
    }
    if (mode === 'register' && !values.name?.trim()) {
      setError('name', { message: 'Indique o seu nome.' })
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'register') {
        await signUp(values.name!.trim(), values.email!, values.password!)
        setMessage('Conta criada. Verifique o seu email para confirmar o endereço antes de entrar.')
      } else if (mode === 'recovery') {
        await requestPasswordReset(values.email!)
        setMessage('Se existir uma conta para este email, receberá instruções para recuperar o acesso.')
      } else if (mode === 'update') {
        await updatePassword(values.password!)
        navigate('/entrar?password_actualizada=1', { replace: true })
      } else {
        await signIn(values.email!, values.password!)
        const destination = new URLSearchParams(location.search).get('destino')
        navigate(getSafeInternalPath(destination, '/cliente'), { replace: true })
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível concluir o pedido.')
    } finally {
      setSubmitting(false)
    }
  }

  const title = mode === 'register' ? 'Comecemos por si.' : mode === 'recovery' ? 'Recuperar acesso.' : mode === 'update' ? 'Defina uma nova palavra-passe.' : 'Que bom ter de volta.'
  const description = mode === 'register'
    ? 'Crie a sua conta para acompanhar o convite e falar com a nossa equipa.'
    : mode === 'recovery'
      ? 'Enviaremos instruções para o email associado à sua conta.'
      : mode === 'update'
        ? 'Escolha uma palavra-passe nova para voltar a aceder à sua conta.'
        : 'Entre para consultar os seus pedidos e acompanhar cada detalhe.'

  return (
    <div className="auth-page page-shell">
      <div className="auth-decoration"><span className="eyebrow eyebrow-light">Um momento de cada vez</span><p>As melhores celebrações começam com uma boa conversa.</p><span className="auth-decoration-line" /></div>
      <section className="auth-panel" aria-labelledby="auth-title">
        <Link className="back-link" to="/"><ArrowLeft size={15} /> Voltar ao início</Link>
        <span className="eyebrow">Área do cliente</span>
        <h1 id="auth-title">{title}</h1>
        <p className="auth-description">{description}</p>
        {!appEnv.hasSupabase && <div className="form-notice" role="status">A autenticação ainda não está configurada neste ambiente. Contacte a equipa para ativar a sua conta.</div>}
        {message && <div className="success-message" role="status">{message}</div>}
        {errorMessage && <div className="error-message" role="alert">{errorMessage}</div>}
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {mode === 'register' && <label className="field-label">Nome completo<span className="input-wrap"><UserRound size={17} /><input autoComplete="name" placeholder="Como devemos chamar-lhe?" {...register('name')} /></span>{errors.name && <span className="field-error">{errors.name.message}</span>}</label>}
          {mode !== 'update' && <label className="field-label">Email<span className="input-wrap"><Mail size={17} /><input type="email" autoComplete="email" placeholder="nome@email.com" {...register('email')} /></span>{errors.email && <span className="field-error">{errors.email.message}</span>}</label>}
          {mode !== 'recovery' && <label className="field-label">Palavra-passe<span className="input-wrap"><LockKeyhole size={17} /><input type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} placeholder="Pelo menos 8 caracteres" {...register('password')} /></span>{errors.password && <span className="field-error">{errors.password.message}</span>}</label>}
          {mode === 'update' && <label className="field-label">Confirmar nova palavra-passe<span className="input-wrap"><LockKeyhole size={17} /><input type="password" autoComplete="new-password" placeholder="Repita a nova palavra-passe" {...register('confirmPassword')} /></span>{errors.confirmPassword && <span className="field-error">{errors.confirmPassword.message}</span>}</label>}
          <button className="button button-dark auth-submit" type="submit" disabled={!appEnv.hasSupabase || submitting}>{submitting ? 'A processar…' : mode === 'register' ? 'Criar conta' : mode === 'recovery' ? 'Enviar instruções' : mode === 'update' ? 'Guardar nova palavra-passe' : 'Entrar'} <ArrowRight size={16} /></button>
        </form>
        {mode === 'login' && <Link className="auth-secondary-link" to="/recuperar-acesso">Esqueceu-se da palavra-passe?</Link>}
        {mode !== 'register' && <p className="auth-switch">Ainda não tem conta? <Link to="/registar">Criar conta</Link></p>}
        {mode === 'register' && <p className="auth-switch">Já tem uma conta? <Link to="/entrar">Entrar</Link></p>}
      </section>
    </div>
  )
}
