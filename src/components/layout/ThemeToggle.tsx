import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Moon, Sun } from 'lucide-react'
import { swap } from '../../lib/motion'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'carlos-theme'
const THEME_COLOR: Record<Theme, string> = { light: '#F4F1EA', dark: '#121110' }

const readTheme = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
}

function savedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

/**
 * Botão de modo claro e escuro. O tema inicial vem do script em index.html
 * (preferência salva ou, sem ela, a do sistema).
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(readTheme)
  const reduceMotion = useReducedMotion()

  // Sem preferência salva, acompanha a mudança de tema do sistema.
  useEffect(() => {
    const query = matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (savedTheme()) return
      const next: Theme = query.matches ? 'dark' : 'light'
      applyTheme(next)
      setTheme(next)
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Sem armazenamento (aba privada, bloqueio): o tema vale só nesta visita.
    }
    const change = () => {
      applyTheme(next)
      flushSync(() => setTheme(next))
    }
    // Troca com fade suave onde o navegador tem View Transitions; sem movimento reduzido.
    if (!reduceMotion && 'startViewTransition' in document) document.startViewTransition(change)
    else change()
  }

  const dark = theme === 'dark'
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-pressed={dark}
      aria-label="Modo escuro"
      title={dark ? 'Mudar para o modo claro' : 'Mudar para o modo escuro'}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={theme} className="theme-toggle__icon" {...swap}>
          {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
