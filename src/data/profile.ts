/**
 * Informações pessoais e contatos.
 * Tudo o que aparece na abertura, em "Sobre mim" e em "Contato" vem daqui.
 * Listas vazias e contatos vazios ('') simplesmente não aparecem no site.
 */

export interface Contacts {
  /** Ex.: 'carlos@exemplo.com'. Vazio = a opção de e-mail não aparece. */
  email: string
  /** URL completa do perfil. */
  github: string
  /** URL completa do perfil. */
  linkedin: string
}

/** Ícone da etapa na trajetória (veja ICONS em components/sections/Journey.tsx). */
export type JourneyIcon = 'briefcase' | 'graduation' | 'wrench' | 'network' | 'globe' | 'code' | 'map'

export interface JourneyStep {
  /** Tipo da etapa, exibido acima do título. Ex.: 'Formação', 'Estágio'. */
  kind: string
  /** Onde: instituição, empresa ou forma de trabalho. */
  title: string
  /** O que foi feito, em poucas palavras. */
  text: string
  icon: JourneyIcon
  parallel?: boolean
  current?: boolean
}

export interface Profile {
  name: string
  role: string
  /** Título da abertura. A última palavra recebe o sublinhado laranja. */
  headline: string
  /** Frase curta abaixo do título. */
  intro: string
  /** Texto de "Sobre mim", um parágrafo por item. O primeiro aparece em destaque. */
  story: string[]
  /** Interesses. Ex.: ['Automação', 'Acessibilidade']. Vazio = não aparece. */
  interests: string[]
  /**
   * Trajetória em "Sobre mim", na ordem em que aconteceu. `parallel: true` marca uma etapa
   * que aconteceu junto com a anterior (vira uma ramificação do caminho); `current: true`
   * marca a atuação atual. Lista vazia = a trajetória não aparece.
   */
  journey: JourneyStep[]
  /** Tecnologias usadas nos projetos, em grupos. Lista vazia = a seção não aparece. */
  technologies: { group: string; items: string[] }[]
  contactTitle: string
  contactText: string
  contacts: Contacts
}

export const profile: Profile = {
  name: 'Carlos Alberto',
  role: 'Desenvolvedor full stack',
  headline: 'Ideias que viram sistemas.',
  intro:
    'Construo aplicações e automações para resolver problemas do dia a dia, com interesse em ferramentas para e-commerce.',
  story: [
    'Gosto de transformar necessidades práticas em software.',
    'Tenho desenvolvido projetos ligados à operação de e-commerce: organização de pedidos, controle de estoque, informações financeiras e monitoramento de disponibilidade.',
    'Meus projetos combinam interfaces em React e TypeScript com integrações e automações. Aqui compartilho o que estou construindo e o que aprendo no caminho.',
  ],
  interests: [],
  journey: [
    { kind: 'Menor aprendiz', title: 'Univesp', text: 'Área administrativa', icon: 'briefcase' },
    { kind: 'Formação', title: 'ETEC', text: 'Análise e Desenvolvimento de Sistemas', icon: 'graduation' },
    { kind: 'Curso', title: 'Manutenção de computadores', text: 'Em paralelo à formação na ETEC', icon: 'wrench', parallel: true },
    { kind: 'Estágio', title: 'ETEC', text: 'Redes, infraestrutura e manutenção', icon: 'network' },
    { kind: 'Autônomo', title: 'Freelancer', text: 'Desenvolvimento de sites', icon: 'globe' },
    { kind: 'Atual', title: 'Vektor Solutions', text: 'Desenvolvedor backend', icon: 'code', current: true },
    { kind: 'Atual', title: 'MapaML', text: 'Desenvolvedor full stack, como PJ, sob demanda', icon: 'map', parallel: true, current: true },
  ],
  // As dos projetos (CarlosML, ML Monitor e Vigia Full) foram conferidas nos package.json;
  // JavaScript e PHP foram informados pelo Carlos.
  technologies: [
    { group: 'Frontend', items: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Vite', 'Tailwind CSS'] },
    { group: 'Backend e dados', items: ['PHP', 'Node.js', 'Express', 'SQLite', 'Supabase'] },
    { group: 'Extensões e testes', items: ['WXT', 'Zod', 'Vitest', 'Playwright'] },
  ],
  contactTitle: 'Vamos conversar?',
  contactText:
    'Quer conhecer melhor meus projetos ou trocar uma ideia? Você pode me encontrar por aqui.',
  contacts: {
    email: '',
    github: 'https://github.com/Carlos-O-Silva',
    linkedin: 'https://br.linkedin.com/in/carlos-alberto-oliveira-e-silva-360620232',
  },
}
