import { createContext, useContext } from 'react'
import { DEFAULT_DESIGN } from '../utils/themes'

const DesignContext = createContext(DEFAULT_DESIGN)

export function ThemeProvider({ design, children }) {
  const vars = {
    '--theme-color':       design.theme.color,
    '--theme-color-dark':  design.theme.colorDark,
    '--theme-color-light': design.theme.colorLight,
    '--theme-color-text':  design.theme.colorText,
    '--theme-color-ring':  design.theme.colorRing,
    '--input-radius':      design.radius.inputRadius,
    '--card-radius':       design.radius.cardRadius,
    '--font-family':       design.font.family,
  }

  return (
    <DesignContext.Provider value={design}>
      <div data-theme data-style={design.style} style={vars}>
        {children}
      </div>
    </DesignContext.Provider>
  )
}

export function useDesign() {
  return useContext(DesignContext)
}

// Convenience alias
export const useTheme = useDesign
