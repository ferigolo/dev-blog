import { Eye } from 'lucide-react'

export function ViewCounter({
  views,
  showText = true
}: {
  views: bigint
  showText?: boolean
}) {
  return (
    <div
      className="flex items-center gap-1.5 text-muted-foreground text-sm"
      title={`${views} visualizações`}
    >
      <Eye className="w-4 h-4" />
      <span className="font-medium tabular-nums">
        {Intl.NumberFormat('pt-PT', { notation: "compact" }).format(views)}
      </span>
      {showText && <span className="hidden sm:inline"> visualizações</span>}
    </div>
  )
}