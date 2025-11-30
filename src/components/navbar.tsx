"use client";

import { LogoutButton } from '@/components/logout-button'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useUser } from '@/context/user-context'

export default function Navbar() {
  const { user, isAdmin } = useUser()

  return (
    <header className='fixed top-0 w-full bg-white z-10'>
      <nav className="flex justify-between p-4 border-b w-full">
        <Link href="/" className="font-bold text-xl">Meu Blog</Link>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">Olá, {user.name}</span>
              {isAdmin && <Link href="/admin"><Button variant="outline" size="sm">Admin</Button></Link>}
              <LogoutButton />
            </>
          ) : (
            <Link href="/login"><Button size="sm">Entrar</Button></Link>
          )}
        </div>
      </nav></header>
  )
}