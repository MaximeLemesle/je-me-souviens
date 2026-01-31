import { useState } from 'react'
import { signOutUser } from '../../services/authService'
import { LogoutButton } from './LogoutButton'

export function LogoutButtonContainer() {
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleLogout = async () => {
    if (isSigningOut) return
    setIsSigningOut(true)
    const { error } = await signOutUser()
    if (error) {
      window.alert(`Erreur lors de la déconnexion: ${error.message}`)
      setIsSigningOut(false)
    }
  }

  return <LogoutButton isLoading={isSigningOut} onLogout={handleLogout} />
}
