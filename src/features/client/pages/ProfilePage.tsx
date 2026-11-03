import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import { supabase } from '../../../lib/supabase/client'
import { profileSchema, type ProfileFormValues } from '../schemas/profile-schema'

type Profile = { email: string; full_name: string; phone_mz: string | null }

export function ProfilePage() {
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    let active = true
    async function loadProfile() {
      if (!user || !supabase) return
      const { data, error } = await supabase.from('profiles')
        .select('email, full_name, phone_mz')
        .eq('id', user.id)
        .single()
      if (!active) return
      if (error) setErrorMessage('Não foi possível carregar o perfil.')
      else {
        const nextProfile = data as Profile
        setProfile(nextProfile)
        reset({ fullName: nextProfile.full_name, phoneMz: nextProfile.phone_mz ?? '' })
      }
      setLoading(false)
    }
    void loadProfile()
    return () => { active = false }
  }, [user, reset])

  async function onSubmit(values: ProfileFormValues) {
    if (!user || !supabase) return
    setSaving(true)
    setMessage('')
    setErrorMessage('')
    try {
      const { error: authError } = await supabase.auth.updateUser({ data: { full_name: values.fullName } })
      if (authError) throw authError
      const { data, error } = await supabase.from('profiles')
        .update({ full_name: values.fullName, phone_mz: values.phoneMz?.trim() || null })
        .eq('id', user.id)
        .select('email, full_name, phone_mz')
        .single()
      if (error) throw error
      setProfile(data as Profile)
      setMessage('Perfil actualizado.')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível guardar o perfil.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="profile-page page-shell">
      <Link className="back-link" to="/cliente"><ArrowLeft size={15} /> Voltar à minha área</Link>
      <div className="profile-heading"><span className="profile-icon"><UserRound size={20} /></span><div><span className="eyebrow">A sua conta</span><h1>Perfil pessoal</h1><p>Os seus dados de contacto para acompanhar os pedidos.</p></div></div>
      <section className="profile-panel">
        {loading && <div className="page-loading" role="status">A carregar perfil…</div>}
        {!loading && profile && <form className="profile-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {message && <div className="success-message" role="status">{message}</div>}
          {errorMessage && <div className="error-message" role="alert">{errorMessage}</div>}
          <label className="field-label">Nome completo<input autoComplete="name" {...register('fullName')} />{errors.fullName && <span className="field-error">{errors.fullName.message}</span>}</label>
          <label className="field-label">Email <span className="optional-label">Gerido pela autenticação</span><input type="email" value={profile.email} readOnly aria-readonly="true" /></label>
          <label className="field-label">Telefone <span className="optional-label">Opcional</span><input type="tel" autoComplete="tel" placeholder="Número de contacto" {...register('phoneMz')} />{errors.phoneMz && <span className="field-error">{errors.phoneMz.message}</span>}</label>
          <button className="button button-dark" type="submit" disabled={saving}>{saving ? 'A guardar…' : 'Guardar alterações'} <ArrowRight size={15} /></button>
        </form>}
        {!loading && !profile && <div className="error-message" role="alert">{errorMessage || 'O perfil não está disponível.'}</div>}
      </section>
    </div>
  )
}