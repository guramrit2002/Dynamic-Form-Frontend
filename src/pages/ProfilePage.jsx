import { useEffect, useState } from 'react'
import { useAuth }    from '../context/AuthContext'
import client         from '../api/client'
import Badge          from '../components/ui/Badge'
import Button         from '../components/ui/Button'
import Spinner        from '../components/ui/Spinner'
import NavBar         from '../components/NavBar'

// ── Helpers ──────────────────────────────────────────────────────────────────

function Avatar({ name, username }) {
  const letter = (name || username || '?')[0].toUpperCase()
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white shadow">
      {letter}
    </div>
  )
}

// ── Account form ──────────────────────────────────────────────────────────────

function AccountTab({ user, profile, onSaved }) {
  const [form, setForm]       = useState({
    first_name: user.first_name ?? '',
    last_name:  user.last_name  ?? '',
    email:      user.email      ?? '',
    bio:        profile.bio     ?? '',
  })
  const [saving,   setSaving]   = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      await Promise.all([
        client.patch('/user/me/', {
          first_name: form.first_name,
          last_name:  form.last_name,
          email:      form.email,
        }),
        client.patch('/user/me/profile/', { bio: form.bio }),
      ])
      setSuccess(true)
      onSaved()
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="max-w-lg space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-base">First Name</label>
          <input value={form.first_name} onChange={(e) => setForm(f => ({ ...f, first_name: e.target.value }))}
            className="input-base" placeholder="First name" />
        </div>
        <div>
          <label className="label-base">Last Name</label>
          <input value={form.last_name} onChange={(e) => setForm(f => ({ ...f, last_name: e.target.value }))}
            className="input-base" placeholder="Last name" />
        </div>
      </div>

      <div>
        <label className="label-base">Email</label>
        <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
          className="input-base" placeholder="you@example.com" />
      </div>

      <div>
        <label className="label-base">Bio</label>
        <textarea value={form.bio} onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))}
          rows={3} className="input-base resize-none" placeholder="Tell us a little about yourself…" />
      </div>

      {error   && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}
      {success && <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">Changes saved successfully.</p>}

      <Button type="submit" disabled={saving}>
        {saving && <Spinner className="h-4 w-4" />}
        Save Changes
      </Button>
    </form>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { logout }        = useAuth()

  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  function loadUser() {
    return Promise.all([
      client.get('/user/me/'),
      client.get('/user/me/profile/'),
      client.get('/user/dashboard/'),
    ]).then(([u, p, d]) => {
      setUser(u.data)
      setProfile(p.data)
      setStats(d.data.stats)
    })
  }

  useEffect(() => {
    loadUser().finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Spinner className="h-8 w-8 text-indigo-600" />
    </div>
  )

  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username

  return (
    <div className="min-h-screen bg-gray-50">

      <NavBar active="profile" onLogout={logout} maxWidth="max-w-4xl" />

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">

        {/* ── Profile card ── */}
        <div className="mb-8 flex items-center gap-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <Avatar name={user?.first_name} username={user?.username} />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="mt-0.5 text-xs text-gray-400">@{user?.username}</p>
            {profile?.bio && (
              <p className="mt-2 text-sm text-gray-600">{profile.bio}</p>
            )}
          </div>
          {stats && (
            <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{stats.total_forms}</span> forms
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{stats.total_submissions}</span> submissions
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{stats.published_forms}</span> published
              </p>
            </div>
          )}
        </div>

        {/* ── Account form ── */}
        {user && profile && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-semibold text-gray-800">Account Settings</h2>
            <AccountTab user={user} profile={profile} onSaved={loadUser} />
          </div>
        )}

      </main>
    </div>
  )
}
