import { getDesign, STYLES, LAYOUTS } from '../../utils/themes'
import { ThemeProvider } from '../../context/ThemeContext'

// ── Helpers ───────────────────────────────────────────────────────────────────

function pageBg(design) {
  if (design.style === 'glass') {
    return {
      background: `linear-gradient(135deg,
        ${design.theme.color}22 0%,
        ${design.theme.colorDark}44 50%,
        ${design.theme.colorLight} 100%)`,
    }
  }
  if (design.style === 'dark') return { backgroundColor: '#0f172a' }
  return { backgroundColor: design.theme.colorLight }
}

// ── Mock field ────────────────────────────────────────────────────────────────

function MockInput({ label, value, focused, isSelect }) {
  return (
    <div className="space-y-1">
      <label className="label-base !mb-0 !text-xs">{label}</label>
      {isSelect ? (
        <select disabled className="input-base !py-1.5 !text-xs bg-white pointer-events-none">
          <option>Select…</option>
        </select>
      ) : (
        <input
          readOnly
          defaultValue={value}
          className="input-base !py-1.5 !text-xs pointer-events-none"
          style={focused ? {
            borderColor: 'var(--theme-color)',
            boxShadow: '0 0 0 2px var(--theme-color-ring)',
          } : undefined}
        />
      )}
    </div>
  )
}

// ── Mock form card ────────────────────────────────────────────────────────────

function MockCard({ style, theme, children, footer }) {
  if (style === 'bold') {
    return (
      <div className="form-card overflow-hidden shadow-md">
        <div className="px-4 py-3" style={{ backgroundColor: theme.color }}>
          <div className="h-2 w-2/3 rounded-sm bg-white/50" />
          <div className="mt-1 h-1.5 w-1/3 rounded-sm bg-white/30" />
        </div>
        <div className="space-y-3 bg-white px-4 py-4">
          {children}
          {footer && <div className="pt-1">{footer}</div>}
        </div>
      </div>
    )
  }

  if (style === 'minimal') {
    return (
      <div className="space-y-3 px-1">
        {children}
        {footer && <div className="pt-1">{footer}</div>}
      </div>
    )
  }

  // modern | glass | dark
  return (
    <div className="form-card border border-gray-200 bg-white px-4 py-4 shadow-sm space-y-3">
      {children}
      {footer && <div className="pt-1">{footer}</div>}
    </div>
  )
}

// ── Classic layout content ────────────────────────────────────────────────────

function ClassicContent() {
  return (
    <>
      <MockInput label="Full Name *"      value="John Doe"        focused={false} />
      <MockInput label="Email Address"    value="john@email.com"  focused={true}  />
      <MockInput label="Subject"          isSelect />
    </>
  )
}

// ── Card layout content ───────────────────────────────────────────────────────

function CardContent({ theme }) {
  return (
    <div>
      {/* Dot progress */}
      <div className="mb-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1 rounded-full transition-all"
            style={{
              width: i === 1 ? '1.5rem' : '0.5rem',
              backgroundColor: i <= 1 ? theme.color : '#e2e8f0',
            }}
          />
        ))}
        <span className="ml-1 text-xs text-gray-400">2 / 3</span>
      </div>

      {/* Single big field */}
      <div className="mb-4">
        <p className="mb-2 text-base font-semibold text-gray-800">
          Email Address{' '}
          <span className="t-text">*</span>
        </p>
        <input
          readOnly
          defaultValue="john@email.com"
          className="input-base !text-sm pointer-events-none"
          style={{
            borderColor: theme.color,
            boxShadow: `0 0 0 2px ${theme.colorRing}`,
          }}
        />
      </div>

      {/* Card nav */}
      <div className="flex items-center gap-2">
        <button className="t-btn rounded-lg px-4 py-1.5 text-xs font-medium">OK →</button>
        <span className="text-xs text-gray-400">
          or{' '}
          <kbd className="rounded border border-gray-200 bg-gray-100 px-1 py-0.5 font-mono text-xs">
            Enter ↵
          </kbd>
        </span>
      </div>
    </div>
  )
}

// ── Main preview ──────────────────────────────────────────────────────────────

export default function DesignPreview({ settings = {}, formName = 'My Form' }) {
  const design = getDesign(settings)
  const isCard = design.layout === 'card'
  const isDark = design.style === 'dark'

  const chips = [
    design.theme.name,
    STYLES.find((s) => s.id === design.style)?.name,
    design.font.name,
    design.radius.name,
    LAYOUTS.find((l) => l.id === design.layout)?.name,
  ].filter(Boolean)

  const footer = isCard ? null : (
    <div className="flex items-center justify-between">
      <button className="rounded border border-gray-300 bg-white px-3 py-1 text-xs text-gray-500">
        ← Back
      </button>
      <button className="t-btn rounded px-3 py-1 text-xs font-medium">
        Submit
      </button>
    </div>
  )

  return (
    <div className="sticky top-20 w-80 shrink-0">

      {/* Header row */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-gray-700">Live Preview</p>
        <div className="flex flex-wrap gap-1">
          {chips.map((c) => (
            <span key={c} className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600 font-medium">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Browser frame */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-xl">

        {/* Chrome bar */}
        <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-100 px-3 py-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 truncate rounded-md bg-white px-2 py-0.5 text-center text-xs text-gray-400">
            yoursite.com/share/…
          </div>
        </div>

        {/* Page area */}
        <div
          style={{ ...pageBg(design), minHeight: '420px' }}
          className="p-4 transition-colors duration-300"
        >
          <ThemeProvider design={design}>

            {/* Form title */}
            <p className={`mb-3 text-center text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {formName || 'My Form'}
            </p>

            {/* Progress bar */}
            <div className="mb-4">
              <div className={`mb-1 flex justify-between text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                <span>Step 1 of 2</span>
                <span>50%</span>
              </div>
              <div className={`h-1.5 w-full overflow-hidden rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div className="t-progress-fill h-full w-1/2 rounded-full transition-all duration-500" />
              </div>
            </div>

            {/* Form card */}
            <MockCard style={design.style} theme={design.theme} footer={footer}>
              {isCard
                ? <CardContent theme={design.theme} />
                : <ClassicContent />
              }
            </MockCard>

            {/* Powered by */}
            <p className={`mt-3 text-center text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              Powered by{' '}
              <span className="t-text font-medium">Dynamic Form</span>
            </p>

          </ThemeProvider>
        </div>
      </div>

      {/* Instruction hint */}
      <p className="mt-2 text-center text-xs text-gray-400">
        Updates live as you change settings
      </p>
    </div>
  )
}
