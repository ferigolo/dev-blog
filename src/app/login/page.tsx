"use server";


import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import Link from 'next/link'
import { GoogleAuthButton } from '@/components/google-auth-button'


export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string, error?: string }> }) {
  // Next.js 15: searchParams é uma Promise
  const { message, error } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Entre para gerenciar seu blog.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleAuthButton />
          <form action={login} className="grid gap-4 mt-4">
            {/* Mensagens de Erro/Sucesso */}
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-green-100 text-green-800 text-sm p-3 rounded-md">
                {message}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="admin@blog.com" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            <Button className="w-full" type="submit">Entrar</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          Ainda não tem conta?
          <Link href="/signup" className="ml-1 text-primary hover:underline font-medium">
            Cadastre-se
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}