import { useEffect, useState } from 'react'

/**
 * Qual seção ocupa o meio da tela. Usa IntersectionObserver, então só atualiza
 * quando a seção muda, e não a cada quadro de rolagem.
 */
export function useActiveSection(ids: string[], enabled: boolean) {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join(',')

  useEffect(() => {
    if (!enabled) return
    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        // Mantém a ordem da página: vale a primeira seção visível na faixa central.
        setActive(key.split(',').find((id) => visible.has(id)) ?? null)
      },
      // Faixa estreita no meio da tela: só uma seção por vez cai nela.
      { rootMargin: '-45% 0px -50% 0px' },
    )
    for (const id of key.split(',')) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [key, enabled])

  return enabled ? active : null
}
