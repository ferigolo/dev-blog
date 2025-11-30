'use client'

import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useOptimistic, startTransition } from 'react'
import { cn } from '@/lib/utils'
import { toggleCommentLike } from '@/app/actions/comment-likes'

interface CommentLikeButtonProps {
  commentId: string
  initialLikes: number
  initialIsLiked: boolean
  isUserAuthenticated: boolean
}

export function CommentLikeButton({
  commentId,
  initialLikes,
  initialIsLiked,
  isUserAuthenticated=false
}: CommentLikeButtonProps) {
  // Estado Otimista: Atualiza a UI instantaneamente enquanto o servidor processa
  const [optimisticState, addOptimistic] = useOptimistic(
    { likes: initialLikes, isLiked: initialIsLiked },
    (state, newIsLiked: boolean) => ({
      likes: state.likes + (newIsLiked ? 1 : -1),
      isLiked: newIsLiked
    })
  )

  const handleToggle = async () => {
    startTransition(() => {
      addOptimistic(!optimisticState.isLiked)
    })

    const formData = new FormData()
    formData.append('commentId', commentId)
    await toggleCommentLike(formData)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "gap-1.5 h-8 px-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors",
        optimisticState.isLiked && "text-red-500"
      )}
      onClick={handleToggle}
      title={optimisticState.isLiked ? "Descurtir" : "Curtir"}
      disabled={!isUserAuthenticated}
    >
      <Heart className={cn("w-4 h-4", optimisticState.isLiked && "fill-current")} />
      <span className="text-xs tabular-nums font-medium">{optimisticState.likes}</span>
    </Button>
  )
}