# Coworking / Vue 3

[Read in English](./README.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE) ![Free](https://img.shields.io/badge/price-free-brightgreen)

App de coworking em Vue 3 + Tailwind: site de reservas (espaços, planos), mapa de espaços por status, reservas, membros e planos, financeiro e dashboard (ocupação, membros, receita). i18n pt-BR/en/es, PWA, dark mode.

## Destaques

- Mapa de espaços por status (mesas/salas)
- Reservas com check-in e planos de membros
- Membros, financeiro e mensalidades
- Dashboard: ocupação, membros, receita
- i18n pt-BR/en/es, PWA, dark mode

## Telas em destaque

- Espaços: Tipos e reserva
- Mapa: Status por andar
- Membros: Planos e financeiro
- Dashboard: Ocupação e receita

## Stack

- Vue 3
- TypeScript
- Vite 6
- Tailwind CSS v4
- Pinia
- Vue Router 4
- ApexCharts
- VeeValidate

## Requisitos

- Node.js 20 ou mais novo, com npm

## Como rodar

```bash
npm install
npm run dev
```

O servidor de desenvolvimento mostra a URL local para abrir.

Conta de demonstração:

- `gestor@coworking.com` / `demo123`

## Build de produção

```bash
npm run build
```

Gera o pacote de produção em `dist/`; para conferir localmente, `npm run preview`. Qualquer hospedagem estática serve; para as rotas no cliente, redirecione caminhos desconhecidos para `index.html`.

## Estrutura do projeto

```
src/
├── assets/  styles
├── components/  app, cw, layout, ui
├── composables/
├── data/
├── i18n/  locales
├── lib/
├── router/
├── stores/
├── views/  app, public
```

## Outras tecnologias

Este template também existe em outras 4 tecnologias, com as mesmas telas e a mesma identidade visual. Todas são gratuitas:

- React 19: https://github.com/danilo62x/coworking-react
- Angular 19: https://github.com/danilo62x/coworking-angular
- Laravel 11: https://github.com/danilo62x/coworking-laravel
- HTML estático: https://github.com/danilo62x/coworking-html

Mais templates gratuitos (painéis admin, sistemas por segmento e apps Flutter): https://github.com/danilo62x?tab=repositories

## Licença

[MIT](./LICENSE), copyright 2026 Danilo Quinelato.
