import { Outlet, Link, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {
  HomeIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  UserIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'
import Loading from '../components/Loading'

const navItems = [
  { label: 'Dashboard', href: '/owner/dashboard', icon: HomeIcon },
  { label: 'Properti Saya', href: '/owner/properties', icon: BuildingOfficeIcon },
  { label: 'Pesan Masuk', href: '/owner/messages', icon: ChatBubbleLeftRightIcon },
  { label: 'Ulasan', href: '/owner/reviews', icon: StarIcon },
  { label: 'Profil', href: '/owner/profile', icon: UserIcon },
]

export default function OwnerLayout() {
  const { profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loading fullScreen />
  if (!profile) return <Navigate to="/login" replace />
  if (profile.role !== 'owner') return <Navigate to="/customer/dashboard" replace />

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="text-secondary-text hover:text-primary transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">NK</span>
            </div>
            <span className="font-bold text-primary">NgekosYuk</span>
          </div>
          <span className="text-secondary-text text-sm ml-auto">Dashboard Owner</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 hidden md:block">
            <div className="card p-5 mb-4">
              <div className="flex items-center gap-3">
                {profile.profile_image ? (
                  <img src={profile.profile_image} alt={profile.full_name}
                    className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-accent font-bold text-lg">
                      {profile.full_name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-primary-text truncate">{profile.full_name}</p>
                  <p className="text-xs text-accent font-medium">Pemilik Kos</p>
                </div>
              </div>
            </div>

            <nav className="card overflow-hidden">
              {navItems.map((item, i) => {
                const Icon = item.icon
                const isActive = location.pathname.startsWith(item.href)
                return (
                  <Link key={item.href} to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors
                      ${i < navItems.length - 1 ? 'border-b border-border' : ''}
                      ${isActive
                        ? 'bg-primary text-white font-semibold'
                        : 'text-secondary-text hover:bg-background hover:text-primary-text'}`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
