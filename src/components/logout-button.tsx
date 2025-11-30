import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react' // Ícone opcional

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button variant="ghost" size="sm" type="submit" className="gap-2 text-muted-foreground hover:text-foreground">
        <LogOut className="w-4 h-4" />
        Sair
      </Button>
    </form>
  )
}