import { NavLink } from 'react-router-dom'
import { LayoutGrid, TrendingUp, BookOpen, Coins, Eye, Zap } from 'lucide-react'
import { cn } from '@/components/ui/cn'

const mobileNav = [
  { to: '/pools',        icon: LayoutGrid,  label: 'Pools' },
  { to: '/earn',         icon: TrendingUp,  label: 'Earn' },
  { to: '/learn',        icon: BookOpen,    label: 'Learn' },
  { to: '/stake',        icon: Coins,       label: 'Stake' },
  { to: '/whale-tracker',icon: Eye,         label: 'Whales' },
  { to: '/pro',          icon: Zap,         label: 'PRO' },
]

export const MobileNav = () => (
  <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0d0f14]/95 backdrop-blur-md border-t border-[#1e2433] flex items-stretch">
    {mobileNav.map(({ to, icon: Icon, label }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          cn(
            'flex-1 flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors',
            isActive ? 'text-teal-400' : 'text-[#5a6278]'
          )
        }
      >
        <Icon size={18} />
        {label}
      </NavLink>
    ))}
  </nav>
)
