import type { CSSProperties } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * Nome compartilhado entre a prévia do card e a imagem principal da página do projeto.
 * Com o mesmo nome nas duas páginas, a View Transition anima uma até a outra
 * (veja ::view-transition-*(.preview) em base.css). Sem suporte no navegador, nada muda.
 */
export function previewTransition(slug: string): CSSProperties {
  return { viewTransitionName: `preview-${slug}`, viewTransitionClass: 'preview' } as CSSProperties
}

/**
 * Usar a transição neste clique? Só com a API disponível (sem ela, o React Router
 * avisa no console) e sem preferência por movimento reduzido.
 */
export function useViewTransition() {
  const reduceMotion = useReducedMotion()
  return !reduceMotion && typeof document !== 'undefined' && 'startViewTransition' in document
}
