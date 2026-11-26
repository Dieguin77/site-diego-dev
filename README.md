# Diego Dev

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/hosted-GitHub%20Pages-222?logo=github&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

Landing page comercial de portfólio, criada para apresentar serviços de desenvolvimento web, projetos entregues e captar leads qualificados via WhatsApp.

## 🌐 Projeto Online

https://diegodev.dev.br

## Funcionalidades

- **Landing page orientada a conversão**, com múltiplas chamadas para ação (WhatsApp) ao longo da página
- **Teste A/B da seção hero** (headline, subheadline e CTA), com variante persistida por visitante via `localStorage`
- **Rastreamento de conversão** (cliques em CTA, cliques no WhatsApp, envio do formulário) integrado ao Google Analytics 4 (`gtag.js`), com histórico local de eventos como fallback
- **Formulário de contato sem back-end**: monta a mensagem a partir dos dados preenchidos e abre o WhatsApp diretamente com o texto pronto
- **Portfólio de projetos reais entregues**, com link direto para cada site em produção
- **FAQ em acordeão**, navegação com scroll-spy, barra de progresso de leitura e animações de entrada via `IntersectionObserver`
- **SEO técnico**: dados estruturados JSON-LD (`Organization`, `WebSite`, `FAQPage`), Open Graph, Twitter Cards, `sitemap.xml` e `robots.txt`
- **Banner de consentimento (LGPD)** para uso de armazenamento local
- **Acessibilidade**: skip link, `aria-label`/`aria-expanded` nos componentes interativos, respeita `prefers-reduced-motion`

## Tecnologias

- HTML5, CSS3 e JavaScript puro — sem framework ou etapa de build
- Google Analytics 4 (`gtag.js`) para métricas e eventos de conversão
- **Hospedagem**: GitHub Pages, com domínio próprio (`diegodev.dev.br`, configurado via `CNAME`)

## Estrutura do Projeto

```
├── index.html          # Landing page principal
├── servicos.html         # Página de serviços
├── contato.html           # Página de contato
├── script.js                # Menu mobile, teste A/B, tracking, FAQ, scroll-spy, formulário, LGPD
├── style.css                  # Estilos, tokens visuais e animações
├── imagem/                      # Screenshots dos projetos do portfólio e identidade visual
├── sitemap.xml / robots.txt       # SEO
└── CNAME                            # Domínio customizado do GitHub Pages
```

## Rodando Localmente

Site 100% estático, sem dependências:

```bash
git clone https://github.com/Dieguin77/site-diego-dev.git
cd site-diego-dev
```

Abra `index.html` diretamente no navegador, ou sirva a pasta com qualquer servidor estático (ex.: `npx serve .`).

## Licença

Este projeto está sob a licença MIT — veja o arquivo [LICENSE](LICENSE) para detalhes.

## Desenvolvedor

**Diego Batista Gomes Moraes**

GitHub: https://github.com/Dieguin77
