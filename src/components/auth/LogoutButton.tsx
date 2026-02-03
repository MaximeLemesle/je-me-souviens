import { LogOut, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'

interface LogoutButtonProps {
  isLoading: boolean
  onLogout: () => void
}

export function LogoutButton({ isLoading, onLogout }: LogoutButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onLogout}
      disabled={isLoading}
      className="rounded-full"
      aria-label="Se déconnecter"
    >
      <span className="sm:hidden">
        {isLoading ? <Loader2 className="animate-spin" /> : <LogOut />}
      </span>
      <span className="hidden sm:inline">
        {isLoading ? 'Déconnexion…' : 'Se déconnecter'}
      </span>
    </Button>
  )
}
