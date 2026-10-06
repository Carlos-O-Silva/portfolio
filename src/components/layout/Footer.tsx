import { profile } from '../../data/profile'
import './Footer.css'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container footer__inner">
        {/* Marca curta, como no cabeçalho; o nome completo fica no aviso de direitos. */}
        <span className="footer__brand">
          {profile.name.split(' ')[0]}
          <span aria-hidden="true">.</span>
        </span>
        <small className="footer__copy">
          © {year} {profile.name}
        </small>
      </div>
    </footer>
  )
}
