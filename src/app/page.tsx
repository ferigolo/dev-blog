import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe, User } from 'lucide-react'
import { Language } from '@/generated/prisma/enums'
import prisma from '@/lib/prisma'

export default async function Home({
  searchParams
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  const { lang } = await searchParams

  const currentLang = (lang === 'en' ? 'en' : 'pt') as Language

  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: {
      translations: {
        where: { lang: currentLang }
      },
      author: true
    }
  })

  return (
    <main className="container mx-auto py-10 px-4">
      {/* Cabeçalho com Título e Troca de Idioma */}
      <div className="flex justify-between items-center mb-12 border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Meu Blog Tech</h1>
          <p className="text-muted-foreground mt-2">
            Aprendizados sobre Python, Next.js e Carreira.
          </p>
        </div>

        <div className="flex gap-4 items-center">
          {/* Botão de Admin (se quiser facilitar seu acesso) */}
          <Link href="/admin">
            <Button variant="ghost" size="sm">Área Admin</Button>
          </Link>

          {/* Botão de Troca de Idioma */}
          <Link href={`?lang=${currentLang === 'pt' ? 'en' : 'pt'}`}>
            <Button variant="outline" size="sm" className="gap-2">
              <Globe className="w-4 h-4" />
              {currentLang === 'pt' ? 'Switch to English' : 'Mudar para Português'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid de Posts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          // Se não tiver tradução (erro de dados), usa fallback
          const content = post.translations[0] || { title: 'Sem tradução', body: '' }

          return (
            <Card key={post.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                {/* {post.attachment && (
                  <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
                    <Image
                      src={post.imageUrl}
                      alt={content.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )} */}
                <CardTitle className="line-clamp-2 leading-tight">
                  {content.title}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <User className="w-3 h-3" />
                  <span>{post.author.name || 'Admin'}</span>
                  <span>•</span>
                  <time>{new Date(post.createdAt).toLocaleDateString()}</time>
                </div>
              </CardHeader>

              <CardContent className="grow">
                <p className="text-muted-foreground line-clamp-3 text-sm">
                  {/* Remove tags HTML simples para o preview, se houver */}
                  {content.body.replace(/<[^>]*>?/gm, '')}
                </p>
              </CardContent>

              <CardFooter>
                <Link href={`/blog/${post.slug}?lang=${currentLang}`} className="w-full">
                  <Button className="w-full">
                    {currentLang === 'pt' ? 'Ler artigo' : 'Read article'}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )
        })}

        {posts.length === 0 && (
          <div className="col-span-full text-center py-20">
            <h3 className="text-xl font-semibold mb-2">Nada por aqui ainda...</h3>
            <p className="text-muted-foreground">
              Acesse o <Link href="/admin" className="underline">Admin</Link> para criar seu primeiro post.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}