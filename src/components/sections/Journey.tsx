import { useEffect, useId, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { BriefcaseBusiness, Code, Globe, GraduationCap, Map as MapIcon, Network, Wrench, type LucideIcon } from 'lucide-react'
import type { JourneyIcon, JourneyStep } from '../../data/profile'
import { ease } from '../../lib/motion'

/**
 * Trajetória como um caminho que se constrói uma vez ao entrar na tela.
 *
 * O layout é só CSS (Journey.css): no desktop as etapas ficam lado a lado e a etapa
 * paralela sobe numa ramificação; no celular tudo desce em coluna e a etapa paralela
 * fica recuada. Depois de desenhar, o componente mede o centro de cada ponto e traça
 * por cima: a linha principal liga as etapas, e a ramificação sai antes da etapa
 * anterior à paralela, passa pelo ponto dela e volta à linha antes da seguinte.
 * Por baixo fica o trilho tracejado com o percurso inteiro; a linha desenhada por cima
 * vai do grafite ao laranja, até a atuação atual. Cada estação se acende e seu texto
 * aparece quando a linha chega até ela.
 *
 * Nada controla a rolagem e o conteúdo é uma lista comum: dá para ler e navegar
 * durante a animação. Com movimento reduzido, tudo já aparece completo.
 */

const DRAW = 2 // segundos para a linha principal ir do primeiro ao último ponto

const ICONS: Record<JourneyIcon, LucideIcon> = {
  briefcase: BriefcaseBusiness,
  graduation: GraduationCap,
  wrench: Wrench,
  network: Network,
  globe: Globe,
  code: Code,
  map: MapIcon,
}

interface Point {
  x: number
  y: number
}

interface Geometry {
  /** Primeiro e último ponto da linha principal (direção do gradiente). */
  start: Point
  end: Point
  main: string
  /** Uma ramificação por etapa paralela; from/to em frações do tempo da linha principal. */
  branches: { d: string; from: number; to: number }[]
  /** Momento (0 a 1 do desenho, ou pouco além no fim) em que cada etapa é alcançada. */
  at: number[]
}

const distance = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y)

/** Ponto a `s` pixels do início da linha que passa por `points`. */
function pointAt(points: Point[], cumulative: number[], s: number): Point {
  for (let i = 1; i < points.length; i++) {
    if (s <= cumulative[i]) {
      const t = (s - cumulative[i - 1]) / (cumulative[i] - cumulative[i - 1] || 1)
      return { x: points[i - 1].x + (points[i].x - points[i - 1].x) * t, y: points[i - 1].y + (points[i].y - points[i - 1].y) * t }
    }
  }
  return points[points.length - 1]
}

/**
 * Centro da estação em relação à área interna do container (onde o SVG é posicionado).
 * As estações nunca recebem transform (só o texto anima), então a medida é exata.
 */
function centerIn(container: HTMLElement, element: HTMLElement): Point {
  const box = container.getBoundingClientRect()
  const r = element.getBoundingClientRect()
  return {
    x: r.left - box.left - container.clientLeft + r.width / 2,
    y: r.top - box.top - container.clientTop + r.height / 2,
  }
}

function measure(container: HTMLElement, steps: JourneyStep[]): Geometry | null {
  const dots = [...container.querySelectorAll<HTMLElement>('[data-dot]')]
  if (dots.length !== steps.length) return null
  const centers = dots.map((dot) => centerIn(container, dot))

  const mainIndexes = steps.flatMap((step, i) => (step.parallel ? [] : [i]))
  const points = mainIndexes.map((i) => centers[i])
  const cumulative = points.map(() => 0)
  for (let i = 1; i < points.length; i++) cumulative[i] = cumulative[i - 1] + distance(points[i - 1], points[i])
  const total = cumulative[cumulative.length - 1] || 1

  const at = steps.map(() => 0)
  mainIndexes.forEach((stepIndex, i) => (at[stepIndex] = cumulative[i] / total))
  const main = points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')

  // Ramificações: cada etapa paralela acontece junto com a etapa principal anterior a ela
  // (a "irmã"). No meio do caminho, a ramificação sai e volta para a linha; no fim, as duas
  // etapas continuam em andamento, então ela termina no ponto da etapa paralela.
  const horizontal = points.length > 1 && Math.abs(points[0].y - points[1].y) < 1
  const fix = (p: Point) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`
  const curve = (p: Point, q: Point) =>
    horizontal
      ? `C${fix({ x: (p.x + q.x) / 2, y: p.y })} ${fix({ x: (p.x + q.x) / 2, y: q.y })} ${fix(q)}`
      : `C${fix({ x: p.x, y: (p.y + q.y) / 2 })} ${fix({ x: q.x, y: (p.y + q.y) / 2 })} ${fix(q)}`
  const branches: Geometry['branches'] = []

  steps.forEach((step, parallelIndex) => {
    if (!step.parallel) return
    let a = -1
    mainIndexes.forEach((stepIndex, i) => {
      if (stepIndex < parallelIndex) a = i
    })
    if (a < 0) return
    const node = centers[parallelIndex]
    const last = a === points.length - 1

    if (!last) {
      const b = a + 1
      let from: number
      let to: number
      if (horizontal) {
        // Lado a lado: sai no meio do trecho anterior e volta no meio do seguinte.
        from = a > 0 ? (cumulative[a - 1] + cumulative[a]) / 2 : cumulative[a]
        to = (cumulative[a] + cumulative[b]) / 2
      } else {
        // Em coluna: sai logo abaixo da etapa irmã e volta logo acima da seguinte.
        const gap = Math.min(24, (cumulative[b] - cumulative[a]) / 4)
        from = cumulative[a] + gap
        to = cumulative[b] - gap
      }
      const p = pointAt(points, cumulative, from)
      const q = pointAt(points, cumulative, to)
      branches.push({ d: `M${fix(p)} ${curve(p, node)} ${curve(node, q)}`, from: from / total, to: to / total })
      at[parallelIndex] = (from + to) / 2 / total
      return
    }

    // Fim do caminho: lado a lado, sai no meio do último trecho e chega junto com a irmã;
    // em coluna, sai da própria etapa irmã e desce até a paralela logo depois dela.
    const from = horizontal && a > 0 ? (cumulative[a - 1] + cumulative[a]) / 2 : cumulative[a]
    const to = horizontal ? cumulative[a] : cumulative[a] + distance(points[a], node)
    const p = pointAt(points, cumulative, from)
    branches.push({ d: `M${fix(p)} ${curve(p, node)}`, from: from / total, to: to / total })
    at[parallelIndex] = to / total
  })

  return { start: points[0], end: points[points.length - 1], main, branches, at }
}

export function Journey({ steps }: { steps: JourneyStep[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const gradientId = useId()
  const reduceMotion = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const [geometry, setGeometry] = useState<Geometry | null>(null)

  // Só mede perto de aparecer: medir na montagem forçava o layout da página inteira
  // antes da primeira pintura (medido no trace: +2,3 s com CPU lenta).
  const near = useInView(ref, { once: true, margin: '0px 0px 300px 0px' })

  // Mede de novo quando o tamanho muda (largura da tela, fonte, texto ampliado).
  // O ResizeObserver também dispara ao começar a observar, o que faz a primeira medida.
  useEffect(() => {
    const element = ref.current
    if (!element || !near) return
    let frame = 0
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setGeometry(measure(element, steps)))
    })
    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [near, steps])

  const animate = !reduceMotion
  const show = inView || !animate
  // Antes da primeira medida, as etapas aparecem em intervalos iguais.
  const at = geometry?.at ?? steps.map((_, i) => i / Math.max(1, steps.length - 1))
  const draw = (from = 0, to = 1) => ({
    initial: animate ? { pathLength: 0 } : false,
    animate: show ? { pathLength: 1 } : undefined,
    transition: { duration: DRAW * (to - from), delay: DRAW * from, ease: 'linear' as const },
  })

  return (
    <div className="journey" ref={ref}>
      <svg className="journey__svg" aria-hidden="true">
        {geometry && (
          <>
            <defs>
              <linearGradient
                id={gradientId}
                gradientUnits="userSpaceOnUse"
                x1={geometry.start.x}
                y1={geometry.start.y}
                x2={geometry.end.x}
                y2={geometry.end.y}
              >
                <stop className="journey__stop-start" offset="0" />
                <stop className="journey__stop-end" offset="1" />
              </linearGradient>
            </defs>
            {/* Trilho: o percurso inteiro, sempre visível. */}
            <path className="journey__track" d={geometry.main} />
            {geometry.branches.map((branch) => (
              <path key={branch.d} className="journey__track" d={branch.d} />
            ))}
            {/* Linha que se constrói por cima do trilho. */}
            <motion.path className="journey__line" d={geometry.main} stroke={`url(#${gradientId})`} {...draw()} />
            {geometry.branches.map((branch, i) => (
              <motion.path
                key={i}
                className="journey__line"
                d={branch.d}
                stroke={`url(#${gradientId})`}
                {...draw(branch.from, branch.to)}
              />
            ))}
          </>
        )}
      </svg>

      <ol className="journey__list">
        {steps.map((step, index) => {
          const Icon = ICONS[step.icon]
          const column = steps.slice(0, index + 1).filter((s) => !s.parallel).length
          const delay = DRAW * at[index]
          const className = [
            'journey__step',
            step.parallel && 'journey__step--parallel',
            step.current && 'journey__step--current',
          ]
            .filter(Boolean)
            .join(' ')
          return (
            <li key={`${step.kind}-${step.title}`} className={className} style={{ '--col': column } as React.CSSProperties}>
              {/* Estação: apagada até a linha chegar; então acende (anel e ícone). */}
              <span className="journey__node" data-dot aria-hidden="true">
                <Icon className="journey__icon" />
                <motion.span
                  className="journey__lit"
                  initial={animate ? { opacity: 0, scale: 0.5 } : false}
                  animate={show ? { opacity: 1, scale: 1 } : undefined}
                  transition={{ delay, type: 'spring', stiffness: 380, damping: 22 }}
                >
                  <Icon className="journey__icon" />
                </motion.span>
                {step.current && animate && (
                  // Um único pulso quando a linha chega à atuação atual.
                  <motion.span
                    className="journey__pulse"
                    initial={{ opacity: 0, scale: 1 }}
                    animate={show ? { opacity: [0, 0.6, 0], scale: [1, 1, 1.9] } : undefined}
                    transition={{ delay: delay + 0.15, duration: 1.1, ease: 'easeOut' }}
                  />
                )}
              </span>
              <motion.div
                className="journey__text"
                initial={animate ? { opacity: 0, y: 8 } : false}
                animate={show ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.45, delay: delay + 0.05, ease }}
              >
                <p className="journey__kind">{step.kind}</p>
                <p className="journey__title">{step.title}</p>
                <p className="journey__desc">{step.text}</p>
              </motion.div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
