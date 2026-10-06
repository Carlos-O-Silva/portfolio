import { ArrowUpRight } from 'lucide-react'
import type { ProjectLinks as Links } from '../../data/projects'
import './ProjectLinks.css'

const LABELS: Record<keyof Links, string> = {
  demo: 'Demonstração',
  code: 'Código',
}

/** Links externos do projeto. Só aparecem os que têm URL preenchida. */
export function ProjectLinks({ links }: { links: Links }) {
  const filled = (Object.keys(LABELS) as (keyof Links)[]).filter((key) => links[key])
  if (filled.length === 0) return null

  return (
    <ul role="list" className="project-links">
      {filled.map((key) => (
        <li key={key}>
          <a className="text-link" href={links[key]} target="_blank" rel="noopener noreferrer">
            {LABELS[key]}
            <ArrowUpRight size={16} aria-hidden="true" />
            <span className="visually-hidden">(abre em nova aba)</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
