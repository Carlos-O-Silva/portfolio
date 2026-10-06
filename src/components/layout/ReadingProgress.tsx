import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import './ReadingProgress.css'

/** Barra fina de progresso de leitura, ligada à rolagem da página (useScroll do Motion). */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 200, damping: 32, restDelta: 0.001 })
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className="reading-progress"
      style={{ scaleX: reduceMotion ? scrollYProgress : smooth }}
      aria-hidden="true"
    />
  )
}
