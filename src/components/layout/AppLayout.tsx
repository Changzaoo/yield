import { type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileNav } from './MobileNav'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { cn } from '@/components/ui/cn'

interface AppLayoutProps {
  children: ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('sidebar-collapsed', false)
  const [currency, setCurrency] = useLocalStorage<'USD' | 'BRL'>('currency', 'USD')
  const [darkMode, setDarkMode] = useLocalStorage('dark-mode', true)

  const toggleCurrency = () => setCurrency(currency === 'USD' ? 'BRL' : 'USD')
  const toggleDarkMode = () => setDarkMode(!darkMode)

  return (
    <div className={cn('min-h-screen bg-[#0a0c10]', darkMode ? '' : 'light')}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className={cn(
          'flex flex-col min-h-screen transition-all duration-300',
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-56'
        )}
      >
        <Topbar
          onMobileMenuToggle={() => {}}
          currency={currency}
          onCurrencyToggle={toggleCurrency}
          darkMode={darkMode}
          onDarkModeToggle={toggleDarkMode}
        />

        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  )
}

export const useCurrency = () => {
  const [currency] = useLocalStorage<'USD' | 'BRL'>('currency', 'USD')
  return currency
}
