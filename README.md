# Portfólio · Carlos Alberto

Portfólio pessoal de Carlos Alberto, desenvolvedor full stack. Apresenta minha trajetória e três projetos reais:
**CarlosML**, **ML Monitor** e **Vigia Full**. Cada projeto tem uma página própria que separa o que já funciona,
o que é experimental e o que está planejado.

É um site estático (SPA), sem backend. Todo o conteúdo fica em dois arquivos de dados.

## Sobre mim

- **Atualmente:** desenvolvedor backend na Vektor Solutions e desenvolvedor full stack na MapaML (PJ, sob demanda).
- **Formação:** Análise e Desenvolvimento de Sistemas na ETEC.
- **Tecnologias que utilizo:**
  - Frontend: JavaScript, TypeScript, React, Next.js, Vite e Tailwind CSS.
  - Backend e dados: PHP, Node.js, Express, SQLite e Supabase.
  - Extensões e testes: WXT, Zod, Vitest e Playwright.

[GitHub](https://github.com/Carlos-O-Silva) · [LinkedIn](https://br.linkedin.com/in/carlos-alberto-oliveira-e-silva-360620232)

## Tecnologias deste site

| Tecnologia | Uso no projeto |
|---|---|
| [React 19](https://react.dev) | Interface em componentes |
| [TypeScript](https://www.typescriptlang.org) | Tipagem do código e dos dados (perfil e projetos) |
| [Vite](https://vite.dev) | Servidor de desenvolvimento e build. Um plugin próprio gera `robots.txt`, `sitemap.xml` e as metatags que dependem do domínio |
| [React Router 8](https://reactrouter.com) | Rotas (`/` e `/projetos/:slug`), restauração de rolagem e transição entre páginas com `viewTransition` |
| [Motion](https://motion.dev) | Animações: desenho em traço da abertura, trajetória, marcador do menu e painel do celular |
| View Transitions API | A prévia do card se transforma na imagem principal da página do projeto |
| [Lucide](https://lucide.dev) | Ícones |
| [Fontsource](https://fontsource.org) | Fontes hospedadas no próprio site: Syne, Plus Jakarta Sans e JetBrains Mono |
| CSS puro com tokens | Cores, tipografia e espaçamentos em variáveis CSS, com tema claro e escuro |
| [ESLint](https://eslint.org) | Padrão de código |

## Funcionalidades

- **Tema claro e escuro.** Segue o tema do sistema, guarda a escolha do visitante e aplica o tema antes da primeira pintura, sem piscar.
- **Trajetória animada.** O caminho se constrói uma vez ao entrar na tela: da esquerda para a direita no desktop, de cima para baixo no celular. Etapas simultâneas viram ramificações: o curso feito durante a formação sai e volta para a linha, e as duas atuações atuais seguem lado a lado no fim do caminho.
- **Cards de projeto com capturas reais**, feitas com dados fictícios ou simulados. Com mouse, a captura percorre a tela do app.
- **Transição entre o card e a página do projeto** com View Transitions. Sem suporte no navegador, a navegação continua normal.
- **Acessibilidade:**
  - link para pular ao conteúdo, foco visível e foco levado ao título a cada navegação;
  - menu do celular que fecha com Esc e devolve o foco;
  - respeito ao movimento reduzido do sistema;
  - layout que funciona com o texto ampliado a 200%.
- **Desempenho:**
  - imagens em WebP e carregadas sob demanda;
  - página de projeto em arquivo separado, baixado com o navegador ocioso;
  - título principal visível já na primeira pintura.
- **SEO e compartilhamento:** título e descrição por página, Open Graph, imagem de compartilhamento, `robots.txt` e `sitemap.xml`.

## Rodar o projeto

Requer Node.js 20 ou mais recente.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # checa os tipos e gera a pasta dist/
npm run preview    # serve a pasta dist/
npm run lint
npm run typecheck
```

### Domínio (URL canônica, imagem de compartilhamento e sitemap)

Essas metatags precisam do endereço público do site e só entram no build quando ele é informado:

```bash
SITE_URL=https://seu-dominio.com npm run build
```

Também dá para definir `SITE_URL=...` num arquivo `.env`. Sem ele, o build avisa e gera só o `robots.txt`.

## Editar o conteúdo

- **`src/data/profile.ts`:** nome, cargo, textos da abertura e de "Sobre mim", trajetória (`journey`), tecnologias e contatos.
  Listas e contatos vazios não aparecem no site. Cada etapa da trajetória tem:
  - `kind`: tipo, exibido acima do título (ex.: 'Formação', 'Atual');
  - `title`: onde aconteceu;
  - `text`: o que foi feito;
  - `icon`: `briefcase`, `graduation`, `wrench`, `network`, `globe`, `code` ou `map`;
  - `parallel: true`: a etapa aconteceu junto com a anterior e vira uma ramificação;
  - `current: true`: atuação atual, em destaque.
- **`src/data/projects.ts`:** projetos, na ordem em que aparecem. Cada um tem textos, estado atual (`working`, `experimental`,
  `planned`), decisões técnicas, capturas e links. `featured: true` deixa um projeto em destaque.
- **`public/projetos/<slug>/`:** capturas dos projetos, de preferência em WebP. Informe `width` e `height` reais para evitar saltos
  no layout. Capturas pelo menos tão altas quanto largas podem ser percorridas no hover do card.

## Estrutura

```
src/
  components/   cabeçalho, rodapé, abertura, cards, prévias, seções (sobre, trajetória, contato)
  pages/        página inicial, página de projeto e 404
  data/         perfil e projetos
  hooks/        título por rota e seção ativa do menu
  lib/          curvas de animação e transição da prévia
  styles/       tokens de design e estilos base
public/
  projetos/     capturas dos projetos
  og.png        imagem de compartilhamento
```

## Hospedagem

As rotas são resolvidas no navegador, então o servidor precisa devolver `index.html` para qualquer caminho:

- **Vercel:** já configurado em `vercel.json`.
- **Netlify:** já configurado em `public/_redirects`.
- **Cloudflare Pages:** funciona sem configuração.
- **GitHub Pages:** copie `dist/index.html` para `dist/404.html` depois do build.
