import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { projects, type Project } from '../../data/projects'
import { previewTransition, useViewTransition } from '../../lib/viewTransition'
import { ProjectPreview } from '../previews/ProjectPreview'
import { Reveal } from '../Reveal'
import { ProjectLinks } from './ProjectLinks'
import './Projects.css'

function ProjectCard({ project, index }: { project: Project; index: number }) {
  // Sem a API ou com movimento reduzido, a navegação acontece sem a transição da prévia.
  const viewTransition = useViewTransition()
  const to = `/projetos/${project.slug}`

  return (
    <Reveal
      as="li"
      className={project.featured ? 'projects__item projects__item--featured' : 'projects__item'}
      delay={index * 0.08}
    >
      <article className="card" aria-labelledby={`projeto-${project.slug}`}>
        {/*
         * A prévia tem link próprio (fora do Tab e oculto para leitores de tela, que usam o
         * link do título). Assim ela fica acima da área clicável do card e recebe o hover.
         */}
        <Link
          to={to}
          state={{ fromHome: true }}
          viewTransition={viewTransition}
          className="card__media"
          tabIndex={-1}
          aria-hidden="true"
          style={previewTransition(project.slug)}
        >
          <ProjectPreview preview={project.preview} fit="cover" scrollable />
        </Link>

        <div className="card__body">
          <p className="card__meta">
            {/* O separador fica no fim da 1ª parte: se a linha quebrar, não começa com "·". */}
            <span className="card__category">{project.category} ·</span>{' '}
            <span className="card__status">{project.status.label}</span>
          </p>
          <h3 id={`projeto-${project.slug}`} className="card__title">
            {/* O link cobre o card inteiro (::after). */}
            <Link to={to} state={{ fromHome: true }} viewTransition={viewTransition}>
              {project.title}
              <ArrowRight className="card__arrow" aria-hidden="true" />
            </Link>
          </h3>
          <p className="card__summary">{project.summary}</p>
          {project.technologies.length > 0 && (
            <p className="card__tech">
              <span className="visually-hidden">Tecnologias: </span>
              {project.technologies.join(', ')}
            </p>
          )}
          <ProjectLinks links={project.links} />
        </div>
      </article>
    </Reveal>
  )
}

export function ProjectsSection() {
  return (
    <section id="projetos" className="section projects" aria-labelledby="projetos-title">
      <div className="container">
        <h2 id="projetos-title" className="section-title">
          Projetos
        </h2>

        <ul role="list" className="projects__grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </ul>
      </div>
    </section>
  )
}
