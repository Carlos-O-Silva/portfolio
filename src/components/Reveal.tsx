import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li' | 'article'
}

/**
 * Aparece uma única vez ao entrar na tela (opacidade e deslocamento curto).
 * Com movimento reduzido, o conteúdo já nasce visível.
 */
export function Reveal({ children, className, delay = 0, as = 'div' }: Props) {
  const reduceMotion = useReducedMotion()
  const Component = motion[as]
  return (
    <Component
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  )
}
