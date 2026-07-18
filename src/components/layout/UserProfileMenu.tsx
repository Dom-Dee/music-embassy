import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { STUDIO_EMAIL_COMPOSE_URL } from '../../data/contact'
import { useTheme } from '../../theme/ThemeProvider'
import type { ThemePreference } from '../../theme/theme'
import {
  IconFeedback,
  IconLogout,
  IconMonitor,
  IconMoon,
  IconSun,
  IconUser,
} from '../icons'

type UserProfileMenuProps = {
  className?: string
}

function initials(name: string, email: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase()
  }
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return email.slice(0, 2).toUpperCase()
}

const themeOptions: { value: ThemePreference; label: string; icon: typeof IconSun }[] = [
  { value: 'system', label: 'System', icon: IconMonitor },
  { value: 'light', label: 'Light', icon: IconSun },
  { value: 'dark', label: 'Dark', icon: IconMoon },
]

function ThemeModeSwitch() {
  const { preference, setPreference } = useTheme()

  return (
    <div className="profile-theme-switch" role="group" aria-label="Theme">
      {themeOptions.map((option) => {
        const Icon = option.icon
        const active = preference === option.value
        return (
          <button
            key={option.value}
            type="button"
            className={`profile-theme-switch__btn ${active ? 'is-active' : ''}`}
            aria-pressed={active}
            aria-label={option.label}
            title={option.label}
            onClick={() => setPreference(option.value)}
          >
            <Icon className="h-4 w-4" />
          </button>
        )
      })}
    </div>
  )
}

export function UserProfileMenu({ className = '' }: UserProfileMenuProps) {
  const { session, profile, user, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const signedIn = Boolean(session && profile)
  const displayName = profile?.full_name ?? user?.email?.split('@')[0] ?? 'Guest'
  const displayEmail = profile?.email ?? user?.email ?? ''
  const avatarLabel = signedIn
    ? initials(profile?.full_name ?? '', displayEmail)
    : null

  useEffect(() => {
    if (!open) return

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    function handleOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    const timer = window.setTimeout(() => {
      document.addEventListener('click', handleOutside)
    }, 0)

    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('click', handleOutside)
    }
  }, [open])

  async function handleSignOut() {
    setOpen(false)
    await signOut()
    navigate('/sign-in')
  }

  function handleToggle(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    setOpen((value) => !value)
  }

  return (
    <div ref={rootRef} className={`profile-menu-root ${className}`}>
      <button
        type="button"
        className="profile-avatar-btn"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={signedIn ? `Account menu for ${displayName}` : 'Account menu'}
        onClick={handleToggle}
      >
        <span className="profile-avatar-btn__glass" aria-hidden />
        <span className="profile-avatar-btn__glyph" aria-hidden>
          {avatarLabel ?? <IconUser className="h-[1.05rem] w-[1.05rem]" />}
        </span>
      </button>

      {open ? (
        <div className="profile-menu" role="menu" onClick={(e) => e.stopPropagation()}>
          <div className="profile-menu__header">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-fg">{displayName}</p>
              {displayEmail ? (
                <p className="truncate text-xs text-muted">{displayEmail}</p>
              ) : (
                <p className="text-xs text-muted">Browse as guest</p>
              )}
            </div>
          </div>

          <div className="profile-menu__section">
            <div className="profile-menu__row">
              <span className="profile-menu__label">Theme</span>
              <ThemeModeSwitch />
            </div>
          </div>

          <div className="profile-menu__divider" />

          <div className="profile-menu__links">
            <a
              href={STUDIO_EMAIL_COMPOSE_URL}
              className="profile-menu__link"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <span>Feedback</span>
              <IconFeedback className="profile-menu__link-icon" />
            </a>

            {signedIn ? (
              <button
                type="button"
                className="profile-menu__link profile-menu__link--danger"
                role="menuitem"
                onClick={() => void handleSignOut()}
              >
                <span>Log out</span>
                <IconLogout className="profile-menu__link-icon" />
              </button>
            ) : (
              <Link
                to="/sign-in"
                className="profile-menu__link"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <span>Sign in</span>
                <IconUser className="profile-menu__link-icon" />
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
