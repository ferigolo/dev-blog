import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="text-xl text-muted-foreground">Página não encontrada</p>
      <p className="text-sm text-muted-foreground max-w-md">
        O post ou página que você está procurando não existe ou foi movido.
      </p>
      <Link href="/">
        <Button>Voltar para o Início</Button>
      </Link>
    </div>
  )
}