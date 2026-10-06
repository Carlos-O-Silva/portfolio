import { useEffect, useRef } from 'react'
import { Outlet, ScrollRestoration, useLocation, useNavigationType } from 'react-router'
import { Header } from './Header'
import { Footer } from './Footer'

/**
 * Depois de cada navegação, leva o foco para onde o visitante chegou:
 * a seção da âncora ou o título principal da nova página.
 * A posição da rolagem fica com o ScrollRestoration.
 */
function useRouteFocus() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    let target: HTMLElement | null = null
    if (location.hash) {
      target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
    } else if (navigationType !== 'POP') {
      target = document.querySelector<HTMLElement>('main h1')
    }
    if (!target) return
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }, [location, navigationType])
}

export function Layout() {
  useRouteFocus()

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      {/*
       * Toda página aberta pela barra de endereço recebe a chave "default"; sem o caminho
       * na chave, abrir um projeto direto herdaria a rolagem salva da página inicial.
       */}
      <ScrollRestoration getKey={(location) => (location.key === 'default' ? location.pathname : location.key)} />
    </>
  )
}
