import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Globe, Download, FileText, Calendar, User as UserIcon, Paperclip } from 'lucide-react';
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Language } from '@/generated/prisma/enums'
import { CommentForm } from '@/components/comment-form'
import { checkCommentAuthority } from '@/app/actions/permissions/check-comment-authority'
import { CommentItem } from '@/components/comment-item';
import getAuthenticatedUser from '@/utils/get-authenticated-user';
import Image from 'next/image';
import { incrementPostView } from '@/app/actions/posts';
import { ViewCounter } from '@/components/view-counter';

export default async function PostPage({ params, searchParams }: {
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ lang?: string }>
}) {
  const user = await getAuthenticatedUser()
  const { slug } = await params
  const { lang } = await searchParams
  const post = await prisma.post.findUniqueOrThrow({
    where: { slug },
    include: {
      author: true,
      attachments: true,
      translations: { where: { lang: lang as Language } },
      comments: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: true,
          _count: {
            select: { commentLikes: true }
          },
          commentLikes: { where: { userId: user?.id }, select: { id: true } },
        },
      }
    }
  })

  if (!post || post.translations.length === 0) {
    notFound()
  }
  const content = post.translations[0]
  const galleryImages = post.attachments.filter(att => att.type.startsWith('image/'))
  const documents = post.attachments.filter(att => !att.type.startsWith('image/'))

  incrementPostView(post.id)

  return (
    <article className="container max-w-4xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8 sticky top-0 bg-background/95 backdrop-blur py-4 border-b">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 pl-0 hover:bg-transparent hover:text-primary">
            <ArrowLeft className="w-4 h-4" /> Voltar para Home
          </Button>
        </Link>

        <Link href={`?lang=${lang === 'pt' ? 'en' : 'pt'}`} scroll={false}>
          <Button variant="outline" size="sm" className="gap-2">
            <Globe className="w-4 h-4" />
            {lang === 'pt' ? 'Read in English' : 'Ler em Português'}
          </Button>
        </Link>
      </div>

      <header className="mb-10 text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
          {content.title}
        </h1>

        <div className="flex items-center justify-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            <span>{post.author.name || 'Admin'}</span>
          </div>
          <span className="text-border">|</span>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <time>{new Date(post.createdAt).toLocaleDateString()}</time>
          </div>
          <span className="text-border">|</span>
          <ViewCounter views={post.views}></ViewCounter>
        </div>
      </header>

      <div className="prose dark:prose-invert prose-lg mx-auto mb-16 leading-relaxed">
        {/* Renderiza quebras de linha simples como parágrafos */}
        {content.body.split('\n').map((paragraph, i) => (
          paragraph ? <p key={i}>{paragraph}</p> : <br key={i} />
        ))}
      </div>

      {galleryImages.length > 0 && (
        <section className="mb-16 border-t pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {galleryImages.map(img => (
              <div key={img.id} className="relative aspect-4/3 rounded-lg overflow-hidden border bg-muted group cursor-zoom-in">
                <Image
                  src={img.url}
                  alt={img.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            ))}
          </div>
        </section>
      )}

      {documents.length > 0 && (
        <section className="bg-muted/30 border rounded-xl p-6 mb-16">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Paperclip className="w-5 h-5" /> Arquivos e Downloads
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {documents.map(doc => (
              <li key={doc.id}>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-background rounded-lg border hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  <div className="p-2 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="grow min-w-0">
                    <p className="font-medium truncate text-sm sm:text-base">{doc.name}</p>
                    <p className="text-xs text-muted-foreground uppercase">{doc.type.split('/')[1] || 'FILE'}</p>
                  </div>
                  <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      <hr className="border-border mb-16" />

      {/* --- SEÇÃO DE COMENTÁRIOS --- */}
      <section className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold mb-8">
          Comentários <span className="text-muted-foreground text-lg font-normal">({post.comments.length})</span>
        </h3>

        <div className="mb-12">
          <CommentForm postId={post.id} />
        </div>

        <div className="space-y-8">
          {post.comments.map(async (comment) => {
            return <CommentItem key={comment.id} isUserAuthenticated={user != null} comment={{
              ...comment, likesCount: comment._count.commentLikes, isLikedByUser: comment.commentLikes.length > 0
            }} hasPermission={user ? await checkCommentAuthority(user, comment.id) : false} ></CommentItem>
          }
          )}

          {!post.comments.length && (
            <div className="text-center py-10 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
              <p>Ainda não há comentários.</p>
              <p className="text-sm">Seja o primeiro a partilhar a sua opinião!</p>
            </div>
          )}
        </div>
      </section>

    </article>
  )
}
