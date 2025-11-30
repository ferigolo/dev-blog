import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // O Supabase envia um código na URL (ex: ?code=xyz...)
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Se deu certo, manda o usuário logado para o site
      return NextResponse.redirect(`${origin}${searchParams.get('next') ?? '/'}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}