'use client';

import { useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Pencil,
  Trash2,
  X,
  Save,
  MoreVertical
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteComment, updateComment } from '@/app/actions/comment'
import { CommentLikeButton } from './like-button'

interface CommentItemProps {
  comment: {
    id: string
    text: string
    createdAt: Date
    author: {
      id: string
      name: string | null
      avatarUrl: string | null
    },
    likesCount: number,
    isLikedByUser: boolean
  }
  isUserAuthenticated: boolean,
  hasPermission: boolean
}

export function CommentItem({ comment, hasPermission = false, isUserAuthenticated = false }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleUpdate = async (formData: FormData) => {
    await updateComment(comment.id, formData)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    // Nota: Em produção, idealmente usaria um componente <AlertDialog>
    if (confirm('Tem a certeza que deseja apagar este comentário?')) {
      setIsDeleting(true)
      await deleteComment(comment.id)
    }
  }

  return (
    <div className={`flex gap-4 animate-in fade-in slide-in-from-bottom-2 group ${isDeleting ? 'opacity-50' : ''}`}>
      <Avatar className="w-10 h-10 border mt-1">
        <AvatarImage src={comment.author.avatarUrl || ''} />
        <AvatarFallback className="bg-primary/10 text-primary font-bold">
          {comment.author.name?.[0]?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>

      <div className="grow space-y-1">
        {/* Cabeçalho: Nome, Data e Menu de Ações */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{comment.author.name || 'Anónimo'}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div>
            <CommentLikeButton
              commentId={comment.id}
              initialLikes={comment.likesCount}
              initialIsLiked={comment.isLikedByUser}
              isUserAuthenticated={isUserAuthenticated}
            />

            {hasPermission && !isEditing && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Apagar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {isEditing ? (
          <form action={handleUpdate} ref={formRef} className="mt-2 space-y-2">
            <Textarea
              name="text"
              defaultValue={comment.text}
              className="min-h-20 text-sm bg-background"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="h-8"
              >
                <X className="w-3 h-3 mr-1" /> Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8"
              >
                <Save className="w-3 h-3 mr-1" /> Guardar
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-sm leading-relaxed text-muted-foreground/90 bg-muted/30 p-3 rounded-r-lg rounded-bl-lg whitespace-pre-wrap">
            {comment.text}
          </p>
        )}

        <div>

        </div>
      </div>
    </div>
  )
}