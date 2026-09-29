# Programadores do Amanhã — Guia de Cores e Tipografia

Sep 28, 2026 · @Raff

Este guia reúne as cores e as fontes que a Programadores do Amanhã usa hoje em seu site, organizadas para que designers, desenvolvedores e voluntários produzam materiais com a mesma cara. Os valores foram extraídos diretamente do site oficial (programadoresdoamanha.org.br) em 28/09/2026.

## Visão geral

A identidade combina um roxo profundo, um amarelo vibrante e uma tipografia de impacto. O fundo escuro dá seriedade e foco; o amarelo chama a atenção para o que importa (botões, destaques, números); o roxo em tons mais claros cria camadas e profundidade.

- **Energia:** amarelo #EDDC11 sobre roxo escuro, sempre em blocos pequenos e intencionais.
- **Contraste:** textos claros sobre fundos escuros, com contraste mínimo de 4,5:1 em todo o texto.
- **Impacto:** títulos em Dela Gothic One, texto corrido em IBM Plex Sans.

## Paleta principal

O amarelo e o roxo profundo são as duas cores que identificam a marca; as demais são variações para dar profundidade.

| Nome | HEX | RGB | Papel |
| --- | --- | --- | --- |
| Amarelo PdA | #EDDC11 | 237, 220, 17 | Cor de destaque: botões, links, números e ícones |
| Roxo Profundo | #270C27 | 39, 12, 39 | Fundo principal das páginas e seções escuras |
| Roxo Escuro | #4F174F | 79, 23, 79 | Cartões, painéis e camadas sobre o fundo |
| Roxo Médio | #942C94 | 148, 44, 148 | Elementos de apoio, faixas e áreas de ênfase |
| Orquídea | #D062D0 | 208, 98, 208 | Destaques secundários sobre fundo escuro |
| Azul Céu | #88C9F7 | 136, 201, 247 | Cor complementar: bordas, ilustrações e detalhes |

Proporção sugerida: cerca de 60% roxo (fundos), 25% neutros claros (texto e respiro), 10% amarelo (destaques) e 5% azul ou orquídea (detalhes).

## Cores de apoio e neutras

Os neutros vêm da escala de cinzas usada no site; as variações de amarelo servem para estados de foco, hover e fundos translúcidos.

| Nome | HEX | Uso |
| --- | --- | --- |
| Amarelo Claro | #F5EA70 | Hover do amarelo, fundos suaves de destaque |
| Amarelo Ouro | #FACC15 | Alertas e ícones de atenção |
| Amarelo Profundo | #302C03 | Texto sobre amarelo, sombras quentes |
| Branco | #FFFFFF | Texto principal sobre fundo roxo |
| Cinza 50 | #F9FAFB | Fundo claro e texto sobre roxo escuro |
| Cinza 200 | #E5E7EB | Bordas e divisores |
| Cinza 600 | #4B5563 | Texto secundário sobre fundo claro |
| Cinza 800 | #1F2937 | Texto forte sobre fundo claro |
| Cinza 900 | #111827 | Texto principal sobre fundo claro |

Transparências usadas no site: amarelo a 55% (rgba(237, 220, 17, 0.55)) e roxo escuro a 55% (rgba(79, 23, 79, 0.55)) para sobreposições; branco a 55% para textos de apoio.

## Acessibilidade e contraste

Todos os pares abaixo passam no mínimo de 4,5:1 (WCAG AA) para texto normal; o amarelo sobre branco não passa e não deve ser usado.

| Texto | Fundo | Contraste | Resultado |
| --- | --- | --- | --- |
| Branco #FFFFFF | Roxo Profundo #270C27 | 17,98:1 | Aprovado (AAA) |
| Amarelo #EDDC11 | Roxo Profundo #270C27 | 12,71:1 | Aprovado (AAA) |
| Amarelo #EDDC11 | Roxo Escuro #4F174F | 9,47:1 | Aprovado (AAA) |
| Azul Céu #88C9F7 | Roxo Profundo #270C27 | 10,05:1 | Aprovado (AAA) |
| Orquídea #D062D0 | Roxo Profundo #270C27 | 5,43:1 | Aprovado (AA) |
| Branco #FFFFFF | Roxo Médio #942C94 | 6,89:1 | Aprovado (AA) |
| Roxo Profundo #270C27 | Amarelo #EDDC11 | 12,71:1 | Aprovado (AAA) |
| Roxo Profundo #270C27 | Cinza 50 #F9FAFB | 17,20:1 | Aprovado (AAA) |
| Cinza 600 #4B5563 | Cinza 50 #F9FAFB | 7,23:1 | Aprovado (AAA) |
| Roxo Médio #942C94 | Cinza 50 #F9FAFB | 6,59:1 | Aprovado (AA) |
| Amarelo #EDDC11 | Branco #FFFFFF | 1,41:1 | Reprovado: não usar |

Em botões amarelos, use sempre texto Roxo Profundo. Em fundos claros, o amarelo serve só como detalhe decorativo, nunca como texto.

## Tipografia

O site usa duas famílias gratuitas do Google Fonts: Dela Gothic One para títulos de impacto e IBM Plex Sans para todo o restante.

| Família | Função | Pesos | Fallback |
| --- | --- | --- | --- |
| Dela Gothic One | Títulos, chamadas e números de destaque | 400 (único peso) | system-ui, sans-serif |
| IBM Plex Sans | Texto corrido, menus, botões, rótulos | 300, 400, 600, 700, 900 | system-ui, sans-serif |

Dela Gothic One é pesada e larga por natureza: use em MAIÚSCULAS ou caixa normal, em tamanhos grandes, e nunca aplique negrito nela. IBM Plex Sans 900 em maiúsculas é usada nos rótulos de seção e chamadas curtas; 600 em botões e links; 400 no texto corrido; 300 em textos leves de apoio.

## Escala tipográfica

Os tamanhos abaixo seguem o que o site aplica hoje (base de 16 px, altura de linha de 1,5). Os níveis de título maiores (H1 e H2) são extensões propostas na mesma lógica, para uso em materiais impressos e apresentações.

| Nível | Família e peso | Tamanho | Altura de linha | Caixa |
| --- | --- | --- | --- | --- |
| H1 (proposto) | Dela Gothic One 400 | 48 px | 56 px | Maiúsculas |
| H2 (proposto) | Dela Gothic One 400 | 30 px | 42 px | Maiúsculas |
| H3 | Dela Gothic One 400 | 24 px | 36 px | Maiúsculas |
| H4 | Dela Gothic One 400 | 18 px | 27 px | Normal |
| Destaque numérico | IBM Plex Sans 900 | 30 px | 54 px | Normal |
| Rótulo de seção | IBM Plex Sans 900 | 24 px | 36 px | Maiúsculas |
| Subtítulo | IBM Plex Sans 600 | 18 px | 27 px | Normal |
| Corpo | IBM Plex Sans 400 | 16 px | 24 px | Normal |
| Corpo leve | IBM Plex Sans 300 | 16 px | 24 px | Normal |
| Botão e link | IBM Plex Sans 600 | 16 px | 24 px | Normal |
| Legenda | IBM Plex Sans 400 | 12,8 px | 19,2 px | Normal |
| Legenda forte | IBM Plex Sans 600 | 12,8 px | 19,2 px | Normal |

No celular, reduza H1 para 32 px e H2 para 24 px, mantendo a mesma proporção de altura de linha.

## Regras de uso e tokens CSS

1. Fundo padrão: Roxo Profundo; texto padrão: Branco ou Cinza 50.
2. Use o amarelo em no máximo um elemento de destaque por bloco (botão, número ou título).
3. Nunca coloque texto amarelo sobre fundo claro nem texto roxo sobre roxo escuro.
4. Títulos sempre em Dela Gothic One; nunca use a fonte em parágrafos longos.
5. Limite de duas famílias por peça; não adicione outras fontes.

Tokens prontos para copiar:

```css
:root {
  --pda-amarelo: #EDDC11;
  --pda-amarelo-claro: #F5EA70;
  --pda-amarelo-profundo: #302C03;
  --pda-roxo-profundo: #270C27;
  --pda-roxo-escuro: #4F174F;
  --pda-roxo-medio: #942C94;
  --pda-orquidea: #D062D0;
  --pda-azul-ceu: #88C9F7;
  --pda-cinza-50: #F9FAFB;
  --pda-cinza-200: #E5E7EB;
  --pda-cinza-600: #4B5563;
  --pda-cinza-900: #111827;

  --fonte-titulo: 'Dela Gothic One', system-ui, sans-serif;
  --fonte-texto: 'IBM Plex Sans', system-ui, sans-serif;
}
```

Fontes: [Dela Gothic One](https://fonts.google.com/specimen/Dela+Gothic+One) e [IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans) no Google Fonts.
