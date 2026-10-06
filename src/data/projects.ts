/**
 * Projetos exibidos na página inicial e nas páginas /projetos/:slug.
 *
 * Os textos foram conferidos no código e na documentação de cada projeto.
 * Campos opcionais vazios não aparecem no site. Para adicionar screenshots,
 * coloque o arquivo em public/projetos/<slug>/ e use { kind: 'image', ... } em
 * `preview` ou em `gallery` (veja o README).
 */

export interface ProjectImage {
  src: string
  /** Descreva o que a imagem mostra. */
  alt: string
  /** Dimensões reais do arquivo, para reservar o espaço e evitar saltos. */
  width: number
  height: number
  /**
   * 'cover' preenche o quadro (telas largas).
   * 'contain' mostra a imagem inteira sobre o fundo (popups, telas de celular).
   */
  fit?: 'cover' | 'contain'
  /** Legenda curta exibida na página do projeto. */
  caption?: string
}

export type ProjectPreview = { kind: 'image' } & ProjectImage

export interface ProjectLinks {
  /** URL pública da demonstração. Vazio = o link não aparece. */
  demo?: string
  /** URL pública do código. Vazio = o link não aparece. */
  code?: string
}

export interface ProjectStatus {
  /** Ex.: 'Em desenvolvimento'. Aparece junto da categoria. */
  label: string
  /** O que já funciona no código. */
  working: string[]
  /** O que é experimental, simulado ou ainda não validado. */
  experimental: string[]
  /** O que está pendente ou planejado. */
  planned: string[]
}

export interface Project {
  slug: string
  /** Projeto em destaque: card mais largo na página inicial. Use em um só. */
  featured?: boolean
  title: string
  category: string
  /** Descrição curta, usada na listagem e no topo da página. */
  summary: string
  preview: ProjectPreview
  technologies: string[]
  /** Parágrafos de "Visão geral". */
  overview?: string[]
  problem?: string
  solution?: string
  status: ProjectStatus
  decisions: { title: string; text: string }[]
  learnings?: string[]
  gallery?: ProjectImage[]
  links: ProjectLinks
}

export const projects: Project[] = [
  {
    slug: 'carlosml',
    featured: true,
    title: 'CarlosML',
    category: 'Aplicação para e-commerce',
    summary:
      'Aplicação web para controlar fornecedores, produtos e o saldo de compras e pagamentos, pensada primeiro para o celular.',
    preview: {
      kind: 'image',
      src: '/projetos/carlosml/dashboard-escuro.webp',
      alt: 'Dashboard do CarlosML no tema escuro: totais de fornecedores, produtos, saldo em aberto e último pagamento, ações rápidas, últimos produtos e últimas movimentações.',
      width: 1440,
      height: 900,
      fit: 'cover',
      caption: 'Captura do app no tema escuro, com dados fictícios.',
    },
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Playwright'],
    overview: [
      'O CarlosML reúne o cadastro de fornecedores e produtos e o controle financeiro das compras em um só lugar.',
      'O frontend é um site estático feito em Next.js, React e TypeScript. Login, banco de dados e funções ficam no Supabase.',
    ],
    status: {
      label: 'Finalizado',
      working: [
        'Login por e-mail e senha, com usuários criados manualmente.',
        'Fornecedores: busca, cadastro, edição, exclusão e lista de produtos de cada um.',
        'Produtos: busca por nome ou SKU, filtro por fornecedor e histórico de preço unitário e de atacado.',
        'Financeiro: compras à vista ou a prazo e pagamentos, com o saldo calculado pelo banco.',
        'Leitura de nota por IA, que preenche o formulário para revisão antes de salvar.',
        'Tema claro e escuro.',
      ],
      experimental: [],
      planned: [],
    },
    decisions: [
      {
        title: 'Site estático',
        text: 'O Next.js gera um site estático, pensado para ser servido por um bucket S3. Não há servidor próprio: o navegador fala direto com o Supabase.',
      },
      {
        title: 'Dados protegidos no banco',
        text: 'Políticas de RLS garantem que cada usuário veja só os próprios dados, e um único módulo do código acessa o banco.',
      },
      {
        title: 'Saldo que não fica negativo',
        text: 'O saldo é calculado por views no banco, e um trigger recusa qualquer lançamento que deixe o saldo negativo em algum ponto do histórico.',
      },
      {
        title: 'IA como assistente',
        text: 'A leitura da nota só preenche o formulário; quem decide e salva é a pessoa. As chaves de IA ficam nas Edge Functions, fora do navegador.',
      },
    ],
    gallery: [
      {
        src: '/projetos/carlosml/produtos-escuro.webp',
        alt: 'Lista de produtos do CarlosML com busca, filtro por fornecedor, preço unitário e preço de atacado.',
        width: 1440,
        height: 900,
        caption: 'Produtos com busca e filtro por fornecedor.',
      },
      {
        src: '/projetos/carlosml/financeiro-escuro.webp',
        alt: 'Tela financeira do CarlosML com saldo em aberto, último pagamento e movimentações com saldo antes e depois.',
        width: 1440,
        height: 900,
        caption: 'Financeiro: cada movimentação mostra o saldo antes e depois.',
      },
    ],
    links: {},
  },
  {
    slug: 'ml-monitor',
    title: 'ML Monitor',
    category: 'Aplicação para e-commerce',
    summary:
      'Aplicação voltada à operação no Mercado Livre, com módulos de pedidos, estoque e financeiro.',
    preview: {
      kind: 'image',
      src: '/projetos/ml-monitor/financeiro.webp',
      alt: 'Resumo financeiro do ML Monitor: vendas aprovadas, faturamento, vendas canceladas, estrutura de custos, margem final após devoluções, gastos variáveis, vendas por logística e indicadores do período.',
      width: 1440,
      height: 2160,
      fit: 'cover',
      caption: 'Captura do app em modo de teste, com dados simulados.',
    },
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'SQLite'],
    overview: [
      'O ML Monitor reúne ferramentas para acompanhar diferentes partes da operação no Mercado Livre.',
      'O frontend é feito em React e TypeScript, e o backend em Node.js com Express e SQLite. Há módulos de pedidos, estoque, vendas, faturamento e devoluções, além da integração com a API do Mercado Livre.',
    ],
    status: {
      label: 'Em desenvolvimento',
      working: [
        'Conexão com a conta do Mercado Livre por OAuth, com renovação do token.',
        'Sincronização periódica de vendas e de faturamento pela API do Mercado Livre.',
        'Pedidos filtrados por período e destino, com estados, cidades e códigos de venda.',
        'Estoque com cadastro de produtos, custo e histórico de entradas e saídas.',
        'Resumo financeiro com receitas, custos, margem de contribuição e gastos variáveis.',
      ],
      experimental: [
        'Estimativa de vendas de concorrentes: a API não fornece estoque nem vendas de anúncios de terceiros, então o resultado é uma faixa baseada em sinais indiretos, sem precisão comprovada.',
        'Publicidade: os dados de campanhas ainda são simulados.',
        'Resumos pelo WhatsApp e verificação de devoluções no Mercado Pago: funcionam só em modo simulado.',
      ],
      planned: [
        'Integrar a API de publicidade, o envio real pelo WhatsApp e a consulta ao Mercado Pago.',
      ],
    },
    decisions: [
      {
        title: 'Modo simulado por integração',
        text: 'Mercado Livre, WhatsApp e Mercado Pago têm um modo simulado ligado por variável de ambiente. Isso permite desenvolver sem depender de credenciais reais.',
      },
      {
        title: 'Agendamento dentro dos limites da API',
        text: 'Vendas sincronizam a cada 30 minutos e faturamento de hora em hora, porque a API de faturamento aceita poucas requisições por minuto.',
      },
      {
        title: 'Estimativas como faixa',
        text: 'A estimativa de concorrentes mostra mínimo e máximo e marca o que não pode ser medido, em vez de apresentar um número único como se fosse exato.',
      },
    ],
    learnings: [
      'A API oficial do Mercado Livre não expõe estoque nem vendas de anúncios de terceiros. Por isso, a análise de concorrentes ficou limitada a sinais indiretos.',
    ],
    gallery: [
      {
        src: '/projetos/ml-monitor/pedidos.webp',
        alt: 'Tela de pedidos do ML Monitor com filtro por período, totais, estados ordenados por valor aprovado e lista de pedidos com destino.',
        width: 1440,
        height: 900,
        caption: 'Pedidos por destino, com dados simulados.',
      },
      {
        src: '/projetos/ml-monitor/estoque.webp',
        alt: 'Controle de estoque do ML Monitor com total de SKUs, unidades, alertas, catálogo de produtos e movimentação rápida.',
        width: 1440,
        height: 900,
        caption: 'Controle de estoque, com dados simulados.',
      },
    ],
    links: {},
  },
  {
    slug: 'vigia-full',
    title: 'Vigia Full',
    category: 'Extensão de navegador',
    summary:
      'Extensão para monitorar datas disponíveis de agendamento de envios Full no Mercado Livre.',
    preview: {
      kind: 'image',
      src: '/projetos/vigia-full/popup.webp',
      alt: 'Popup do Vigia Full: aviso de modo de teste, instruções de uso, calendário de outubro com o intervalo de 14 a 17 selecionado e os botões Iniciar e Parar monitoramento.',
      width: 760,
      height: 876,
      fit: 'contain',
      caption: 'Captura real do popup, em modo de teste.',
    },
    technologies: ['TypeScript', 'React', 'WXT', 'Tailwind CSS', 'Chrome Extensions API', 'Zod', 'Vitest'],
    problem:
      'Para enviar produtos ao Full, é preciso agendar uma data, e a data desejada nem sempre está disponível. Conferir isso manualmente exige voltar à página de agendamento várias vezes.',
    solution:
      'A extensão permite selecionar um intervalo de datas e iniciar o monitoramento de disponibilidade. A tarefa mantém seu estado no service worker, mesmo com o popup fechado. Ao encontrar uma data, a extensão avisa e interrompe as consultas.',
    status: {
      label: 'Em desenvolvimento',
      working: [
        'Popup para escolher o intervalo e iniciar ou parar o monitoramento.',
        'Consultas periódicas de disponibilidade, em modo de teste e somente leitura.',
        'Aviso quando uma data é encontrada, com interrupção das consultas.',
        'Testes automatizados com Vitest.',
      ],
      experimental: [
        'A integração real do build atual com o Mercado Livre ainda precisa ser validada no navegador.',
      ],
      planned: [
        'Confirmação automática do agendamento: prevista, mas bloqueada no modo de teste.',
        'Autenticação com Supabase: ainda não implementada.',
      ],
    },
    decisions: [
      {
        title: 'Permissões mínimas',
        text: 'Usa apenas scripting, storage, alarms e notifications, com acesso restrito ao portal de vendedores. Não pede acesso a todas as páginas, abas, cookies ou histórico.',
      },
      {
        title: 'Somente leitura',
        text: 'A consulta de disponibilidade só faz leituras no endereço do envio validado. A confirmação de agendamento fica bloqueada no código.',
      },
      {
        title: 'Mensagens validadas',
        text: 'Popup, service worker e página trocam mensagens com schemas estritos em Zod. O texto vindo da página é tratado como não confiável e exibido só como texto.',
      },
      {
        title: 'Tarefa persistente',
        text: 'O estado fica salvo no armazenamento da extensão e os alarmes acordam o service worker. Uma consulta por vez; respostas atrasadas de execuções anteriores são descartadas.',
      },
    ],
    links: {},
  },
]

export function getProject(slug: string | undefined) {
  return projects.find((project) => project.slug === slug)
}

export function hasLinks(links: ProjectLinks) {
  return Boolean(links.demo || links.code)
}

export function getNextProject(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug)
  return projects[(index + 1) % projects.length]
}
