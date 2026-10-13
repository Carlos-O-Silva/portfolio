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
    slug: 'fullmap',
    title: 'FullMap',
    category: 'Extensão de navegador',
    summary:
      'Extensão que acompanha a página de agendamento do Mercado Livre Full e seleciona, ou agenda, a primeira data compatível com as preferências do vendedor.',
    preview: {
      kind: 'image',
      src: '/projetos/fullmap/inicio.webp',
      alt: 'Tela Início do FullMap: monitoramento ativo em veículo particular, com datas, centros, faixa de horário e intervalo; uma busca com contagem regressiva para a próxima verificação e outra com data encontrada aguardando confirmação na aba.',
      width: 880,
      height: 1200,
      fit: 'contain',
      caption: 'Captura do popup com dados fictícios.',
    },
    technologies: ['JavaScript', 'HTML', 'CSS', 'Chrome Extensions API', 'Node.js', 'Chrome DevTools Protocol'],
    problem:
      'As vagas para enviar ao Full aparecem e somem ao longo do dia. Com vários Fulls, centros de distribuição e faixas de horário, acompanhar a página e agendar manualmente toma tempo, e a data desejada pode ser ocupada antes de voltar a ela.',
    solution:
      'A extensão recarrega a página de agendamento em intervalos e lê o calendário, os centros e os horários. Quando encontra uma opção dentro das preferências, seleciona e avisa com notificação e som. A confirmação automática é opcional e vem desligada.',
    status: {
      label: 'Em desenvolvimento',
      working: [
        'Coleta a domicílio e veículo particular, com datas por prioridade ou período, centros e faixas de horário.',
        'Uma busca por aba de agendamento, com recarga por alarmes e watchdog para páginas travadas.',
        'Datas diferentes por Full, sem que dois Fulls fiquem no mesmo dia.',
        'Notificação do Chrome e aviso sonoro ao encontrar uma data.',
        'Painel com quatro telas: Início, Agendamentos, Atividade e Ajustes.',
        'Testes automatizados estáticos, simulados e com a extensão carregada no Chrome.',
      ],
      experimental: [
        'A confirmação automática ainda precisa ser validada no Mercado Livre de forma controlada.',
        'No veículo particular, a conferência de centro e horário depois de agendar ainda não existe.',
        'Alguns seletores, como os de modalidade e avisos, ainda não foram conferidos no site real.',
      ],
      planned: ['Aviso por e-mail.'],
    },
    decisions: [
      {
        title: 'Regras de leitura em um arquivo',
        text: 'Textos e seletores da página ficam em um único módulo, carregado pelo service worker e pelo content script. Quando o layout do Mercado Livre muda, é o primeiro lugar a ajustar.',
      },
      {
        title: 'Sem servidor',
        text: 'Tudo roda no navegador, com a sessão do Mercado Livre que já está aberta. Não há chamadas de rede, e um teste verifica isso.',
      },
      {
        title: 'Sucesso só com prova',
        text: 'A extensão não assume que o agendamento deu certo por navegação ou texto genérico. Sem prova, o resultado fica pendente para conferência na aba.',
      },
      {
        title: 'Painel ligado ao estado real',
        text: 'Última e próxima verificação, contagem e tempo de busca vêm dos dados das buscas e dos alarmes. Sem busca ativa, os campos ficam vazios em vez de mostrar números de exemplo.',
      },
    ],
    gallery: [
      {
        src: '/projetos/fullmap/agendamentos.webp',
        alt: 'Tela Agendamentos do FullMap: escolha entre coleta a domicílio e veículo particular e calendário de outubro de 2026 com três datas marcadas por ordem de prioridade.',
        width: 880,
        height: 1200,
        fit: 'contain',
        caption: 'Datas escolhidas no calendário, em ordem de prioridade.',
      },
      {
        src: '/projetos/fullmap/atividade.webp',
        alt: 'Tela Atividade do FullMap: totais de eventos, encontrados e alertas, filtros e a linha do tempo de uma busca com verificações por centro.',
        width: 880,
        height: 1200,
        fit: 'contain',
        caption: 'Linha do tempo das buscas, com dados fictícios.',
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
