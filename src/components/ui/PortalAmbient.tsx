type PortalAmbientProps = {
  /** Lighter orbs for auth screens */
  subtle?: boolean
}

export function PortalAmbient({ subtle = false }: PortalAmbientProps) {
  return (
    <div className="portal-ambient pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className={`liquid-orb liquid-orb-a ${subtle ? 'liquid-orb-subtle' : ''}`} />
      <div className={`liquid-orb liquid-orb-b ${subtle ? 'liquid-orb-subtle' : ''}`} />
      {!subtle ? <div className="liquid-orb liquid-orb-c" /> : null}
    </div>
  )
}
