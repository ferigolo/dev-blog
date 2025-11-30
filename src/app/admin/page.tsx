"use server";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import prisma from '@/lib/prisma'
import { PostForm } from '@/components/post-form'
import { Trash2, User } from 'lucide-react'
import { deletePost } from '../actions/posts'
import ActionButton from '@/components/ui/action-button'
import { Language } from '@/generated/prisma/enums'
import getAuthenticatedUser from '@/utils/get-authenticated-user';

export default async function AdminPage({
  searchParams
}: {
  searchParams: Promise<{ lang: string }>
}) {
  const user = await getAuthenticatedUser()
  let { lang } = await searchParams
  lang = lang ? lang : Language.pt

  const posts = await prisma.post.findMany({
    where: { authorId: user?.id },
    include: {
      author: true,
      translations: {
        where: { lang: lang as Language }, select: {
          title: true, body: true
        }
      }
    }
  })

  return (
    <div className="container max-w-6xl mx-auto py-10 flex gap-12 flex-col">
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Post</CardTitle>
        </CardHeader>
        <CardContent>
          <PostForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Posts criados</CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-3 gap-4'>
          {posts.map(post => <Card key={post.id} className='p-6'>
            <CardTitle className="line-clamp-2 leading-tight">
              {post.translations[0].title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-3 h-3" />
              <span>{post.author?.name || 'Admin'}</span>
              <span>•</span>
              <time>{new Date(post.createdAt).toLocaleDateString()}</time>
              <ActionButton action={deletePost} id={post.id}>{<Trash2></Trash2>}</ActionButton>
            </div></Card>)}
        </CardContent>
      </Card >
    </div >
  )
}