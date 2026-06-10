import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { Button } from '../ui/Button'
import { AuthActionTray } from './AuthActionTray'

type SignOutButtonProps = {
  className?: string
  compact?: boolean
  fullWidth?: boolean
}

export function SignOutButton({
  className = '',
  compact = false,
  fullWidth = false,
}: SignOutButtonProps) {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/sign-in')
  }

  return (
    <AuthActionTray tone="exit" compact={compact} className={fullWidth ? 'w-full' : ''}>
      <Button
        type="button"
        variant="secondary"
        className={`${fullWidth ? 'w-full' : ''} ${compact ? '!px-4 !py-2 text-sm' : 'w-full !py-3.5'} ${className}`}
        onClick={() => void handleSignOut()}
      >
        Sign out
      </Button>
    </AuthActionTray>
  )
}
