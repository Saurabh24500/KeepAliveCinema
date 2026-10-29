import {
  BookHeart,
  Compass,
  Home,
  Users,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  comingSoon?: boolean
}

export const primaryNav: NavItem[] = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/journal', label: 'Journal', icon: BookHeart, comingSoon: true },
  { to: '/community', label: 'Community', icon: Users, comingSoon: true },
]
