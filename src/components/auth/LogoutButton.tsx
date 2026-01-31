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
    >
      {isLoading ? 'Déconnexion…' : 'Se déconnecter'}
    </Button>
  )
}
