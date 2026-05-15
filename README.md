# YieldScope — DeFi Analytics Platform

Plataforma de descoberta e análise de oportunidades DeFi, com foco em dados reais via APIs públicas, simuladores e ferramentas educacionais.

## Stack

- **React 19** + **TypeScript** + **Vite**
- **TailwindCSS v4** — dark theme premium
- **TanStack Query** — cache e data fetching
- **React Router v7** — roteamento com lazy loading
- **Recharts** — gráficos de simulação
- **lucide-react** — ícones

## Páginas

| Rota | Descrição |
|---|---|
| `/pools` | Tabela principal de pools DeFi (DefiLlama) |
| `/earn` | Buscador de rendimento por token |
| `/learn` | Guias educacionais DeFi em português |
| `/lend` | Simulador de empréstimo (Health Factor, Liquidação) |
| `/liquidity-calc` | Calculadora de LP e Impermanent Loss |
| `/stake` | Stake SOL → LST via Jupiter |
| `/whale-tracker` | Análise de carteiras em múltiplas chains |
| `/bitcoin-lab` | Análise de pools BTC (parcialmente PRO) |
| `/pro` | Plano PRO — benefícios e lista de espera |

## Instalação e execução

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha as chaves opcionais:

```bash
cp .env.example .env
```

| Variável | Descrição | Obrigatório |
|---|---|---|
| `VITE_HELIUS_API_KEY` | Helius API (Solana RPC) — Whale Tracker | Não |
| `VITE_ALCHEMY_API_KEY` | Alchemy — Whale Tracker EVM | Não |
| `VITE_ETHERSCAN_API_KEY` | Etherscan — Whale Tracker EVM | Não |
| `VITE_COVALENT_API_KEY` | Covalent — multi-chain | Não |
| `VITE_FIREBASE_API_KEY` | Firebase Auth | Não |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | Não |
| `VITE_PRO_TOKEN_SYMBOL` | Símbolo do token PRO (padrão: yldSOL) | Não |
| `VITE_PRO_TOKEN_MIN_AMOUNT` | Quantidade mínima do token PRO (padrão: 10) | Não |

> Sem chaves configuradas, o Whale Tracker exibe dados demonstrativos claramente marcados.

## APIs utilizadas

| API | URL | Uso |
|---|---|---|
| DefiLlama Yields | `https://yields.llama.fi/pools` | Dados de pools |
| DefiLlama Protocols | `https://api.llama.fi/protocols` | Dados de protocolos |
| DefiLlama Coins | `https://coins.llama.fi/prices/current/...` | Preços de tokens |
| Frankfurter | `https://api.frankfurter.app/latest` | Câmbio USD/BRL |
| Jupiter Price | `https://price.jup.ag/v6/price` | Preços Solana |

Todas as APIs principais são **públicas e gratuitas**, sem necessidade de chave.

## Deploy na Vercel

1. Faça push do projeto para um repositório GitHub
2. Importe o repositório no painel da Vercel
3. Configure as variáveis de ambiente opcionais
4. Deploy automático a cada push

O arquivo `vercel.json` já está configurado para roteamento SPA:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

## Arquitetura

```
src/
├── components/
│   ├── layout/     AppLayout, Sidebar, Topbar, MobileNav
│   ├── pools/      PoolTable, PoolFilters
│   └── ui/         Badge, Button, Card, MetricCard, RiskBadge, ChainBadge...
├── pages/          Uma página por rota
├── services/       defillama, jupiter, prices, explorers, whales
├── hooks/          useYieldPools, useFilteredPools, useLocalStorage, useWallet
├── utils/          format, riskScore, calculations
├── types/          defi.ts, wallet.ts
└── config/         chains.ts, protocols.ts, env.ts
```

## Score de risco

O YieldScope calcula um score de 0–100 para cada pool:

| Fator | Pontos |
|---|---|
| TVL > $100M | +25 |
| TVL > $10M | +15 |
| TVL > $1M | +8 |
| Stablecoin | +10 |
| APY 1%–20% | +20 |
| APY 20%–60% | +10 |
| APY > 100% | −30 |
| Sem IL risk | +15 |
| Com IL risk | −15 |
| Exposure single | +10 |
| Protocolo confiável | +10 |

**80–100**: Baixo · **60–79**: Moderado · **40–59**: Alto · **0–39**: Crítico

## Aviso de risco

> Dados on-chain e APIs públicas podem conter atraso ou inconsistência. APYs são estimativas e podem mudar a qualquer momento. **Isto não é recomendação financeira.** Sempre faça sua própria pesquisa (DYOR).
