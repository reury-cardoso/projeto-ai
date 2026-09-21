# PdA Perfis — Portal de Perfis dos Alunos

Portal que agrega e exibe os perfis profissionais dos alunos do **Programadores do Amanhã (PdA)**, integrando dados públicos do **LinkedIn** e do **GitHub** para dar visibilidade à jornada de formação e empregabilidade dos jovens da organização.

## Sobre o Programadores do Amanhã (PdA)

O PdA é uma organização sem fins lucrativos (ONG) de inclusão social e digital.

- **Foco:** cursos gratuitos de programação, inglês e soft skills para jovens negros, pardos e indígenas em situação de vulnerabilidade social.
- **Objetivo:** gerar renda e empregabilidade, apoiando a conquista do primeiro emprego em tecnologia.
- **Apoio:** infraestrutura de estudos (incluindo doação de computadores) e suporte financeiro/terapêutico durante a formação.
- **Parcerias:** conexão dos alunos formados com empresas parceiras que buscam diversidade em seus times de tecnologia.

Saiba mais e apoie a iniciativa na página de doações do Programadores do Amanhã.

## O que este projeto faz

O portal consolida, em um único lugar, os perfis dos alunos, combinando:

- **Dados do LinkedIn**: experiência, formação, headline, etc.
- **Dados do GitHub**: repositórios, contribuições, linguagens utilizadas, atividade.

O objetivo é criar uma vitrine pública dos alunos formados/em formação, facilitando o trabalho de recrutadores e empresas parceiras interessadas em contratar talentos do PdA.

## Arquitetura

Monorepo gerenciado com **NX**, dividido em:

- **`apps/frontend`** — aplicação web em **React + Next.js**, responsável pela listagem e visualização dos perfis dos alunos.
- **`apps/backend`** — API em **Node.js + NestJS**, responsável por buscar, agregar, tratar e servir os dados de LinkedIn e GitHub.

O backend segue o padrão arquitetural **MVC** e princípios **SOLID** para organização das camadas (controllers, services/módulos de domínio, models/DTOs).

> Estrutura de pastas detalhada do monorepo será documentada aqui conforme o workspace NX for criado.

## Como rodar o projeto

> Projeto em fase inicial — instruções de setup serão adicionadas assim que o workspace NX, o app Next.js e o app NestJS forem criados.

## Status

🚧 Em estruturação inicial (definição de monorepo, apps e padrões de projeto).

## Licença

A definir.
