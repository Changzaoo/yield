interface RatioBarProps {
  value: number
  total: number
}

export const RatioBar = ({ value, total }: RatioBarProps) => {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0
  const display = pct < 0.01 ? '<0.01' : pct.toFixed(2)

  return (
    <div className="space-y-0.5 min-w-[60px]">
      <div className="h-1 bg-[#1e2433] rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-500/60 rounded-full transition-all"
          style={{ width: `${Math.max(pct, 0.5)}%` }}
        />
      </div>
      <div className="text-[10px] text-[#5a6278]">{display}%</div>
    </div>
  )
}
