# Design System — PdA Perfis

Especificação visual **aprovada** do portal. Substitui as direções exploratórias anteriores: o que está aqui é o que foi validado no protótipo e deve ser traduzido para o `apps/frontend`.

- **Protótipo de referência**: https://claude.ai/artifact/24S4CejHRfQdrvYLuoc4Zi
- **Marca (mandatório)**: [`Programadores do Amanhã — Guia de Cores e Tipografia.md`](Programadores%20do%20Amanh%C3%A3%20%E2%80%94%20Guia%20de%20Cores%20e%20Tipografia.md)
- **Arquitetura de telas**: [docs/frontend-plan.md](frontend-plan.md)

O tema **escuro é o padrão** — a marca define "fundo padrão: Roxo Profundo". O claro é uma alternativa desenhada à parte, nunca uma inversão automática.

---

## 1. Tipografia

Quatro vozes com papéis que não se misturam. Essa separação é a regra mais importante do sistema: foi o uso da Dela Gothic em títulos de seção que fazia a interface ler como peça gráfica em vez de produto.

| Papel | Família | Onde aparece |
|---|---|---|
| **Impacto de marca** | Dela Gothic One 400 | H1 do hero, wordmark, espécime "Perfis", nomes nos cartões de aluno. Sempre caixa alta |
| **Títulos de seção** | Bricolage Grotesque 700 | Todos os `h2`. Caixa baixa |
| **Interface e corpo** | IBM Plex Sans 300–900 | Leads, corpo, labels, botões, navegação |
| **Dado técnico** | IBM Plex Mono 400–600 | Hex, percentuais, endpoints, contadores, versões, tempos |

> Nota de conformidade: o guia da marca pede "duas famílias por peça". Aqui são quatro, com justificativa — Plex Sans e Plex Mono são a mesma superfamília, e a Bricolage entrou porque a Plex Sans como fonte de título foi reprovada por ser genérica. A Dela Gothic segue sendo a voz de marca, só que reservada ao impacto.

### Escala

| Token | Tamanho | Entrelinha | Tracking |
|---|---|---|---|
| `display` (hero) | `clamp(34px, 4.4vw, 62px)` | 0.87 | −0.038em |
| `h-sec` | `clamp(30px, 4vw, 50px)` | 1.02 | −0.032em |
| `h-sub` | 21px | — | −0.022em |
| `lead` | 19px | 1.55 | −0.012em |
| `body` | 15px | 1.60 | −0.006em |
| `label` | 10px / peso 600 / caixa alta | — | **+0.2em** |
| `mono` | 10.5–11.5px | — | — |

Regras óticas: tracking negativo cresce com o tamanho; `text-wrap: balance` nos títulos e `pretty` nos parágrafos; leitura travada em **52ch**; `font-variant-numeric: tabular-nums` em todo número; linhas do H1 com `white-space: nowrap` para não quebrarem no meio da frase.

---

## 2. Cor

Valores da marca são mandatórios. Os tokens semânticos abaixo são a camada de aplicação.

```css
.t-dark{
  --bg:#270C27; --nav:rgba(39,12,39,.80); --surface:rgba(79,23,79,.34); --raise:rgba(249,250,251,.06);
  --fg:#F9FAFB; --muted:rgba(249,250,251,.64); --faint:rgba(249,250,251,.46);
  --hair:rgba(249,250,251,.11); --hair2:rgba(249,250,251,.26);
  --acc-text:#EDDC11; --tint:rgba(237,220,17,.14); --kbd:rgba(249,250,251,.07); --spark:#EDDC11;
}
.t-light{
  --bg:#F4F2F5; --nav:rgba(244,242,245,.82); --surface:#FFFFFF; --raise:rgba(39,12,39,.045);
  --fg:#270C27; --muted:#4B5563; --faint:rgba(39,12,39,.6);
  --hair:rgba(39,12,39,.09); --hair2:rgba(39,12,39,.22);
  --acc-text:#942C94; --tint:rgba(148,44,148,.10); --kbd:rgba(39,12,39,.05); --spark:#942C94;
}
```

Três regras que não se quebram:

1. **Amarelo nunca é cor de texto sobre fundo claro** (1,41:1, reprovado). No tema claro o acento textual é **Roxo Médio `#942C94`** (6,59:1).
2. **Um destaque em amarelo por bloco** — regra da própria marca.
3. **Fundo de página ≠ fundo de cartão.** O cartão escuro usa `#4F174F`, que o guia define como "cartões, painéis e camadas sobre o fundo". Usar `#270C27` nos dois funde o componente na página.

**Cores secundárias em função de dado**, nunca decorativa: Azul Céu `#88C9F7` (em formação, setas do diagrama, foco), Amarelo `#EDDC11` (formados, acento), Orquídea `#D062D0` (empregados), Roxo Médio `#942C94` (quarta série).

> Implementação: declarar os tokens em **classe de tema** (`.t-dark` / `.t-light`) aplicada na raiz, não em `:root`. Custom properties passadas via atributo `style` inline podem ser descartadas pelo runtime, e aí toda regra com `var()` vira inválida silenciosamente.

---

## 3. Forma e material

```css
--r-sm:10px;  /* logo, índice de seção */
--r-md:14px;  /* contêiner de ícone */
--r-lg:18px;  /* superfícies, cartões, tiles */
--r-pill:999px; /* botões, chips, pills, avatares, campos */
```

### Vidro

O vidro só lê como vidro se houver luz atrás. São quatro camadas, e nenhuma funciona sozinha:

1. **Luz ambiente** — três halos radiais amplos e de baixa opacidade (roxo médio, azul céu, orquídea), em camada `position:fixed; z-index:-1`, sob todo o conteúdo. É a fonte de luz que o vidro refrata.
2. **Material** — `background: var(--glass)` + `backdrop-filter: blur(22px) saturate(180%)` (18px em controles). A **saturação é obrigatória**: sem ela a cor de trás chega lavada e o efeito vira cinza translúcido.
3. **Quina especular** — `inset 0 1px 0 var(--spec)`, a linha de luz no topo. É o detalhe que mais vende materialidade.
4. **Sombra em duas camadas** — contato de 1px + ambiente ampla com offset negativo.

```css
/* escuro */
--glass:rgba(249,250,251,.05);  --glass-hi:rgba(249,250,251,.085);
--edge:rgba(249,250,251,.13);   --edge-hi:rgba(249,250,251,.28);  --spec:rgba(249,250,251,.12);
--depth:0 1px 2px rgba(0,0,0,.3),0 18px 40px -24px rgba(0,0,0,.8);
--depth-hi:0 2px 8px rgba(0,0,0,.34),0 32px 64px -28px rgba(0,0,0,.92);
/* claro */
--glass:rgba(255,255,255,.56);  --glass-hi:rgba(255,255,255,.8);
--edge:rgba(39,12,39,.08);      --edge-hi:rgba(39,12,39,.18);     --spec:rgba(255,255,255,.95);
--depth:0 1px 2px rgba(39,12,39,.05),0 16px 36px -24px rgba(39,12,39,.26);
--depth-hi:0 2px 8px rgba(39,12,39,.07),0 30px 60px -28px rgba(39,12,39,.32);
```

---

## 4. Movimento

| Uso | Duração | Curva |
|---|---|---|
| Hover, cor, foco | 170ms | `cubic-bezier(.4,0,.2,1)` |
| Elevação, deslocamento, sombra | 260–300ms | `cubic-bezier(.32,.72,0,1)` |
| Entrada do hero (escalonada) | 620ms, atrasos de 80ms | `cubic-bezier(.32,.72,0,1)` |

Todo elemento clicável tem **estado de pressão** (`scale(.978)` em botões, `.93` em ícones). `prefers-reduced-motion: reduce` desliga transições e animações e neutraliza os hovers com transform.

---

## 5. Componentes

| Componente | Especificação |
|---|---|
| **Navegação** | 68px, `sticky`, `backdrop-filter: saturate(180%) blur(20px)`, hairline inferior. Links em peso 500 e cor secundária; item atual em cor plena com fundo `--raise` |
| **Busca ⌘K** | Cápsula de 36px, mín. 214px, ícone + rótulo + tecla. Colapsa para ícone abaixo de 920px |
| **Botão** | Cápsula de 52px. Rótulo à esquerda + **chip circular de 36px** com o ícone. Primário: fundo `#EDDC11`, chip `#270C27`. Fantasma: vidro + hairline |
| **Pill de status** | 24px, cápsula, ponto colorido de 6px + rótulo, fundo tingido a ~16% |
| **Segmentado** | Trilho em cápsula com padding de 4px; item ativo vira pílula amarela. **Estado funcional** — troca o filtro e o contador |
| **Campo** | Cápsula de 42px, fundo sutil, borda de foco `#88C9F7` |
| **Card de métrica** | Vidro, raio `lg`. Rótulo → número em mono 38px → chip de variação → 12 barras de tendência arredondadas |
| **Tile da vitrine** | Vidro. Avatar circular, nome, turma, pill de status, faixa de 18 células de atividade, stack em pills |
| **Contêiner de ícone** | 40px, raio `md`, fundo `--tint`, preenche sólido e cresce 6% no hover do cartão |
| **Link** | Varredura de marcador amarelo por baixo do texto, da esquerda para a direita |
| **Anel de composição** | SVG, r=54, traço 15, três arcos com folga entre si, total no centro |

### Cartão do aluno

O componente de marca. Três camadas rotacionadas e deslocadas + `clip-path: polygon(0 0,93% 0,100% 7%,100% 100%,0 100%)` combinado com `border-radius: var(--r-lg)` — o raio arredonda os três cantos normais e o polígono mantém o corte diagonal. Avatar circular, barra de linguagens com pontas arredondadas, grade de atividade com células de 2px.

Três variantes:

| Variante | Superfície | Texto | Camadas atrás |
|---|---|---|---|
| Escuro | `#4F174F` | `#F9FAFB` | Orquídea → Roxo Médio |
| Claro | `#FFFFFF` | `#270C27` | Amarelo Claro → Cinza 200 |
| Amarelo | `#F5EA70` | `#302C03` | Roxo Médio → Amarelo |

A variante amarela usa **Amarelo Claro, não o `#EDDC11` pleno** — o amarelo de saturação total aparece só como lâmina fina atrás. Nela, o ponto de legenda e a barra de linguagens levam anel escuro de 1px (senão o segmento amarelo some no fundo), e o realce de hover dos links vira tinta escura.

---

## 6. Acessibilidade

Pares verificados: branco sobre roxo profundo 17,9:1 · amarelo sobre roxo profundo 12,7:1 · `--muted` escuro 7,2:1 · cinza 600 sobre cinza 50 7,2:1 · texto do cartão amarelo 11,3:1 · secundário do cartão amarelo 5,1:1.

Foco visível em `2px solid #88C9F7` com offset de 3px. Hierarquia de heading sem pulos (`h1 → h2 → h3`); títulos de seção são `h2` reais, não `div` estilizados. Ícones decorativos com `aria-hidden`; controles só de ícone com `aria-label`. Diagramas com `role="img"` e descrição.

---

## 7. O que evitar

Aprendizados das iterações, todos custaram uma revisão:

- Dela Gothic em tamanho médio para títulos de seção → lê como peça gráfica.
- Cantos 100% retos em toda a interface → o raio é o que mais separa "pôster" de "produto".
- Cartão com a mesma cor do fundo da página.
- Superfície translúcida sem luz atrás, ou blur sem `saturate`.
- Remover fundo **e** borda de um bloco repetido: sem nenhum dos dois, itens da mesma lista perdem a separação. A saída é cartão contornado.
- Gradiente diagonal saturado e "blob" difuso — o roxo é justamente a cor mais associada ao visual genérico de IA; a defesa é tratamento geométrico, luz ambiente sutil e amarelo em blocos pequenos.
