'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useFormStatus } from 'react-dom'
import { useRef } from 'react'
import { Send } from 'lucide-react'
import { createComment } from '@/app/actions/comment'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="gap-2">
      {pending ? 'Enviando...' : (
        <>
          Enviar Comentário <Send className="w-4 h-4" />
        </>
      )}
    </Button>
  )
}

export function CommentForm({ postId }: { postId: string }) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div className="bg-muted/30 border rounded-xl p-6">
      <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
        Deixe a sua opinião
      </h4>

      <form
        ref={formRef}
        action={async (formData) => {
          await createComment(formData)
          formRef.current?.reset() // Limpa o formulário após o envio
        }}
        className="space-y-4"
      >
        {/* Passamos o ID do post escondido para a Server Action saber onde salvar */}
        <input type="hidden" name="postId" value={postId} />

        <Textarea
          name="text"
          placeholder="O que achou deste post? Compartilhe a sua ideia..."
          className="min-h-[100px] bg-background resize-none focus-visible:ring-primary"
          required
        />

        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </div>
  )
}