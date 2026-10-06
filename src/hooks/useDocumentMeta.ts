import { useEffect } from 'react'

const SITE = 'Carlos Alberto'

/**
 * Atualiza o título da aba e a meta description a cada rota.
 * Por padrão o título vira "Título | Carlos Alberto"; com `exact`, é usado como está.
 */
export function useDocumentMeta(title: string, description: string, exact = false) {
  useEffect(() => {
    document.title = exact ? title : `${title} | ${SITE}`
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = description
  }, [title, description, exact])
}
