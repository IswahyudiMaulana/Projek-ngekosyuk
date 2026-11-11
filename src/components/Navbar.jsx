import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { logoutUser } from '../services/authService'
import toast from 'react-hot-toast'
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'

export default function Navbar() {
  const { profile, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    try {
      await logoutUser()
      toast.success('Berhasil logout')
      navigate('/')
    } catch (err) {
      toast.error('Gagal logout')
    }
  }

  const getDashboardLink = () => {
    if (profile?.role === 'owner') return '/owner/dashboard'
    return '/customer/dashboard'
  }

  const navLinks = [
    { label: 'Beranda', href: '/', icon: HomeIcon },
    { label: 'Cari Kos', href: '/search', icon: MagnifyingGlassIcon },
    { label: 'Tentang Kami', href: '/about', icon: InformationCircleIcon },
  ]

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-soft border-b border-border' : 'bg-white/95 backdrop-blur-sm border-b border-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-soft">
            <span className="text-white font-bold text-sm">NK</span>
          </div>
          <span className="font-bold text-primary text-lg hidden sm:block">NgekosYuk</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.href ? 'text-primary' : 'text-secondary-text'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {!loading && (
            isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-background transition-colors"
                >
                  {profile?.profile_image ? (
                    <img src={profile.profile_image} alt={profile?.full_name}
                      className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">
                        {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-primary-text max-w-[100px] truncate">
                    {profile?.full_name?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDownIcon className={`w-4 h-4 text-secondary-text transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-hover border border-border overflow-hidden z-50">
                    <Link to={getDashboardLink()}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-primary-text hover:bg-background transition-colors">
                      <UserCircleIcon className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-border"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-secondary-text hover:text-primary transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Daftar
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-background transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link key={link.href} to={link.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors
                  ${location.pathname === link.href ? 'bg-primary/10 text-primary' : 'text-secondary-text hover:bg-background'}`}>
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-border">
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-secondary-text hover:bg-background transition-colors">
                  <UserCircleIcon className="w-5 h-5" />
                  Dashboard
                </Link>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="flex-1 btn-secondary text-center text-sm">Login</Link>
                <Link to="/register" className="flex-1 btn-primary text-center text-sm">Daftar</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
