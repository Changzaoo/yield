import { NavLink } from 'react-router-dom'
import {
  LayoutGrid,
  TrendingUp,
  BookOpen,
  Landmark,
  Droplets,
  Coins,
  Eye,
  Bitcoin,
  Zap,
  Flame,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/components/ui/cn'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navItems = [
  { to: '/pools',             icon: LayoutGrid,  label: 'Pools DeFi',    badge: null },
  { to: '/earn',              icon: TrendingUp,  label: 'Earn',          badge: null },
  { to: '/learn',             icon: BookOpen,    label: 'Aprender',      badge: null },
  { to: '/lend',              icon: Landmark,    label: 'Lend Sim.',     badge: null },
  { to: '/liquidity-calc',    icon: Droplets,    label: 'Liquid. Calc.', badge: null },
  { to: '/stake',             icon: Coins,       label: 'Stake SOL',     badge: null },
  { to: '/whale-tracker',     icon: Eye,         label: 'Whale Tracker', badge: null },
  { to: '/bitcoin-lab',       icon: Bitcoin,     label: 'Bitcoin Lab',   badge: 'PRO' },
  { to: '/memes',             icon: Flame,       label: 'Meme Radar',    badge: 'HOT' },
]

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  return (
    <aside
      className={cn(
        'hidden md:flex flex-col fixed left-0 top-0 h-screen bg-[#0d0f14] border-r border-[#1e2433] transition-all duration-300 z-30',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center h-16 border-b border-[#1e2433] px-4', collapsed ? 'justify-center' : 'gap-3')}>
        <img src="/favicon.svg" alt="Crescer" className="w-8 h-8 shrink-0 object-contain" />
        {!collapsed && (
          <span className="font-bold text-[#e8eaf0] text-base tracking-tight">Crescer</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 group',
                collapsed ? 'justify-center px-0' : '',
                isActive
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                  : 'text-[#5a6278] hover:bg-[#181b22] hover:text-[#8b93a8]'
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1">{label}</span>
                {badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* PRO Link */}
      <div className={cn('px-2 py-4 border-t border-[#1e2433]')}>
        <NavLink
          to="/pro"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
              collapsed ? 'justify-center px-0' : '',
              isActive
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'text-amber-500/70 hover:bg-amber-500/10 hover:text-amber-400'
            )
          }
          title={collapsed ? 'PRO' : undefined}
        >
          <Zap size={18} className="flex-shrink-0" />
          {!collapsed && <span>Plano PRO</span>}
        </NavLink>
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#1f2330] border border-[#2a3040] flex items-center justify-center text-[#5a6278] hover:text-[#e8eaf0] transition-colors shadow-lg"
        aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  )
}
