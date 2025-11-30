"use client";

import { createPost, updatePost } from '@/app/actions/posts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { FileUpload } from './file-uploader';
import { useState } from 'react';
import { Paperclip, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

const BUCKET_NAME = 'my-blog-bucket'

interface PostData {
  id?: string
  title: string
  body: string
  imageUrl?: string | null
  attachments: Attachment[] | null
}

export default interface Attachment {
  name: string
  type: string
  isUploading: boolean
  size: number
  url: string
  data: {
    id: string;
    path: string;
    fullPath: string;
  } | null
}


export function PostForm({ initialData }: { initialData?: PostData }) {
  const isEditing = !!initialData?.id

  const [attachments, setAttachments] = useState<Attachment[]>([])
  const supabase = createClient()

  const handleFilesSelected = async (newFiles: File[]) => {
    const newAttachments: Attachment[] = []

    await Promise.all(
      newFiles.map(async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, file)

        if (error) {
          console.error(`Erro ao enviar ${file.name}:`, error.message)
          alert(`Erro no upload de ${file.name}`)
          return
        }

        const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path)

        newAttachments.push({
          name: file.name,
          type: file.type,
          isUploading: true,
          size: file.size,
          data, url: urlData.publicUrl
        })
      })
    )
    setAttachments((prev) => [...prev, ...newAttachments])
  }

  const removeAttachment = (path: string) => {
    supabase.storage.from(BUCKET_NAME).remove([path])
    setAttachments((prev) => prev.filter(a => a.data?.path !== path))
  }

  const action = async (formData: FormData) => {
    formData.set('attachments', JSON.stringify(attachments))
    if (isEditing && initialData?.id) {
      await updatePost(initialData.id, formData)
    } else {
      await createPost(formData)
    }
  }

  return (
    <form action={action} className="space-y-8 bg-card p-6 rounded-lg border shadow-sm">

      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" defaultValue={initialData?.title} required className="text-lg font-mono" placeholder="Escreva o título do post aqui..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Conteúdo</Label>
        <Textarea
          id="body"
          name="body"
          defaultValue={initialData?.body}
          className="min-h-[300px] font-mono"
          placeholder="Escreva seu post aqui..."
          required
        />
      </div>

      <div className="space-y-2">
        <FileUpload onFilesSelected={handleFilesSelected} >
        </FileUpload>
        {attachments.length > 0 && (
          <div className="grid gap-2 mt-4">
            <p className="text-sm font-medium">Arquivos selecionados ({attachments.length}):</p>

            {attachments.map((attachment) => (
              <div key={attachment.name} className="flex items-center justify-between p-3 border rounded-md bg-muted/40">
                <div className="flex items-center gap-3 overflow-hidden">
                  <Paperclip className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm truncate max-w-[200px]">{attachment.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(attachment.size / 1024).toFixed(0)}kb
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={() => attachment.data && removeAttachment(attachment.data.path)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t">
        <Button type="submit" size="lg">
          {isEditing ? 'Salvar Alterações' : 'Publicar Post'}
        </Button>
      </div>
    </form>
  )
}