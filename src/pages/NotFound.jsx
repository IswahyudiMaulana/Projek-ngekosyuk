import { Link } from 'react-router-dom'
import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🏠</div>
        <h1 className="text-4xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-xl font-semibold text-primary-text mb-3">Halaman Tidak Ditemukan</h2>
        <p className="text-secondary-text mb-8">
          Ups! Halaman yang kamu cari tidak ada. Mungkin sudah dipindahkan atau alamatnya salah.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary flex items-center gap-2 justify-center">
            <HomeIcon className="w-5 h-5" />
            Kembali ke Beranda
          </Link>
          <Link to="/search" className="btn-secondary flex items-center gap-2 justify-center">
            <MagnifyingGlassIcon className="w-5 h-5" />
            Cari Kos
          </Link>
        </div>
      </div>
    </div>
  )
}
