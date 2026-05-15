import { Search, Sun, Moon, DollarSign, Menu } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/components/ui/cn'
import { Button } from '@/components/ui/Button'

interface TopbarProps {
  onMobileMenuToggle: () => void
  currency: 'USD' | 'BRL'
  onCurrencyToggle: () => void
  darkMode: boolean
  onDarkModeToggle: () => void
}

export const Topbar = ({
  onMobileMenuToggle,
  currency,
  onCurrencyToggle,
  darkMode,
  onDarkModeToggle,
}: TopbarProps) => {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/pools?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#0d0f14]/95 backdrop-blur-md border-b border-[#1e2433] flex items-center px-4 gap-3">
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuToggle}
        className="md:hidden p-2 rounded-lg text-[#5a6278] hover:text-[#e8eaf0] hover:bg-[#1f2330] transition-colors"
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <div className="relative flex items-center">
          <Search size={15} className="absolute left-3 text-[#5a6278] pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar pool, token, protocolo..."
            className={cn(
              'w-full bg-[#1f2330] border border-[#2a3040] text-[#e8eaf0] placeholder-[#5a6278] rounded-lg py-2 pl-9 pr-3 text-sm',
              'focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-colors'
            )}
          />
        </div>
      </form>

      <div className="ml-auto flex items-center gap-2">
        {/* Currency toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onCurrencyToggle}
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium"
          leftIcon={<DollarSign size={13} />}
        >
          {currency}
        </Button>

        {/* Dark mode */}
        <button
          onClick={onDarkModeToggle}
          className="p-2 rounded-lg text-[#5a6278] hover:text-[#e8eaf0] hover:bg-[#1f2330] transition-colors"
          aria-label="Alternar modo"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  )
}
