import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { OnboardingGate } from '../../features/profile/OnboardingGate'
import { CreatePostAction } from './CreatePostAction'
import { Footer } from './Footer'
import { Header } from './Header'
import { NavDrawer } from './NavDrawer'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const openMenu = useCallback(() => setMenuOpen(true), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <div className="flex min-h-svh flex-col">
      <ScrollToTop />
      <OnboardingGate />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-cinema-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      <Header onOpenMenu={openMenu} />
      <NavDrawer open={menuOpen} onClose={closeMenu} />

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <CreatePostAction />
    </div>
  )
}
