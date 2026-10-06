/** Curva de saída usada nas animações do site. */
export const ease = [0.16, 1, 0.3, 1] as const

/** Troca de estado com escala e desfoque (referência: "Icon swap" e "Text states swap"). */
export const swap = {
  initial: { opacity: 0, scale: 0.6, filter: 'blur(4px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 0.6, filter: 'blur(4px)' },
  transition: { duration: 0.2, ease },
}
