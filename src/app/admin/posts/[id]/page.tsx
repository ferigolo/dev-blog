import { PostForm } from '@/components/post-form'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import prisma from '@/lib/prisma'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params // Next.js 15

  // Busca o post e a tradução PT para preencher o form
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      translations: { where: { lang: 'pt' } }
    }
  })

  if (!post) notFound()

  // Formata os dados para o formulário
  const initialData = {
    id: post.id,
    title: post.translations[0]?.title || '',
    body: post.translations[0]?.body || '',
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <Link href="/admin">
        <Button variant="ghost" className="mb-4 gap-2 pl-0">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
      </Link>

      <h1 className="text-2xl font-bold mb-6">Editar Post</h1>
      <PostForm initialData={initialData} />
    </div>
  )
}