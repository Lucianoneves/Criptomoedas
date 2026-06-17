# Criptomoedas

Aplicação web para listar criptomoedas e visualizar detalhes de cada ativo (preço, valor de mercado, volume e variação 24h) usando a API do CoinCap.

## Funcionalidades

- Listagem de criptomoedas com paginação ("Carregar mais")
- Busca por nome/slug (ex: `bitcoin`) e navegação para detalhes
- Página de detalhes por rota dinâmica (`/detail/:cripto`)
- Formatação de valores em USD (padrão `en-US`) e indicação de alta/baixa na variação 24h

## Rotas

- `/` — Home (lista + busca)
- `/detail/:cripto` — Detalhes (ex: `/detail/bitcoin`)

## Tecnologias

- React
- TypeScript
- Vite
- React Router DOM
- CSS Modules

## Requisitos

- Node.js (LTS recomendado)
- NPM (ou outro gerenciador compatível)

## Como rodar o projeto

1) Instale as dependências:

```bash
npm install
```

2) (Recomendado) Configure a chave da API do CoinCap (v3).

Crie um arquivo `.env` na raiz do projeto e adicione:

```bash
VITE_COINCAP_API_KEY=SEU_TOKEN_AQUI
```

3) Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação será servida em um endereço local mostrado no terminal (ex: `http://localhost:5173`).

## Scripts

- `npm run dev` — ambiente de desenvolvimento
- `npm run build` — build de produção
- `npm run preview` — preview do build

## Estrutura (resumo)

- `src/router.tsx` — definição das rotas
- `src/pages/home` — listagem e busca
- `src/pages/detail` — detalhes do ativo
- `src/components` — componentes reutilizáveis (layout, header, etc.)

## Fonte de dados

- CoinCap API v3 (`https://rest.coincap.io/v3/...`)

Observação: alguns endpoints podem exigir autenticação via Bearer Token.