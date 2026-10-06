import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { useActiveSection } from '../../hooks/useActiveSection'
import { ease, swap } from '../../lib/motion'
import { ThemeToggle } from './ThemeToggle'
import './Header.css'

const NAV_ITEMS = [
  { hash: 'sobre', label: 'Sobre' },
  { hash: 'projetos', label: 'Projetos' },
  { hash: 'contato', label: 'Contato' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const [lastLocation, setLastLocation] = useState(location)
  const panelId = useId()
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  const onHome = location.pathname === '/'
  const sectionInView = useActiveSection(
    NAV_ITEMS.map((item) => item.hash),
    onHome,
  )
  // Nas páginas de projeto, o marcador fica em "Projetos".
  const active = onHome ? sectionInView : location.pathname.startsWith('/projetos/') ? 'projetos' : null

  // Fecha o menu sempre que a rota ou a âncora mudar.
  if (location !== lastLocation) {
    setLastLocation(location)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    firstLinkRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  // Fecha quando o foco sai do cabeçalho (Tab depois do último link).
  const onBlur = (event: React.FocusEvent) => {
    if (open && !headerRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false)
  }

  return (
    // layoutRoot: o cabeçalho é fixo, então o marcador não deve somar a rolagem da página.
    <motion.header className="header" ref={headerRef} onBlur={onBlur} layoutRoot>
      <div className="container header__inner">
        <Link to="/" className="header__brand" aria-label="Carlos Alberto, página inicial">
          Carlos<span aria-hidden="true">.</span>
        </Link>

        <nav aria-label="Principal" className="header__nav">
          <ul role="list" className="header__links">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.hash
              return (
                <li key={item.hash}>
                  <Link
                    to={{ pathname: '/', hash: item.hash }}
                    className="header__link"
                    data-active={isActive}
                    aria-current={isActive ? 'location' : undefined}
                  >
                    {/* Marcador que desliza até a seção visível (referência: "Tabs sliding"). */}
                    {isActive && (
                      <motion.span
                        layoutId="header-pill"
                        className="header__pill"
                        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                      />
                    )}
                    <span className="header__link-text">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="header__actions">
          <ThemeToggle />
          <button
            ref={toggleRef}
            type="button"
            className="header__toggle"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={open ? 'fechar' : 'menu'} className="header__toggle-label" {...swap}>
                {open ? 'Fechar' : 'Menu'}
              </motion.span>
            </AnimatePresence>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={open ? 'x' : 'menu-icon'} className="header__toggle-icon" {...swap}>
                {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Painel do celular: abre e fecha animado, links em sequência (referência: "Panel reveal"). */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id={panelId}
            aria-label="Principal (celular)"
            className="header__panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.18, ease } }}
            transition={{ duration: 0.28, ease }}
          >
            {/* O container fica numa div: a regra ul[role=list] zera o padding de um ul. */}
            <div className="container">
              <motion.ul
                role="list"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.045, delayChildren: 0.04 } } }}
              >
                {NAV_ITEMS.map((item, index) => (
                  <motion.li
                    key={item.hash}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease } },
                    }}
                  >
                    <Link
                      ref={index === 0 ? firstLinkRef : undefined}
                      to={{ pathname: '/', hash: item.hash }}
                      className="header__panel-link"
                      aria-current={active === item.hash ? 'location' : undefined}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
