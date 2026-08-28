# Personas Sintéticas Vivas na Prática — landing page

Página de vendas da formação **Personas Sintéticas Vivas na Prática**, da Onda Lab.
HTML, CSS e JavaScript estáticos. Sem framework, sem build, sem backend.

## Rodar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

Abrir o `index.html` direto pelo `file://` também funciona.

## Estrutura

```
.
├── index.html          # a página inteira, em 16 seções
├── styles.css          # sistema visual (tokens, componentes, responsivo)
├── script.js           # ~2 KB, opcional: a página funciona sem ele
├── favicon.svg
├── assets/
│   ├── logo-ondalab.svg        # extraído do vetor oficial; usa currentColor
│   ├── icons/
│   │   ├── logomarca.svg
│   │   ├── favicon-32.png
│   │   └── apple-touch-icon.png
│   └── images/
│       ├── andreia-antunes.jpg / .webp
│       ├── julia-salgado.jpg   / .webp
│       └── og-psv.jpg          # 1200×630, compartilhamento social
└── _fontes/            # material de origem — fora do Git (ver .gitignore)
```

## Pendências antes de publicar

| # | Item | Situação |
|---|------|----------|
| 1 | **Checkout da Hotmart** — `https://pay.hotmart.com/I107368837V` já está nos 7 CTAs e no JSON-LD. | ⚠️ **A URL responde com erro.** Ver abaixo. |
| 2 | IDs de analytics (GA4, Meta Pixel, Hotmart). Não foram inventados: há um bloco comentado no `<head>` indicando onde entram. | pendente |
| 3 | Fotos das pessoas que deram depoimento. Hoje o lugar da foto é resolvido com a aspa gráfica da marca. | pendente |
| 4 | Contato no rodapé. | decidido: não haverá |
| 5 | Domínio `psv.ondalab.com.br`. | definido, falta apontar o DNS |

### ⚠️ O checkout está retornando erro

`https://pay.hotmart.com/I107368837V` redireciona para
`https://pay.hotmart.com/error?errorMessage=005`. Testado com user-agent de
navegador e com as variações usuais de parâmetro (`?checkoutMode=10`, `?off=`) —
o resultado é o mesmo. O link está no código exatamente como foi passado; o que
precisa ser verificado é o estado da oferta no painel da Hotmart (produto ainda
em rascunho, oferta não publicada ou fora do período de vendas produzem esse erro).

**Conferir antes de divulgar a página.** Se a URL mudar, é uma substituição só:

```bash
sed -i '' 's#https://pay.hotmart.com/I107368837V#NOVA_URL#g' index.html
```

## Publicação em psv.ondalab.com.br

O arquivo `CNAME` na raiz já traz o domínio. Faltam dois passos, ambos fora do
código:

1. **No repositório** — Settings › Pages › Source: `Deploy from a branch`,
   branch `main`, pasta `/ (root)`. Marcar *Enforce HTTPS* depois que o
   certificado for emitido.
2. **No DNS de `ondalab.com.br`** — criar um registro `CNAME`:

   | Tipo | Nome | Valor |
   |------|------|-------|
   | CNAME | `psv` | `juliasalgado28.github.io` |

O certificado do GitHub costuma levar alguns minutos depois que o DNS propaga.

**Atenção:** habilitar o GitHub Pages torna a página pública, mesmo com o
repositório privado. Não foi habilitado — isso é decisão da Julia.

## Sistema visual

Derivado do brandbook Onda Lab (identidade visual, fev/2020) e da arte da formação.

| Cor | Hex | Uso |
|-----|-----|-----|
| Marinho | `#2C2E83` | títulos, botões, campos de destaque |
| Turquesa | `#2AB4AE` | seção de pesquisa conversacional, detalhes |
| Ouro | `#F9B233` | acentos, CTA sobre fundo escuro |
| Terracota | `#DC742E` | faixa de prova social, grafismo |
| Dourado campo | `#F8E6C4` | fundo da seção de investimento |

**Medida de leitura.** O corpo padrão roda a ~66 caracteres por linha. As três
seções mais textuais usam `.coluna--larga`: 54 rem com corpo de 1,12 rem, o que dá
~79 caracteres — mais largo sem passar do limite confortável de leitura. O tamanho
é declarado no contêiner e desce por herança, para não atropelar `.ancora`,
`.fecho` e `.destaque`, que têm escalas próprias.
| Terracota tinta | `#A05421` | versão do terracota aprovada para texto |
| Bege | `#EFECE3` | fundos de seção |
| Creme | `#F7F5F1` | cartões |

**Grafismo:** o padrão de ondas vem do símbolo `)))` da marca, redesenhado como
`<pattern>` SVG e reaproveitado por hero, seção do ativo e fechamento. No mobile
ele vira acento de canto para não passar por baixo do texto.

**Tipografia** (Google Fonts):

- **Playfair Display** — títulos. Faz a ponte com a arte da formação que já circula.
- **Poppins** — corpo. É a fonte de apoio definida no brandbook.
- **Yanone Kaffeesatz** — etiquetas, datas e numerais. É a fonte principal do
  brandbook, aqui usada em papel de destaque por ser uma condensada de display.

## Decisões técnicas

- **FAQ e módulos usam `<details>`/`<summary>` nativos.** Funcionam por teclado, em
  leitores de tela e com JavaScript desligado. O conteúdo dos módulos fica no DOM
  mesmo recolhido — nada é carregado sob demanda.
- **O JavaScript é dispensável.** Ele só cuida do ano no rodapé, da barra fixa de
  CTA no mobile e de uma animação de entrada discreta. Sem ele a página continua
  completa; a animação nem chega a ser aplicada.
- **A animação de entrada é blindada.** Só afeta elementos que já nascem abaixo da
  dobra, e um temporizador de 2,5 s revela tudo caso o `IntersectionObserver`
  falhe. Numa página de vendas, conteúdo preso invisível é perda de venda.
- **Sem imagem no hero.** A primeira dobra é tipografia e grafismo da marca, o que
  deixa o LCP leve. Os retratos entram abaixo da dobra com `loading="lazy"` e
  dimensões declaradas.

## Verificações feitas

- Contraste: auditoria automática sobre a página renderizada em 390 px, 768 px e
  1200 px — 265 elementos de texto, nenhuma falha em WCAG AA.
- Sem overflow horizontal em nenhuma dessas larguras.
- Um único `<h1>`, sem pulos na hierarquia de headings.
- JSON-LD válido, só com fatos das fontes: sem avaliação, nota ou nº de alunos.
- Nenhum contador, escassez falsa, preço riscado, selo inventado ou ID fictício.
- A engenharia proprietária do método não aparece na página (verificado por busca:
  Camada Zero, Dossiê Master, ED/EC/IC/CFC/L, RAG, Prompts Variáveis, mapa de
  cobertura, inventário de fontes, auditoria de diferenciação, versionamento).
- Sem bibliotecas externas além do Google Fonts.

## Hospedagem

A página é estática e roda em qualquer servidor de arquivos, incluindo GitHub
Pages. Publicar a raiz do projeto é suficiente; `_fontes/` fica de fora pelo
`.gitignore`.

## Histórico

**v2 — ajustes de `Ajustes página de vendas PSV_v2`**

Foco do documento: reduzir repetição e **não expor publicamente a engenharia do
método**, que é parte do que a pessoa está comprando. Isso inverteu uma exigência
do briefing original, que mandava preservar esses detalhes; a instrução mais
recente prevaleceu.

- Hero: título passou a ser “Formação em Pesquisa com IA”, com o nome da formação
  como subtítulo.
- Seções: 18 → 16. “O diferencial está no método” e “Você aprende o método, o
  ativo fica com você” viraram uma só, “Você aprende o método, não uma ferramenta”.
  “Uma formação para aprender fazendo” saiu, com as mensagens redistribuídas.
- Método: 5 etapas → 4 (organizar, construir, ativar, testar e governar).
- Entregas: 6 cards → 4. Exemplos de uso: 9 → 6. FAQ: 11 → 9 perguntas.
- Módulos: deixaram de listar Camada Zero, Dossiê Master, ED/EC/IC/CFC/L, RAG,
  mapa de cobertura, Prompts Variáveis e afins. Viraram cartões 2×2.
- Para quem: reagrupado em Pesquisa e Insights / CX, UX e Produto / Marketing,
  Estratégia e Inovação. Todos os 15 itens originais foram mantidos, só
  redistribuídos.
- Investimento: campo dourado `#F8E6C4`, mais quente e com mais destaque.
- Bios das professoras enxutas; fotos de 150 px para 190 px (220 px no desktop).

Resultado: desktop 18.822 px → 15.040 px de altura (−20%); mobile −16%.

**v3 — ajustes de `Ajustes página de vendas PSV_v3`**

Foco do documento: layout e textos.

- Seções “A pesquisa não termina mais no relatório”, “O que é uma Persona Sintética
  Viva” e “Você aprende o método, não uma ferramenta” ganharam blocos mais largos
  (`.coluna--larga`), aproveitando melhor os espaços laterais.
- Frase de destaque da seção “Pesquisa conversacional” passou a ser “Saber
  diferenciar entre o que é evidência, o que é interpretação e aquilo que ainda não
  sabemos.”
- Módulos voltaram ao accordion vertical: um box por linha, com número, título e
  subtítulo sempre visíveis e seta para expandir. Todos recolhidos por padrão.
