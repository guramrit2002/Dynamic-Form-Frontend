import { THEMES, STYLES, FONTS, RADII, LAYOUTS } from '../../utils/themes'

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, description, children }) {
  return (
    <div className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      {description && <p className="mt-0.5 text-xs text-gray-400">{description}</p>}
      <div className="mt-4">{children}</div>
    </div>
  )
}

// ── Style preview mini-cards ──────────────────────────────────────────────────

function StylePreview({ id, color }) {
  const w = 'w-full h-full rounded-sm bg-white'
  if (id === 'modern') return (
    <div className="flex h-14 flex-col rounded border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex-1 p-1.5">
        <div className="mb-1 h-1.5 w-3/4 rounded bg-gray-200" />
        <div className="h-4 rounded border border-gray-200" />
      </div>
      <div className="flex justify-end border-t border-gray-100 px-2 py-1">
        <div className="h-3 w-8 rounded-sm" style={{ backgroundColor: color }} />
      </div>
    </div>
  )
  if (id === 'minimal') return (
    <div className="flex h-14 flex-col rounded bg-transparent overflow-hidden p-1">
      <div className="mb-1.5 h-1.5 w-2/3 rounded bg-gray-300" />
      <div className="h-4 rounded border-b-2 border-gray-300 bg-transparent" />
      <div className="mt-auto flex justify-end">
        <div className="h-3 w-8 rounded-sm" style={{ backgroundColor: color }} />
      </div>
    </div>
  )
  if (id === 'bold') return (
    <div className="flex h-14 flex-col rounded overflow-hidden border border-gray-200 shadow-sm">
      <div className="px-2 py-1.5" style={{ backgroundColor: color }}>
        <div className="h-1.5 w-1/2 rounded bg-white/50" />
      </div>
      <div className="flex-1 bg-white p-1.5">
        <div className="h-3.5 rounded border border-gray-200" />
      </div>
    </div>
  )
  if (id === 'glass') return (
    <div
      className="relative flex h-14 flex-col overflow-hidden rounded border border-white/40 shadow-sm"
      style={{ background: `linear-gradient(135deg, ${color}33, ${color}11)` }}
    >
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
      <div className="relative flex-1 p-1.5">
        <div className="mb-1 h-1.5 w-2/3 rounded bg-gray-400/50" />
        <div className="h-3.5 rounded border border-white/50 bg-white/40" />
      </div>
    </div>
  )
  if (id === 'dark') return (
    <div className="flex h-14 flex-col rounded overflow-hidden border border-gray-700 bg-gray-900 shadow-sm">
      <div className="flex-1 p-1.5">
        <div className="mb-1 h-1.5 w-2/3 rounded bg-gray-600" />
        <div className="h-3.5 rounded border border-gray-700 bg-gray-800" />
      </div>
      <div className="flex justify-end border-t border-gray-700 px-2 py-1">
        <div className="h-3 w-8 rounded-sm" style={{ backgroundColor: color }} />
      </div>
    </div>
  )
  return null
}

// ── Layout preview ────────────────────────────────────────────────────────────

function LayoutPreview({ id }) {
  if (id === 'classic') return (
    <div className="flex h-14 flex-col gap-1 rounded border border-gray-200 bg-white p-2 shadow-sm">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-2 w-full rounded bg-gray-100" style={{ width: `${100 - i * 15}%` }} />
      ))}
    </div>
  )
  return (
    <div className="flex h-14 flex-col items-center justify-center rounded border border-gray-200 bg-white p-2 shadow-sm gap-1">
      <div className="h-2 w-3/4 rounded bg-gray-100" />
      <div className="h-4 w-full rounded border border-gray-200" />
      <div className="flex gap-1 self-end">
        <div className="h-2 w-6 rounded bg-gray-200" />
        <div className="h-2 w-6 rounded bg-indigo-400" />
      </div>
    </div>
  )
}

// ── Selectable option card ────────────────────────────────────────────────────

function OptionCard({ active, onClick, children, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl border-2 p-1 transition focus:outline-none
        ${active ? 'border-indigo-600 shadow-md' : 'border-gray-200 hover:border-gray-300'}
        ${className}`}
    >
      {children}
      {active && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white shadow">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </button>
  )
}

// ── Main design panel ─────────────────────────────────────────────────────────

export default function ThemePicker({ current, onChange }) {
  const settings = current ?? {}

  function set(key, value) {
    onChange({ ...settings, [key]: value })
  }

  const activeTheme = THEMES.find((t) => t.id === (settings.theme ?? 'indigo')) ?? THEMES[0]

  return (
    <div className="max-w-2xl space-y-8">

      {/* ── Color theme ── */}
      <Section title="Colour" description="Primary colour used for buttons, progress bar, and accents.">
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {THEMES.map((theme) => {
            const active = (settings.theme ?? 'indigo') === theme.id
            return (
              <button
                key={theme.id}
                onClick={() => set('theme', theme.id)}
                title={theme.name}
                className="group flex flex-col items-center gap-1.5"
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition
                    ${active ? 'ring-2 ring-offset-2 ring-gray-800 scale-110' : 'hover:scale-105'}`}
                  style={{ backgroundColor: theme.color }}
                >
                  {active && (
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className="text-xs text-gray-500">{theme.name}</span>
              </button>
            )
          })}
        </div>
      </Section>

      {/* ── Style ── */}
      <Section title="Style" description="Overall appearance of the form card.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {STYLES.map((style) => {
            const active = (settings.style ?? 'modern') === style.id
            return (
              <OptionCard key={style.id} active={active} onClick={() => set('style', style.id)}>
                <StylePreview id={style.id} color={activeTheme.color} />
                <p className={`mt-1.5 text-center text-xs font-medium ${active ? 'text-indigo-700' : 'text-gray-500'}`}>
                  {style.name}
                </p>
              </OptionCard>
            )
          })}
        </div>
      </Section>

      {/* ── Layout ── */}
      <Section title="Layout" description="How fields are presented to the respondent.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {LAYOUTS.map((layout) => {
            const active = (settings.layout ?? 'classic') === layout.id
            return (
              <OptionCard key={layout.id} active={active} onClick={() => set('layout', layout.id)}>
                <LayoutPreview id={layout.id} />
                <div className="mt-1.5 px-1 pb-1">
                  <p className={`text-xs font-medium ${active ? 'text-indigo-700' : 'text-gray-600'}`}>{layout.name}</p>
                  <p className="text-xs text-gray-400 leading-snug">{layout.desc}</p>
                </div>
              </OptionCard>
            )
          })}
        </div>
      </Section>

      {/* ── Font ── */}
      <Section title="Font" description="Typeface used throughout the form.">
        <div className="flex gap-3">
          {FONTS.map((font) => {
            const active = (settings.font ?? 'sans') === font.id
            return (
              <OptionCard key={font.id} active={active} onClick={() => set('font', font.id)} className="flex-1">
                <div className="flex flex-col items-center gap-1 py-2">
                  <span
                    className="text-3xl font-semibold leading-none text-gray-700"
                    style={{ fontFamily: font.family }}
                  >
                    Ag
                  </span>
                  <span className={`text-xs font-medium ${active ? 'text-indigo-700' : 'text-gray-500'}`}>
                    {font.name}
                  </span>
                </div>
              </OptionCard>
            )
          })}
        </div>
      </Section>

      {/* ── Border radius ── */}
      <Section title="Shape" description="Corner radius of input fields and the form card.">
        <div className="flex gap-3">
          {RADII.map((r) => {
            const active = (settings.radius ?? 'rounded') === r.id
            return (
              <OptionCard key={r.id} active={active} onClick={() => set('radius', r.id)} className="flex-1">
                <div className="flex flex-col items-center gap-2 py-3">
                  <div
                    className="h-8 w-16 border-2 border-gray-300 bg-gray-50"
                    style={{ borderRadius: r.inputRadius }}
                  />
                  <span className={`text-xs font-medium ${active ? 'text-indigo-700' : 'text-gray-500'}`}>
                    {r.name}
                  </span>
                </div>
              </OptionCard>
            )
          })}
        </div>
      </Section>

    </div>
  )
}
