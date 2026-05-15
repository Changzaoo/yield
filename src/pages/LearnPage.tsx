import { useState, useMemo } from 'react'
import { BookOpen, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/components/ui/cn'

type Level = 'Iniciante' | 'Intermediário' | 'Avançado'

interface Module {
  id: string
  title: string
  level: Level
  summary: string
  content: string
  emoji: string
  tags: string[]
}

const MODULES: Module[] = [
  {
    id: 'what-is-apy',
    title: 'O que é APY?',
    level: 'Iniciante',
    emoji: '📈',
    summary: 'APY (Annual Percentage Yield) é o rendimento anual de um investimento, incluindo os efeitos dos juros compostos.',
    tags: ['rendimento', 'básico', 'DeFi'],
    content: `**APY (Annual Percentage Yield)** é o rendimento percentual anual de um investimento, levando em conta os juros compostos — ou seja, os juros sobre os juros acumulados.

**Exemplo prático:**
- Você deposita R$1.000 com APY de 12%
- No final do ano, você terá R$1.120 (sem considerar compound mais frequente)
- Com compound diário, o resultado é ligeiramente maior

**Por que o APY é importante no DeFi?**
No DeFi, os rendimentos são frequentemente calculados por bloco ou por dia, o que significa que o compound ocorre com muita frequência. Um APY alto pode parecer atraente, mas é crucial entender:
1. De onde vem o rendimento (taxas reais ou emissão de tokens?)
2. Qual o risco associado
3. Se o APY é sustentável a longo prazo

⚠️ **Atenção:** APYs acima de 100% ao ano geralmente dependem de emissão de tokens de recompensa, que podem perder valor rapidamente.`,
  },
  {
    id: 'what-is-tvl',
    title: 'O que é TVL?',
    level: 'Iniciante',
    emoji: '🏦',
    summary: 'TVL (Total Value Locked) é o valor total em dólares bloqueado em um protocolo DeFi.',
    tags: ['métricas', 'básico', 'DeFi'],
    content: `**TVL (Total Value Locked)** é o valor total de ativos depositados em um protocolo DeFi em um determinado momento.

**Como é calculado?**
- Soma de todos os depósitos (tokens, stablecoins, ETH, etc.) convertidos para USD
- Atualizado em tempo real conforme os preços variam

**Por que o TVL importa?**
1. **Indicador de confiança:** Um TVL alto sugere que muitos usuários confiam no protocolo
2. **Liquidez:** Mais TVL geralmente significa menos slippage em swaps e melhor disponibilidade de empréstimos
3. **Segurança relativa:** Protocolos maiores tendem a ter mais auditorias e mais atenção da comunidade

**TVL alto = seguro?**
Não necessariamente. Um TVL alto reduz alguns riscos, mas:
- Não protege contra bugs no contrato inteligente
- Não garante que o código foi auditado corretamente
- Não elimina risco de manipulação de oráculos

📊 **Fonte dos dados:** O Crescer usa a API do DefiLlama, referência global em dados DeFi, para exibir os TVLs em tempo real.`,
  },
  {
    id: 'apr-vs-apy',
    title: 'Diferença entre APR e APY',
    level: 'Iniciante',
    emoji: '🔢',
    summary: 'APR é a taxa anual simples, enquanto APY inclui os efeitos dos juros compostos. Entenda a diferença.',
    tags: ['rendimento', 'básico', 'cálculo'],
    content: `**APR (Annual Percentage Rate)** vs **APY (Annual Percentage Yield)**

| | APR | APY |
|---|---|---|
| Tipo | Taxa simples | Taxa composta |
| Compound | Não inclui | Inclui |
| Resultado | Menor | Maior |

**Fórmulas:**
- APR para APY: \`APY = (1 + APR/n)^n - 1\`
  onde n = número de períodos de compound por ano
- APY para APR: \`APR = n * ((1 + APY)^(1/n) - 1)\`

**Exemplo:**
- APR de 20% com compound diário (n=365)
- APY ≈ 22,13%

**No DeFi:**
- Muitos protocolos anunciam APY (com compound automático)
- Alguns anunciam APR (você precisa reinvestir manualmente)
- Sempre verifique qual métrica está sendo usada`,
  },
  {
    id: 'liquidity-pool',
    title: 'O que é uma Pool de Liquidez?',
    level: 'Iniciante',
    emoji: '🌊',
    summary: 'Pools de liquidez são pares de tokens bloqueados em contratos inteligentes que permitem trocas descentralizadas.',
    tags: ['DeFi', 'AMM', 'liquidez'],
    content: `**Pool de Liquidez** é um contrato inteligente que armazena dois (ou mais) tokens para facilitar trocas (swaps) descentralizadas.

**Como funciona?**
1. Provedores de liquidez (LPs) depositam pares de tokens, ex: ETH + USDC
2. O contrato mantém uma proporção entre os tokens usando uma fórmula matemática (ex: x * y = k)
3. Qualquer usuário pode fazer swap de um token pelo outro pagando uma taxa
4. Essa taxa é distribuída proporcionalmente aos LPs

**Exemplo prático:**
- Você deposita $1.000 em ETH e $1.000 em USDC numa pool
- Cada vez que alguém faz swap nessa pool, você recebe uma fração da taxa (geralmente 0,1% a 0,3%)
- Ao final, você retira seus tokens (agora com as taxas acumuladas)

**Riscos:**
- **Impermanent Loss:** Se o preço dos tokens mudar muito, você pode retirar menos do que se tivesse apenas segurado os tokens
- **Smart contract risk:** Bugs no contrato podem causar perda dos fundos

**Protocolos populares:** Uniswap, Curve, Balancer, Raydium, Orca`,
  },
  {
    id: 'lending-defi',
    title: 'O que é Lending (Empréstimo) em DeFi?',
    level: 'Intermediário',
    emoji: '🏛️',
    summary: 'No DeFi, você pode emprestar e tomar emprestado tokens sem intermediários, usando contratos inteligentes.',
    tags: ['lending', 'DeFi', 'colateral'],
    content: `**Lending DeFi** permite que usuários emprestem seus tokens para outros usuários, recebendo juros, sem a necessidade de um banco.

**Como funciona o lado do credor (lend)?**
1. Você deposita tokens (ex: USDC) num protocolo como Aave
2. Outros usuários tomam emprestado esses tokens
3. Você recebe juros contínuos — quanto mais for tomado, mais você ganha

**Como funciona o lado do devedor (borrow)?**
1. Você deposita um colateral (ex: ETH)
2. Você toma emprestado outro token (ex: USDC), até um limite chamado LTV (Loan-to-Value)
3. Você paga juros sobre o valor emprestado
4. Se o preço do colateral cair demais, sua posição pode ser liquidada

**Conceitos importantes:**
- **LTV:** Proporção máxima entre o empréstimo e o colateral. Ex: LTV 75% = para $1.000 de ETH, você pode pegar $750 de USDC
- **Health Factor:** Indicador de saúde da posição. Abaixo de 1.0, ocorre liquidação
- **Liquidação:** O protocolo vende parte do seu colateral para pagar a dívida

**Protocolos populares:** Aave, Compound, MorphoBlue, Kamino`,
  },
  {
    id: 'liquid-staking',
    title: 'O que é Staking Líquido (LST)?',
    level: 'Intermediário',
    emoji: '💧',
    summary: 'O staking líquido permite que você faça stake de tokens e receba um token derivado que representa sua posição e acumula rendimentos.',
    tags: ['staking', 'LST', 'Ethereum', 'Solana'],
    content: `**Liquid Staking Token (LST)** é um token que representa sua posição de stake em uma rede blockchain, mas que você pode usar em outros protocolos DeFi.

**Problema resolvido:**
No staking tradicional (ex: validador Ethereum), seus tokens ficam bloqueados por semanas. O staking líquido resolve isso.

**Como funciona:**
1. Você deposita ETH (ou SOL) no protocolo
2. Você recebe um LST — ex: stETH (Lido), mSOL (Marinade), jitoSOL (Jito)
3. O LST representa seu ETH + recompensas acumuladas
4. Você pode usar o LST em outras pools DeFi enquanto ainda ganha as recompensas de staking

**Vantagens:**
- Liquidez imediata (pode vender o LST a qualquer momento)
- Composição de rendimentos (stake + DeFi)
- Sem mínimo de validador (32 ETH para validador próprio vs. qualquer valor em staking líquido)

**Riscos:**
- Smart contract risk do protocolo de staking
- Risco de depegging: o LST pode ser negociado abaixo do preço do token original
- Slashing: em caso de má conduta do validador, pode haver penalidades

**Exemplos de LSTs:**
- Ethereum: stETH (Lido), rETH (Rocket Pool), cbETH (Coinbase)
- Solana: mSOL (Marinade), jitoSOL (Jito), bSOL (Blaze)`,
  },
  {
    id: 'smart-contract-risk',
    title: 'Risco de Smart Contract',
    level: 'Intermediário',
    emoji: '🔐',
    summary: 'Contratos inteligentes são imutáveis e vulneráveis a bugs. Entenda como avaliar esse risco.',
    tags: ['risco', 'segurança', 'smart contract'],
    content: `**Risco de Smart Contract** é a possibilidade de perder fundos devido a bugs, vulnerabilidades ou exploits em contratos inteligentes.

**Por que existe esse risco?**
- Contratos são código — e código pode ter bugs
- Uma vez implantado na blockchain, é muito difícil (às vezes impossível) corrigi-lo
- Grandes quantidades de dinheiro atraem hackers

**Histórico de exploits famosos:**
- Ronin Bridge: $625M (2022)
- Wormhole: $320M (2022)
- Euler Finance: $197M (2023)
- Curve Finance: $62M (2023)

**Como avaliar o risco?**
1. **Auditorias:** O protocolo foi auditado por empresas reconhecidas? (Trail of Bits, OpenZeppelin, Certik)
2. **Tempo de vida:** Quanto mais tempo o protocolo existe sem exploits, mais testado ele está
3. **TVL:** Protocolos maiores geralmente têm mais atenção e revisões
4. **Código aberto:** O código está disponível para análise pública?
5. **Bug bounty:** Existe programa de recompensa por vulnerabilidades encontradas?

**Estratégias de mitigação:**
- Diversifique entre protocolos
- Use apenas protocolos auditados e consolidados
- Não invista mais do que pode perder
- Fique atento a alertas da comunidade`,
  },
  {
    id: 'impermanent-loss',
    title: 'Risco de Impermanent Loss',
    level: 'Intermediário',
    emoji: '📉',
    summary: 'Impermanent Loss ocorre quando o preço dos tokens numa pool de liquidez muda, resultando em menos valor do que se você tivesse apenas segurado os tokens.',
    tags: ['risco', 'liquidez', 'AMM', 'IL'],
    content: `**Impermanent Loss (IL)** é a diferença de valor entre manter tokens em uma pool de liquidez versus simplesmente segurá-los em sua carteira.

**Por que ocorre?**
Quando você fornece liquidez em um AMM (ex: Uniswap), o contrato rebalancia automaticamente as proporções dos tokens conforme os preços mudam. Esse rebalanceamento resulta em menos quantidade do token que valorizou.

**Exemplo:**
Você deposita $1.000 em ETH e $1.000 em USDC (total $2.000).
O ETH dobra de preço (+100%).

- **Se você tivesse segurado:** $2.000 em ETH + $1.000 em USDC = $3.000
- **Se você estava na pool:** Você teria ≈ $2.828 (devido ao rebalanceamento)
- **IL:** -$172 (~5,7% de impermanent loss)

**Fórmula:**
\`IL = 2√k/(1+k) - 1\`
onde k = nova_razão_de_preço / razão_original

**Tabela de referência:**
| Variação de preço | IL aproximado |
|---|---|
| 1.25x | -0,6% |
| 1.5x | -2,0% |
| 2x | -5,7% |
| 4x | -20% |
| 10x | -42% |

**Quando o IL não é problemático:**
- As taxas ganhas compensam o IL
- Os dois tokens se movem de forma correlacionada
- Você usa pools de stablecoins (menor volatilidade)

**Use nossa calculadora:** Acesse /liquidity-calc para simular o IL da sua posição.`,
  },
  {
    id: 'stablecoin-depeg',
    title: 'Risco de Stablecoin Perder Paridade',
    level: 'Intermediário',
    emoji: '⚠️',
    summary: 'Stablecoins podem perder a paridade com o dólar. Entenda os tipos e riscos de cada uma.',
    tags: ['stablecoin', 'risco', 'USDC', 'USDT'],
    content: `**Risco de Depeg** é a possibilidade de uma stablecoin perder sua paridade com o dólar (ou outro ativo de referência).

**Tipos de stablecoins e seus riscos:**

**1. Lastreadas por fiat (USDC, USDT)**
- Respaldadas 1:1 por dólares em banco
- Risco: insolvência do emissor, freeze de fundos, risco regulatório
- Histórico: USDC depegged brevemente em março 2023 (SVB crisis) — chegou a $0,87

**2. Sobrecolateralizadas (DAI, sUSD)**
- Respaldadas por colateral crypto superior ao valor emitido
- Risco: cascata de liquidações, colateral pode desvalorizar muito rápido
- Historicamente mais resilientes, mas depende da qualidade do colateral

**3. Algorítmicas (UST — extinto)**
- Mantinham a paridade através de algoritmos e incentivos
- Risco muito alto: UST colapsou para $0 em maio de 2022, destruindo ~$40B
- A maioria foi abandonada após o colapso da Terra/Luna

**Como se proteger:**
- Prefira stablecoins com alta liquidez e longa história
- Diversifique entre diferentes stablecoins
- Fique atento ao spread USDC/USDT nos exchanges
- Evite stablecoins algorítmicas sem colateral sólido`,
  },
  {
    id: 'evaluate-protocol',
    title: 'Como Avaliar um Protocolo DeFi',
    level: 'Avançado',
    emoji: '🔍',
    summary: 'Um checklist completo para avaliar a segurança e sustentabilidade de um protocolo DeFi antes de investir.',
    tags: ['avançado', 'análise', 'segurança', 'DYOR'],
    content: `**Framework de avaliação de protocolos DeFi**

**1. Código e Segurança**
☐ Código-fonte aberto e verificado?
☐ Auditado por empresas reconhecidas? (Verificar: Trail of Bits, Certik, OpenZeppelin, Halborn)
☐ Quantas auditorias? Quando foi a última?
☐ Existe bug bounty ativo?
☐ Histórico de exploits? Como o protocolo respondeu?

**2. Equipe e Transparência**
☐ A equipe é pública ou anônima?
☐ Existe documentação técnica (whitepaper, docs)?
☐ O protocolo tem governance ativa?
☐ Como são tomadas as decisões de atualização?

**3. Métricas Financeiras**
☐ TVL crescendo ou estável?
☐ Qual a proporção TVL / Market Cap do token? (TVL > MCap = menos inflado)
☐ As receitas cobrem os custos de emissão de tokens?
☐ O APY é sustentado por taxas reais ou por emissão de tokens?

**4. Tokenomics**
☐ Qual a distribuição do token? (Founders, VCs, comunidade)
☐ Existe vesting dos founders?
☐ Qual a inflação anual do token?
☐ O token tem utilidade real ou é apenas especulativo?

**5. Comunidade e Ecossistema**
☐ Comunidade ativa no Discord/Telegram?
☐ O protocolo está integrado com outros grandes protocolos?
☐ Existe suporte multi-chain?

**Red flags:**
🚩 APY impossível (>1000%) sem explicação clara
🚩 Equipe anônima sem reputação comprovada
🚩 Sem auditoria ou auditoria de empresa desconhecida
🚩 Tokens com alta emissão para fundadores
🚩 Pressão para "entrar rápido"`,
  },
  {
    id: 'security-filters',
    title: 'Como Usar os Filtros de Segurança',
    level: 'Avançado',
    emoji: '🛡️',
    summary: 'Aprenda a usar os filtros do Crescer para encontrar oportunidades com menor risco estimado.',
    tags: ['avançado', 'Crescer', 'filtros', 'segurança'],
    content: `**Guia dos Filtros de Segurança do Crescer**

O Crescer calcula um **Score de Risco** (0-100) para cada pool baseado em múltiplos fatores.

**Como o score é calculado:**

| Fator | Pontos |
|---|---|
| TVL > $100M | +25 |
| TVL > $10M | +15 |
| TVL > $1M | +8 |
| Stablecoin | +10 |
| APY 1%-20% | +20 |
| APY 20%-60% | +10 |
| APY > 100% | -30 |
| Sem IL risk | +15 |
| Com IL risk | -15 |
| Exposure single | +10 |
| Protocolo confiável | +10 |

**Classificação:**
- 🟢 80-100: Baixo risco
- 🟡 60-79: Moderado
- 🟠 40-59: Alto
- 🔴 0-39: Crítico

**Filtros disponíveis:**

1. **"Menor risco estimado":** Mostra apenas pools com score ≥ 60
2. **"Stablecoins only":** Filtra apenas pools com stablecoin
3. **Min TVL:** Define um TVL mínimo para reduzir exposição a pools pequenas
4. **APY máximo:** Filtra pools com APY muito alto (suspeito)

**⚠️ Importante:** O score é uma estimativa baseada em dados públicos. Não substitui análise aprofundada. Sempre faça sua própria pesquisa (DYOR) antes de investir.`,
  },
]

const LEVEL_COLORS: Record<Level, string> = {
  Iniciante: 'success',
  Intermediário: 'warning',
  Avançado: 'danger',
}

const EducationalCard = ({ mod }: { mod: Module }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-xl border border-[#2a3040] bg-[#111318] overflow-hidden transition-all duration-200 hover:border-[#3d4560]">
      <button
        className="w-full text-left p-4 flex items-start gap-3"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-2xl flex-shrink-0">{mod.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-[#e8eaf0] text-sm">{mod.title}</h3>
            <Badge variant={LEVEL_COLORS[mod.level] as 'success'} size="sm">{mod.level}</Badge>
          </div>
          <p className="text-xs text-[#8b93a8]">{mod.summary}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {mod.tags.map((tag) => (
              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[#1f2330] text-[#5a6278] border border-[#2a3040]">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <div className="text-[#5a6278] flex-shrink-0">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-5 border-t border-[#1e2433] pt-4">
          <div className="prose prose-invert prose-sm max-w-none text-[#8b93a8]
            [&_strong]:text-[#e8eaf0] [&_h1]:text-[#e8eaf0] [&_h2]:text-[#e8eaf0] [&_h3]:text-[#e8eaf0]
            [&_table]:w-full [&_th]:text-left [&_th]:text-xs [&_th]:text-[#5a6278] [&_th]:pb-1
            [&_td]:text-xs [&_td]:py-1 [&_tr]:border-b [&_tr]:border-[#1e2433]
            [&_code]:bg-[#1f2330] [&_code]:text-teal-400 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
            [&_li]:mb-1 [&_ol]:pl-4 [&_ul]:pl-4
          ">
            {mod.content.split('\n').map((line, i) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={i} className="font-semibold text-[#e8eaf0] mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>
              }
              if (line.startsWith('- ')) {
                return <li key={i} className="list-disc ml-4 text-xs">{line.slice(2)}</li>
              }
              if (line.startsWith('☐ ') || line.startsWith('🚩 ') || line.startsWith('🟢 ') || line.startsWith('🟡 ') || line.startsWith('🟠 ') || line.startsWith('🔴 ')) {
                return <p key={i} className="text-xs">{line}</p>
              }
              if (line.trim() === '') return <div key={i} className="h-2" />
              if (line.startsWith('|')) {
                return <p key={i} className="text-xs font-mono text-[#8b93a8]">{line}</p>
              }
              return <p key={i} className="text-xs">{line}</p>
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export const LearnPage = () => {
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState<Level | 'all'>('all')

  const filtered = useMemo(() => {
    let res = MODULES
    if (search.trim()) {
      const q = search.toLowerCase()
      res = res.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.summary.toLowerCase().includes(q) ||
          m.tags.some((t) => t.includes(q))
      )
    }
    if (levelFilter !== 'all') {
      res = res.filter((m) => m.level === levelFilter)
    }
    return res
  }, [search, levelFilter])

  const counts = useMemo(() => ({
    all: MODULES.length,
    Iniciante: MODULES.filter((m) => m.level === 'Iniciante').length,
    Intermediário: MODULES.filter((m) => m.level === 'Intermediário').length,
    Avançado: MODULES.filter((m) => m.level === 'Avançado').length,
  }), [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#e8eaf0] flex items-center gap-2">
          <BookOpen size={20} className="text-teal-400" />
          Aprender DeFi
        </h1>
        <p className="text-sm text-[#5a6278] mt-0.5">
          Guias educacionais em português sobre finanças descentralizadas
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            leftIcon={<Search size={15} />}
            placeholder="Buscar por título, conceito ou tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex rounded-lg border border-[#2a3040] overflow-hidden">
          {(['all', 'Iniciante', 'Intermediário', 'Avançado'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setLevelFilter(level)}
              className={cn(
                'px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap',
                levelFilter === level
                  ? 'bg-teal-600 text-white'
                  : 'text-[#5a6278] hover:text-[#8b93a8]'
              )}
            >
              {level === 'all' ? `Todos (${counts.all})` : `${level} (${counts[level]})`}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {(['Iniciante', 'Intermediário', 'Avançado'] as Level[]).map((level) => (
          <div key={level} className="rounded-xl border border-[#2a3040] bg-[#111318] p-3 text-center">
            <div className="text-2xl font-bold gradient-text">{counts[level]}</div>
            <div className="text-xs text-[#5a6278] mt-0.5">{level}</div>
          </div>
        ))}
      </div>

      {/* Modules */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-[#5a6278]">
          <BookOpen size={32} className="mx-auto mb-3 opacity-40" />
          <p>Nenhum módulo encontrado para "{search}"</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((mod) => (
            <EducationalCard key={mod.id} mod={mod} />
          ))}
        </div>
      )}
    </div>
  )
}
