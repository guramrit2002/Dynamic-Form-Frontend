// ── Color themes ──────────────────────────────────────────────────────────────

export const THEMES = [
  { id: 'indigo', name: 'Indigo', color: '#4f46e5', colorDark: '#4338ca', colorLight: '#eef2ff', colorText: '#3730a3', colorRing: 'rgba(99,102,241,0.3)' },
  { id: 'blue',   name: 'Ocean',  color: '#0284c7', colorDark: '#0369a1', colorLight: '#e0f2fe', colorText: '#075985', colorRing: 'rgba(14,165,233,0.3)' },
  { id: 'teal',   name: 'Teal',   color: '#0d9488', colorDark: '#0f766e', colorLight: '#ccfbf1', colorText: '#115e59', colorRing: 'rgba(20,184,166,0.3)' },
  { id: 'green',  name: 'Forest', color: '#16a34a', colorDark: '#15803d', colorLight: '#dcfce7', colorText: '#166534', colorRing: 'rgba(34,197,94,0.3)' },
  { id: 'orange', name: 'Sunset', color: '#ea580c', colorDark: '#c2410c', colorLight: '#fff7ed', colorText: '#9a3412', colorRing: 'rgba(249,115,22,0.3)' },
  { id: 'rose',   name: 'Rose',   color: '#e11d48', colorDark: '#be123c', colorLight: '#fff1f2', colorText: '#9f1239', colorRing: 'rgba(244,63,94,0.3)' },
  { id: 'violet', name: 'Violet', color: '#7c3aed', colorDark: '#6d28d9', colorLight: '#ede9fe', colorText: '#5b21b6', colorRing: 'rgba(139,92,246,0.3)' },
  { id: 'slate',  name: 'Slate',  color: '#475569', colorDark: '#334155', colorLight: '#f1f5f9', colorText: '#1e293b', colorRing: 'rgba(100,116,139,0.3)' },
]

export const DEFAULT_THEME = THEMES[0]

export function getTheme(id) {
  return THEMES.find((t) => t.id === id) ?? DEFAULT_THEME
}

// ── Style presets ─────────────────────────────────────────────────────────────

export const STYLES = [
  { id: 'modern',  name: 'Modern',  desc: 'Clean white card with subtle shadow' },
  { id: 'minimal', name: 'Minimal', desc: 'No card — fields float on the background' },
  { id: 'bold',    name: 'Bold',    desc: 'Coloured header, white body' },
  { id: 'glass',   name: 'Glass',   desc: 'Frosted glass effect on a gradient page' },
  { id: 'dark',    name: 'Dark',    desc: 'Dark card with light text' },
]

// ── Font families ─────────────────────────────────────────────────────────────

export const FONTS = [
  { id: 'sans',  name: 'Sans',  sample: 'Ag', family: 'Inter, ui-sans-serif, system-ui, sans-serif' },
  { id: 'serif', name: 'Serif', sample: 'Ag', family: 'Georgia, ui-serif, serif' },
  { id: 'mono',  name: 'Mono',  sample: 'Ag', family: '"Courier New", ui-monospace, monospace' },
]

// ── Border radius ─────────────────────────────────────────────────────────────

export const RADII = [
  { id: 'sharp',   name: 'Sharp',   inputRadius: '0',       cardRadius: '0' },
  { id: 'rounded', name: 'Rounded', inputRadius: '0.5rem',  cardRadius: '0.75rem' },
  { id: 'pill',    name: 'Pill',    inputRadius: '9999px',  cardRadius: '1.5rem' },
]

// ── Layouts ───────────────────────────────────────────────────────────────────

export const LAYOUTS = [
  { id: 'classic', name: 'Classic', desc: 'All fields visible at once' },
  { id: 'card',    name: 'Card',    desc: 'One field at a time (Typeform-style)' },
]

// ── Resolve full design from schema.settings ──────────────────────────────────

export function getDesign(settings = {}) {
  return {
    theme:  getTheme(settings.theme),
    style:  settings.style  ?? 'modern',
    font:   FONTS.find((f) => f.id === settings.font)     ?? FONTS[0],
    radius: RADII.find((r) => r.id === settings.radius)   ?? RADII[1],
    layout: settings.layout ?? 'classic',
  }
}

export const DEFAULT_DESIGN = getDesign({})
