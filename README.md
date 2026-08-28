# projeto-tg

Calculadora web feita com React, TypeScript e Vite.

## Funcionalidades

- Visor acumulativo: o cálculo completo aparece no visor até o usuário pressionar `=`
- Operações: soma (`+`), subtração (`-`), multiplicação (`X`) e divisão (`/`)
- Números decimais (`.`)
- Avaliação progressiva da esquerda para a direita em operações encadeadas
- Botão `C` para corrigir/apagar o número em digitação
- Divisão por zero exibe `Error`

## Stacks

- React 19
- TypeScript 6
- Vite 8
- Sass (SCSS)
- pnpm (workspace com um único pacote)

## Como rodar

Pré-requisitos: [Node.js](https://nodejs.org) e [pnpm](https://pnpm.io).

```sh
pnpm install
pnpm dev
```

## Scripts

| Script        | Descrição                          |
| ------------- | ---------------------------------- |
| `pnpm dev`    | Sobe o servidor de desenvolvimento |
| `pnpm build`  | Compila e gera o bundle de produção|
| `pnpm preview`| Previsualiza o build de produção   |
| `pnpm lint`   | Executa o ESLint                   |