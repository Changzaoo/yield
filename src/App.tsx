import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppLayout } from '@/components/layout/AppLayout'
import { SkeletonTable } from '@/components/ui/Skeleton'

const PoolsPage            = lazy(() => import('@/pages/PoolsPage').then(m => ({ default: m.PoolsPage })))
const EarnPage             = lazy(() => import('@/pages/EarnPage').then(m => ({ default: m.EarnPage })))
const LearnPage            = lazy(() => import('@/pages/LearnPage').then(m => ({ default: m.LearnPage })))
const LendSimulatorPage    = lazy(() => import('@/pages/LendSimulatorPage').then(m => ({ default: m.LendSimulatorPage })))
const LiquidityCalcPage    = lazy(() => import('@/pages/LiquidityCalculatorPage').then(m => ({ default: m.LiquidityCalculatorPage })))
const StakePage            = lazy(() => import('@/pages/StakePage').then(m => ({ default: m.StakePage })))
const WhaleTrackerPage     = lazy(() => import('@/pages/WhaleTrackerPage').then(m => ({ default: m.WhaleTrackerPage })))
const BitcoinLabPage       = lazy(() => import('@/pages/BitcoinLabPage').then(m => ({ default: m.BitcoinLabPage })))
const ProPage              = lazy(() => import('@/pages/ProPage').then(m => ({ default: m.ProPage })))
const MemesPage            = lazy(() => import('@/pages/MemesPage').then(m => ({ default: m.MemesPage })))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

const PageLoader = () => (
  <div className="space-y-4 pt-4">
    <div className="h-8 w-48 shimmer rounded-lg" />
    <SkeletonTable rows={8} />
  </div>
)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppLayout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"                element={<Navigate to="/pools" replace />} />
              <Route path="/pools"           element={<PoolsPage />} />
              <Route path="/earn"            element={<EarnPage />} />
              <Route path="/learn"           element={<LearnPage />} />
              <Route path="/lend"            element={<LendSimulatorPage />} />
              <Route path="/liquidity-calc"  element={<LiquidityCalcPage />} />
              <Route path="/stake"           element={<StakePage />} />
              <Route path="/whale-tracker"   element={<WhaleTrackerPage />} />
              <Route path="/bitcoin-lab"     element={<BitcoinLabPage />} />
              <Route path="/memes"           element={<MemesPage />} />
              <Route path="/pro"             element={<ProPage />} />
              <Route path="*"               element={<Navigate to="/pools" replace />} />
            </Routes>
          </Suspense>
        </AppLayout>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
