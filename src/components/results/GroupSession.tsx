/**
 * @file src/components/results/GroupSession.tsx
 * @description Group session UI shown on quiz result pages.
 * Lets the organizer create a session or participants join an existing one.
 * Only rendered for category === 'quiz'.
 */
'use client'

import React from 'react'
import { trackEvent } from '@/config/analytics'

// ── UI strings ────────────────────────────────────────────────────────────────

const UI: Record<string, {
  createBtn: string
  joinBtn: string
  creating: string
  joining: string
  codePlaceholder: string
  namePlaceholder: string
  confirm: string
  cancel: string
  shareText: string
  shareBtn: string
  copyCode: string
  copied: string
  joinedTitle: string
  joinedBody: string
  viewGroup: string
  notFound: string
  error: string
  codeLabel: string
  expires: string
}> = {
  es: {
    createBtn:       'Comparar con mi grupo',
    joinBtn:         'Unirme al grupo',
    creating:        'Creando sesión…',
    joining:         'Uniéndome…',
    codePlaceholder: 'Código del grupo (ej: APE-7K3)',
    namePlaceholder: 'Tu nombre o apodo (opcional)',
    confirm:         'Confirmar',
    cancel:          'Cancelar',
    shareText:       '¿Cuál es tu estilo de apego? Haz el test y compáralo con el grupo →',
    shareBtn:        'Compartir por WhatsApp',
    copyCode:        'Copiar código',
    copied:          '¡Copiado!',
    joinedTitle:     '¡Te has unido al grupo!',
    joinedBody:      'Tu resultado ya está en la sesión.',
    viewGroup:       'Ver resultados del grupo →',
    notFound:        'Código no encontrado o sesión expirada',
    error:           'Error al conectar. Inténtalo de nuevo.',
    codeLabel:       'Código de sesión',
    expires:         'Expira en 24h',
  },
  en: {
    createBtn:       'Compare with my group',
    joinBtn:         'Join a group',
    creating:        'Creating session…',
    joining:         'Joining…',
    codePlaceholder: 'Group code (e.g. APE-7K3)',
    namePlaceholder: 'Your name or nickname (optional)',
    confirm:         'Confirm',
    cancel:          'Cancel',
    shareText:       'What\'s your attachment style? Take the test and compare with the group →',
    shareBtn:        'Share via WhatsApp',
    copyCode:        'Copy code',
    copied:          'Copied!',
    joinedTitle:     'You\'ve joined the group!',
    joinedBody:      'Your result is now in the session.',
    viewGroup:       'View group results →',
    notFound:        'Code not found or session expired',
    error:           'Connection error. Please try again.',
    codeLabel:       'Session code',
    expires:         'Expires in 24h',
  },
  pt: {
    createBtn:       'Comparar com meu grupo',
    joinBtn:         'Entrar no grupo',
    creating:        'Criando sessão…',
    joining:         'Entrando…',
    codePlaceholder: 'Código do grupo (ex: APE-7K3)',
    namePlaceholder: 'Seu nome ou apelido (opcional)',
    confirm:         'Confirmar',
    cancel:          'Cancelar',
    shareText:       'Qual é o seu estilo de apego? Faça o teste e compare com o grupo →',
    shareBtn:        'Compartilhar pelo WhatsApp',
    copyCode:        'Copiar código',
    copied:          'Copiado!',
    joinedTitle:     'Você entrou no grupo!',
    joinedBody:      'Seu resultado já está na sessão.',
    viewGroup:       'Ver resultados do grupo →',
    notFound:        'Código não encontrado ou sessão expirada',
    error:           'Erro de conexão. Tente novamente.',
    codeLabel:       'Código da sessão',
    expires:         'Expira em 24h',
  },
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface GroupSessionProps {
  lang: string
  testId: string
  testName: string
  token: string       // encoded answers token from the share URL
  shareUrl: string    // full result URL (for sharing)
}

type Mode = 'idle' | 'create' | 'join' | 'created' | 'joined'

// ── Component ─────────────────────────────────────────────────────────────────

export default function GroupSession({ lang, testId, testName, token, shareUrl }: GroupSessionProps) {
  const ui = UI[lang] ?? UI['es']
  const [mode,    setMode]    = React.useState<Mode>('idle')
  const [code,    setCode]    = React.useState('')
  const [name,    setName]    = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error,   setError]   = React.useState('')
  const [copied,  setCopied]  = React.useState(false)
  const [created, setCreated] = React.useState<{ code: string; groupUrl: string } | null>(null)

  // ── Create group ────────────────────────────────────────────────────────────

  const handleCreate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId, lang }),
      })
      const data = await res.json() as { code?: string; error?: string }
      if (!res.ok || !data.code) throw new Error(data.error ?? 'error')

      // Auto-join the organizer
      const groupUrl = `${window.location.origin}/${lang}/grupo/${testId}?code=${data.code}`
      await fetch('/api/group/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: data.code, name: name.trim() || '', token }),
      })

      setCreated({ code: data.code, groupUrl })
      setMode('created')
      trackEvent('group_created', { testId, lang })
    } catch {
      setError(ui.error)
    } finally {
      setLoading(false)
    }
  }

  // ── Join group ──────────────────────────────────────────────────────────────

  const handleJoin = async () => {
    const cleanCode = code.trim().toUpperCase()
    if (!cleanCode) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/group/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode, name: name.trim() || '', token }),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok) {
        setError(res.status === 404 ? ui.notFound : (data.error ?? ui.error))
        setLoading(false)
        return
      }
      setCreated({
        code: cleanCode,
        groupUrl: `${window.location.origin}/${lang}/grupo/${testId}?code=${cleanCode}`,
      })
      setMode('joined')
      trackEvent('group_joined', { testId, lang })
    } catch {
      setError(ui.error)
    } finally {
      setLoading(false)
    }
  }

  // ── Share ───────────────────────────────────────────────────────────────────

  const handleShare = () => {
    if (!created) return
    const joinLink = `${window.location.origin}/${lang}/test/${testId}/play?grupo=${created.code}`
    const text = `${ui.shareText} ${joinLink}\n\n_Código: ${created.code}_`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
    trackEvent('group_shared_whatsapp', { testId, code: created.code })
  }

  const handleCopyCode = async () => {
    if (!created) return
    await navigator.clipboard.writeText(created.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Idle ────────────────────────────────────────────────────────────────────

  if (mode === 'idle') {
    return (
      <div className="flex gap-2 flex-wrap justify-center mt-4">
        <button
          type="button"
          onClick={() => setMode('create')}
          className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition active:opacity-80"
          style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', backgroundColor: 'transparent' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
          </svg>
          {ui.createBtn}
        </button>
        <button
          type="button"
          onClick={() => setMode('join')}
          className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition active:opacity-80"
          style={{ borderColor: 'var(--color-lightGray)', color: 'var(--color-text)' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" aria-hidden="true">
            <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/>
          </svg>
          {ui.joinBtn}
        </button>
      </div>
    )
  }

  // ── Create / Join form ──────────────────────────────────────────────────────

  if (mode === 'create' || mode === 'join') {
    return (
      <div className="mt-4 rounded-xl border bg-white p-4 space-y-3" style={{ borderColor: 'var(--color-lightGray)' }}>
        {mode === 'join' && (
          <input
            type="text"
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setError('') }}
            placeholder={ui.codePlaceholder}
            className="w-full rounded-lg border px-3 py-2 text-sm font-mono tracking-widest outline-none focus:ring-2"
            style={{ borderColor: 'var(--color-lightGray)' }}
            maxLength={8}
          />
        )}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={ui.namePlaceholder}
          className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
          style={{ borderColor: 'var(--color-lightGray)' }}
          maxLength={30}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setMode('idle'); setError('') }}
            className="flex-1 rounded-lg border px-3 py-2 text-sm transition"
            style={{ borderColor: 'var(--color-lightGray)', color: '#6b7280' }}
          >
            {ui.cancel}
          </button>
          <button
            type="button"
            onClick={mode === 'create' ? handleCreate : handleJoin}
            disabled={loading || (mode === 'join' && !code.trim())}
            className="flex-1 rounded-lg px-3 py-2 text-sm font-semibold text-white transition disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {loading ? (mode === 'create' ? ui.creating : ui.joining) : ui.confirm}
          </button>
        </div>
      </div>
    )
  }

  // ── Created / Joined ────────────────────────────────────────────────────────

  if ((mode === 'created' || mode === 'joined') && created) {
    return (
      <div className="mt-4 rounded-xl border bg-white p-4 space-y-3" style={{ borderColor: 'var(--color-lightGray)' }}>
        <div className="text-center">
          <p className="font-semibold text-sm" style={{ color: 'var(--color-primary)' }}>
            {mode === 'created' ? '✓ ' : ''}{mode === 'created' ? ui.codeLabel : ui.joinedTitle}
          </p>
          {mode === 'created' && (
            <>
              <p className="font-mono text-3xl font-bold tracking-widest mt-1" style={{ color: 'var(--color-primary)' }}>
                {created.code}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{ui.expires}</p>
            </>
          )}
          {mode === 'joined' && (
            <p className="text-sm text-gray-500 mt-1">{ui.joinedBody}</p>
          )}
        </div>

        {mode === 'created' && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition"
              style={{ backgroundColor: '#25D366' }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {ui.shareBtn}
            </button>
            <button
              type="button"
              onClick={handleCopyCode}
              className="rounded-xl border px-3 py-2.5 text-sm transition"
              style={{ borderColor: 'var(--color-lightGray)', color: copied ? '#16a34a' : '#6b7280' }}
            >
              {copied ? ui.copied : ui.copyCode}
            </button>
          </div>
        )}

        <a
          href={created.groupUrl}
          className="block text-center text-sm font-medium underline underline-offset-2"
          style={{ color: 'var(--color-primary)' }}
        >
          {ui.viewGroup}
        </a>
      </div>
    )
  }

  return null
}
