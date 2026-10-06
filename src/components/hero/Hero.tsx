import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { profile } from '../../data/profile'
import { HeroSketch } from './HeroSketch'
import './Hero.css'

/**
 * Título visível desde a primeira pintura (é o maior elemento da tela).
 * O movimento da abertura fica no sublinhado laranja, que se desenha sob a
 * última palavra, e no desenho em traço ao lado.
 */
function HeroTitle({ text }: { text: string }) {
  const words = text.split(' ')
  const last = words.pop()
  return (
    <h1 id="hero-title" className="hero__title">
      {words.length > 0 && `${words.join(' ')} `}
      <em>{last}</em>
    </h1>
  )
}

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="hero__name">
            <strong>{profile.name}</strong> · {profile.role}
          </p>
          <HeroTitle text={profile.headline} />
          <p className="hero__intro">{profile.intro}</p>
          <div className="hero__actions">
            <Link to={{ hash: 'projetos' }} className="btn btn--primary">
              Ver projetos
            </Link>
            <Link to={{ hash: 'contato' }} className="text-link hero__contact">
              Entrar em contato
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="hero__visual">
          <HeroSketch />
        </div>
      </div>
    </section>
  )
}
