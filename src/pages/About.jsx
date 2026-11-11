import { Link } from 'react-router-dom'
import { SparklesIcon, ShieldCheckIcon, UserGroupIcon, MapPinIcon } from '@heroicons/react/24/outline'

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      {/* Brand Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <SparklesIcon className="w-4 h-4" />
          Tentang NgekosYuk
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-text">
          "Cari Kos Nyaman, Mulai Cerita Baru."
        </h1>
        <p className="text-secondary-text leading-relaxed">
          NgekosYuk merupakan platform digital yang mempertemukan calon penghuni kos (Customer) dengan pemilik kos (Owner), berfokus secara khusus di wilayah Bojongsoang, Kabupaten Bandung dan sekitar kampus Telkom University.
        </p>
      </div>

      {/* Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <ShieldCheckIcon className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-primary-text text-lg">Keakuratan Data</h3>
          <p className="text-sm text-secondary-text leading-relaxed">
            Menyajikan informasi ketersediaan kamar yang aktual, transparan, dan tidak membingungkan pencari kos.
          </p>
        </div>

        <div className="card p-6 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <UserGroupIcon className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-primary-text text-lg">Koneksi Langsung</h3>
          <p className="text-sm text-secondary-text leading-relaxed">
            Menghubungkan langsung pencari kos dengan pemilik tanpa perantara atau biaya pemesanan tersembunyi.
          </p>
        </div>

        <div className="card p-6 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <MapPinIcon className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-primary-text text-lg">Fokus Bojongsoang</h3>
          <p className="text-sm text-secondary-text leading-relaxed">
            Mencakup Sukabirus, Sukapura, Terusan Buah Batu, Ciganitri, Lengkong, Cipagalo, Cikoneng, hingga Griya Bandung Asri.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary/5 rounded-3xl p-8 text-center border border-primary/20 space-y-4">
        <h2 className="text-2xl font-bold text-primary-text">Siap Menemukan Kos Impianmu?</h2>
        <p className="text-secondary-text text-sm max-w-lg mx-auto">
          Jelajahi 50+ pilihan kos putra, putri, dan campur dengan fasilitas lengkap di sekitar Bojongsoang sekarang juga.
        </p>
        <div className="pt-2">
          <Link to="/search" className="btn-primary inline-flex">Cari Kos Sekarang</Link>
        </div>
      </div>
    </div>
  )
}
