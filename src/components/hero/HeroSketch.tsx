import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ease } from '../../lib/motion'

/**
 * Desenho em traço fino que se forma sozinho, em loop: uma ideia (lâmpada) vira
 * produto (caixa) e depois sistema (painel com gráfico). Cada traço é desenhado com
 * pathLength do Motion. Pausa fora da tela e com a aba oculta. Com movimento
 * reduzido, mostra o último desenho parado.
 */

interface Stroke {
  d: string
  accent?: boolean
}

interface Drawing {
  label: string
  strokes: Stroke[]
}

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0`

const DRAWINGS: Drawing[] = [
  {
    label: 'ideia',
    strokes: [
      { d: 'M48 74 C40 68 34 59 34 48 C34 33 46 22 60 22 C74 22 86 33 86 48 C86 59 80 68 72 74 C70 76 69 79 69 82 L51 82 C51 79 50 76 48 74 Z' },
      { d: 'M53 74 V65 L57 57 L60 63 L63 57 L67 65 V74', accent: true },
      { d: 'M51 89 H69' },
      { d: 'M54 96 H66' },
      { d: 'M60 6 V12 M26 17 L30 21 M94 17 L90 21 M16 48 H22 M98 48 H104' },
    ],
  },
  {
    label: 'produto',
    strokes: [
      { d: 'M60 20 L97 41 V82 L60 103 L23 82 V41 Z' },
      { d: 'M23 41 L60 62 L97 41' },
      { d: 'M60 62 V103' },
      { d: 'M41.5 30.5 L78.5 51.5 V64', accent: true },
    ],
  },
  {
    label: 'sistema',
    strokes: [
      { d: 'M28 24 H92 Q98 24 98 30 V90 Q98 96 92 96 H28 Q22 96 22 90 V30 Q22 24 28 24 Z' },
      { d: 'M22 37 H98' },
      { d: `${circle(30, 30.5, 1.8)} ${circle(37, 30.5, 1.8)} ${circle(44, 30.5, 1.8)}` },
      { d: 'M32 84 H88' },
      { d: 'M32 76 L45 63 L57 69 L71 51 L88 58', accent: true },
    ],
  },
]

const DRAW_AND_HOLD = 3200

function useActive(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(true)
  const [pageVisible, setPageVisible] = useState(true)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    observer.observe(element)
    const onVisibility = () => setPageVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [ref])
  return inView && pageVisible
}

export function HeroSketch() {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const active = useActive(ref)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduceMotion || !active) return
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % DRAWINGS.length), DRAW_AND_HOLD)
    return () => window.clearTimeout(timer)
  }, [index, active, reduceMotion])

  const drawing = reduceMotion ? DRAWINGS[DRAWINGS.length - 1] : DRAWINGS[index]

  return (
    <div className="sketch" ref={ref} aria-hidden="true">
      <AnimatePresence mode="wait" initial={!reduceMotion}>
        <motion.svg
          key={drawing.label}
          className="sketch__svg"
          viewBox="0 0 120 120"
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
          exit="exit"
        >
          {drawing.strokes.map((stroke, i) => (
            <motion.path
              key={i}
              d={stroke.d}
              className={stroke.accent ? 'sketch__stroke is-accent' : 'sketch__stroke'}
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: {
                  pathLength: 1,
                  opacity: 1,
                  transition: {
                    pathLength: { duration: 0.9, delay: i * 0.14, ease: [0.65, 0, 0.35, 1] },
                    opacity: { duration: 0.01, delay: i * 0.14 },
                  },
                },
                exit: { pathLength: 0, opacity: 0, transition: { duration: 0.4, ease } },
              }}
            />
          ))}
        </motion.svg>
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={drawing.label}
          className="sketch__label"
          initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
          transition={{ duration: 0.25, ease }}
        >
          {drawing.label}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
