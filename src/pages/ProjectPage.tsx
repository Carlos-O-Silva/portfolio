import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getNextProject, getProject, hasLinks, type Project } from '../data/projects'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { previewTransition, useViewTransition } from '../lib/viewTransition'
import { ReadingProgress } from '../components/layout/ReadingProgress'
import { ProjectPreview } from '../components/previews/ProjectPreview'
import { ProjectLinks } from '../components/projects/ProjectLinks'
import { NotFoundPage } from './NotFoundPage'
import './ProjectPage.css'

function BackLink() {
  const location = useLocation()
  const navigate = useNavigate()
  const cameFromHome = Boolean((location.state as { fromHome?: boolean } | null)?.fromHome)

  return (
    <Link
      to={{ pathname: '/', hash: 'projetos' }}
      className="detail__back text-link"
      onClick={(event) => {
        // Voltando pelo histórico, a página inicial restaura a posição anterior da rolagem.
        if (cameFromHome) {
          event.preventDefault()
          navigate(-1)
        }
      }}
    >
      <ArrowLeft size={18} aria-hidden="true" />
      Voltar para projetos
    </Link>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="detail__block">
      <h2 className="detail__h2">{title}</h2>
      <div className="detail__content">{children}</div>
    </div>
  )
}

function StatusList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <div className="status">
      <h3 className="status__title">{title}</h3>
      <ul role="list" className="status__list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function ProjectDetail({ project }: { project: Project }) {
  useDocumentMeta(project.title, project.summary)
  const next = getNextProject(project.slug)
  const { status } = project
  const viewTransition = useViewTransition()

  return (
    <>
      <ReadingProgress />
      <article className="detail" aria-labelledby="detail-title">
        <div className="container">
          <BackLink />

          <header className="detail__header">
            <p className="detail__meta">
              {project.category}
              <span className="detail__status"> · {status.label}</span>
            </p>
            <h1 id="detail-title" className="detail__title" tabIndex={-1}>
              {project.title}
            </h1>
            <p className="detail__summary">{project.summary}</p>
          </header>

          {/* A imagem chega do card pela View Transition (mesmo nome nas duas páginas). */}
          <figure className="detail__figure">
            <div
              className="detail__hero-media"
              data-fit={project.preview.fit ?? 'cover'}
              style={previewTransition(project.slug)}
            >
              <ProjectPreview preview={project.preview} eager />
            </div>
            {project.preview.caption && <figcaption>{project.preview.caption}</figcaption>}
          </figure>

          <div className="detail__body">
            {project.overview && project.overview.length > 0 && (
              <Block title="Visão geral">
                {project.overview.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </Block>
            )}
            {project.problem && (
              <Block title="Problema">
                <p>{project.problem}</p>
              </Block>
            )}
            {project.solution && (
              <Block title="Solução">
                <p>{project.solution}</p>
              </Block>
            )}

            <Block title="Estado atual">
              <div className="status-grid">
                <StatusList title="Funciona hoje" items={status.working} />
                <StatusList title="Experimental ou simulado" items={status.experimental} />
                <StatusList title="Pendente ou planejado" items={status.planned} />
              </div>
            </Block>

            <Block title="Decisões técnicas">
              <ul role="list" className="decisions">
                {project.decisions.map((decision) => (
                  <li key={decision.title}>
                    <h3 className="decisions__title">{decision.title}</h3>
                    <p>{decision.text}</p>
                  </li>
                ))}
              </ul>
              {project.technologies.length > 0 && (
                <p className="detail__tech">
                  <span>Tecnologias</span>
                  {project.technologies.join(', ')}
                </p>
              )}
            </Block>

            {project.learnings && project.learnings.length > 0 && (
              <Block title="Aprendizados">
                <ul role="list" className="learnings">
                  {project.learnings.map((learning) => (
                    <li key={learning}>{learning}</li>
                  ))}
                </ul>
              </Block>
            )}
          </div>

          {project.gallery && project.gallery.length > 0 && (
            <section className="gallery" aria-labelledby="galeria-title">
              <h2 id="galeria-title" className="detail__h2">
                Galeria
              </h2>
              <div className="gallery__grid">
                {project.gallery.map((image) => (
                  <figure key={image.src} className="gallery__item">
                    <div className="gallery__media">
                      <ProjectPreview preview={{ kind: 'image', ...image }} />
                    </div>
                    {image.caption && <figcaption>{image.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </section>
          )}

          {hasLinks(project.links) && (
            <div className="detail__body">
              <Block title="Links">
                <ProjectLinks links={project.links} />
              </Block>
            </div>
          )}

          {next.slug !== project.slug && (
            <nav className="next" aria-label="Próximo projeto">
              <Link to={`/projetos/${next.slug}`} className="next__link" viewTransition={viewTransition}>
                <span className="next__label">Próximo projeto</span>
                <span className="next__title">
                  {next.title}
                  <ArrowRight className="next__arrow" aria-hidden="true" />
                </span>
              </Link>
            </nav>
          )}
        </div>
      </article>
    </>
  )
}

export function ProjectPage() {
  const { slug } = useParams()
  const project = getProject(slug)

  if (!project) {
    return (
      <NotFoundPage
        title="Projeto não encontrado"
        message="Não existe um projeto com esse endereço. Ele pode ter mudado de nome ou sido removido."
      />
    )
  }

  // A chave reinicia a página (estado e barra de progresso) ao trocar de projeto.
  return <ProjectDetail key={project.slug} project={project} />
}
