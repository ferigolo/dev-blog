"use client";

import { useUser } from '@/context/user-context';
import Link from 'next/link';
import * as React from 'react';

export default function AdminLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAdmin } = useUser();
  if (!isAdmin) throw new Error('Usuário precisa ser admin')

  return <><nav className="flex justify-between p-4 border-b border-t w-full fixed bg-white">
    <Link href="/" className="font-bold text-xl">Página Admin</Link>
  </nav><div className='pt-16'>{children}</div></>
}