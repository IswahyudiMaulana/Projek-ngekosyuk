import { Link } from 'react-router-dom'
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon 
} from '@heroicons/react/24/outline'

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">NK</span>
              </div>
              <span className="font-bold text-white text-lg">NgekosYuk</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Platform pencarian kos modern yang memudahkan kamu menemukan tempat tinggal nyaman di area Bojongsoang, Bandung.
            </p>
            <p className="text-white/50 text-xs mt-4 italic">
              "Cari Kos Nyaman, Mulai Cerita Baru."
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-white mb-4">Navigasi</h4>
            <ul className="space-y-2">
              {[
                { label: 'Beranda', href: '/' },
                { label: 'Cari Kos', href: '/search' },
                { label: 'Tentang Kami', href: '/about' },
                { label: 'Login', href: '/login' },
                { label: 'Daftar', href: '/register' },
              ].map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-white/70 text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Category */}
          <div>
            <h4 className="font-semibold text-white mb-4">Kategori Kos</h4>
            <ul className="space-y-2">
              {[
                { label: 'Kos Putra', href: '/search?gender=PUTRA' },
                { label: 'Kos Putri', href: '/search?gender=PUTRI' },
                { label: 'Kos Campur', href: '/search?gender=CAMPUR' },
              ].map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-white/70 text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Kontak</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPinIcon className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">
                  Bojongsoang, Kabupaten Bandung, Jawa Barat
                </span>
              </li>
              <li className="flex items-center gap-2">
                <EnvelopeIcon className="w-4 h-4 text-secondary flex-shrink-0" />
                <a href="mailto:hello@ngekosyuk.id" className="text-white/70 text-sm hover:text-white transition-colors">
                  hello@ngekosyuk.id
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/50 text-xs">
            © 2024 NgekosYuk. Semua hak dilindungi.
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-white/50 text-xs hover:text-white/80 transition-colors">Kebijakan Privasi</Link>
            <Link to="/terms" className="text-white/50 text-xs hover:text-white/80 transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
