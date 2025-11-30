import { PostForm } from '@/components/post-form'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewPostPage() {
  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <Link href="/admin">
        <Button variant="ghost" className="mb-4 gap-2 pl-0">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
      </Link>

      <h1 className="text-2xl font-bold mb-6">Novo Post</h1>
      <PostForm />
    </div>
  )
}