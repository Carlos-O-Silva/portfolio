import type { ProjectPreview as Preview } from '../../data/projects'
import './previews.css'

interface Props {
  preview: Preview
  /** Imagens acima da dobra devem carregar de imediato. */
  eager?: boolean
  /** Substitui o `fit` da imagem (o card sempre preenche o quadro). */
  fit?: 'cover' | 'contain'
  /**
   * Permite percorrer a captura no hover (só no card). Vale apenas para capturas
   * pelo menos tão altas quanto largas; as outras ficam paradas.
   */
  scrollable?: boolean
}

/** Prévia de um projeto: screenshot real. */
export function ProjectPreview({ preview, eager = false, fit, scrollable = false }: Props) {
  const ratio = preview.height / preview.width
  const scroll = scrollable && ratio >= 1
  return (
    <div
      className="preview"
      data-fit={fit ?? preview.fit ?? 'cover'}
      data-scroll={scroll ? 'true' : undefined}
      // Capturas mais altas percorrem mais conteúdo, então levam mais tempo (1,6 s a 3 s).
      style={scroll ? ({ '--scroll-duration': `${Math.min(3, ratio * 1.6).toFixed(2)}s` } as React.CSSProperties) : undefined}
    >
      <img
        src={preview.src}
        alt={preview.alt}
        width={preview.width}
        height={preview.height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  )
}
