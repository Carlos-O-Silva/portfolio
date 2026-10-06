import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import './NotFoundPage.css'

interface Props {
  title?: string
  message?: string
}

export function NotFoundPage({
  title = 'Página não encontrada',
  message = 'O endereço que você abriu não existe neste portfólio.',
}: Props) {
  useDocumentMeta(title, message)

  return (
    <section className="not-found container" aria-labelledby="nf-title">
      <p className="not-found__code mono" aria-hidden="true">
        404
      </p>
      <h1 id="nf-title" className="not-found__title" tabIndex={-1}>
        {title}
      </h1>
      <p className="not-found__text">{message}</p>
      <div className="not-found__actions">
        <Link to="/" className="btn btn--primary">
          <ArrowLeft size={18} aria-hidden="true" />
          Ir para o início
        </Link>
        <Link to={{ pathname: '/', hash: 'projetos' }} className="btn btn--ghost">
          Ver projetos
        </Link>
      </div>
    </section>
  )
}
