import { profile } from '../../data/profile'
import { Journey } from './Journey'
import './About.css'
import './Journey.css'

export function AboutSection() {
  const [lead, ...rest] = profile.story
  const technologies = profile.technologies.filter((group) => group.items.length > 0)

  return (
    <section id="sobre" className="section about" aria-labelledby="sobre-title">
      <div className="container about__grid">
        <div className="about__side">
          <h2 id="sobre-title" className="about__title">
            Sobre mim
          </h2>
        </div>

        <div className="about__main">
          {lead && <p className="about__lead">{lead}</p>}
          {rest.map((paragraph) => (
            <p key={paragraph} className="about__text">
              {paragraph}
            </p>
          ))}

          {profile.interests.length > 0 && (
            <div className="about__block">
              <h3 className="about__subtitle">Interesses</h3>
              <p className="about__interests">{profile.interests.join(', ')}</p>
            </div>
          )}
        </div>

        {profile.journey.length > 0 && (
          <div className="about__block about__journey">
            <h3 className="about__subtitle">Trajetória</h3>
            <Journey steps={profile.journey} />
          </div>
        )}

        {technologies.length > 0 && (
          <div className="about__block about__tech">
            <h3 className="about__subtitle">Tecnologias que utilizo</h3>
            <div className="techs">
              {technologies.map((group) => (
                <div key={group.group} className="techs__group">
                  <h4 className="techs__name">{group.group}</h4>
                  <ul role="list" className="techs__items">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
