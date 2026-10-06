import { MotionConfig } from 'motion/react'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

// A página de projeto fica num arquivo próprio: a página inicial não espera por ela.
const loadProjectPage = () => import('./pages/ProjectPage')

const router = createBrowserRouter([
  {
    element: <Layout />,
    // Enquanto o código de uma rota sob demanda chega no primeiro acesso, nada é desenhado.
    HydrateFallback: () => null,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'projetos/:slug', lazy: () => loadProjectPage().then((module) => ({ Component: module.ProjectPage })) },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

// Com o navegador ocioso, já baixa a página de projeto para o clique no card não esperar a rede.
if ('requestIdleCallback' in window) requestIdleCallback(() => void loadProjectPage())
else setTimeout(() => void loadProjectPage(), 2000)

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  )
}
