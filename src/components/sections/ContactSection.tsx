import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { profile } from '../../data/profile'
import './Contact.css'

function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    window.clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(email)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
    timer.current = window.setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <>
      <button type="button" className="contact__copy" onClick={copy}>
        {status === 'copied' ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        {status === 'copied' ? 'Copiado' : 'Copiar'}
        <span className="visually-hidden"> endereço de e-mail</span>
      </button>
      <span className="visually-hidden" role="status">
        {status === 'copied' && 'Endereço de e-mail copiado.'}
        {status === 'failed' && 'Não foi possível copiar. Selecione o endereço manualmente.'}
      </span>
      {status === 'failed' && (
        <span className="contact__error" aria-hidden="true">
          Não foi possível copiar. Selecione o endereço.
        </span>
      )}
    </>
  )
}

export function ContactSection() {
  const { contacts } = profile
  const profiles = [
    { label: 'GitHub', url: contacts.github },
    { label: 'LinkedIn', url: contacts.linkedin },
  ].filter((item) => item.url)

  return (
    <section id="contato" className="section contact" aria-labelledby="contato-title">
      <div className="container contact__grid">
        <div>
          <h2 id="contato-title" className="contact__title">
            {profile.contactTitle}
          </h2>
          <p className="contact__text">{profile.contactText}</p>
        </div>

        {(contacts.email || profiles.length > 0) && (
          <div>
            <ul role="list" className="contact__channels">
              {contacts.email && (
                <li className="contact__email">
                  <span className="contact__label">E-mail</span>
                  <span className="contact__row">
                    <a className="contact__address" href={`mailto:${contacts.email}`}>
                      {contacts.email}
                    </a>
                    <CopyEmail email={contacts.email} />
                  </span>
                </li>
              )}
              {profiles.map((item) => (
                <li key={item.label}>
                  <a className="contact__link" href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.label}
                    <ArrowUpRight className="contact__external" aria-hidden="true" />
                    <span className="visually-hidden">(abre em nova aba)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
