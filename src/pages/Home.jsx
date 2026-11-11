import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import PropertyCard from '../components/PropertyCard'
import { getFeaturedProperties, getAvailableProperties } from '../services/propertyService'
import {
  SparklesIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

export default function Home() {
  const navigate = useNavigate()
  const [featured, setFeatured] = useState([])
  const [available, setAvailable] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getFeaturedProperties(6),
      getAvailableProperties(6),
    ]).then(([f, a]) => {
      setFeatured(f)
      setAvailable(a)
    }).finally(() => setLoading(false))
  }, [])

  const categories = [
    {
      title: 'Kos Putra',
      gender: 'PUTRA',
      desc: 'Khusus penghuni laki-laki. Suasana kondusif untuk belajar dan beristirahat.',
      icon: '👨',
      badge: 'badge-putra',
      bg: 'bg-blue-50/50 hover:bg-blue-50 border-blue-100',
    },
    {
      title: 'Kos Putri',
      gender: 'PUTRI',
      desc: 'Khusus penghuni perempuan. Lingkungan aman, bersih, dan terjaga 24 jam.',
      icon: '👩',
      badge: 'badge-putri',
      bg: 'bg-pink-50/50 hover:bg-pink-50 border-pink-100',
    },
    {
      title: 'Kos Campur',
      gender: 'CAMPUR',
      desc: 'Dapat dihuni putra atau putri sesuai aturan pemilik kos yang fleksibel.',
      icon: '👥',
      badge: 'badge-campur',
      bg: 'bg-purple-50/50 hover:bg-purple-50 border-purple-100',
    },
  ]

  const features = [
    {
      title: 'Data Terverifikasi & Akurat',
      desc: 'Listing kos di Bojongsoang melalui validasi ketersediaan kamar secara berkala.',
      icon: ShieldCheckIcon,
    },
    {
      title: 'Prioritas Kamar Kosong',
      desc: 'Pencarian mengutamakan kos yang memiliki kamar tersedia dan harga terjangkau.',
      icon: CheckCircleIcon,
    },
    {
      title: 'Komunikasi Langsung',
      desc: 'Hubungi langsung pemilik kos via WhatsApp resmi atau fitur live chat di platform.',
      icon: ChatBubbleLeftRightIcon,
    },
    {
      title: 'Ulasan Penghuni Asli',
      desc: 'Sistem rating transparan berdasarkan kebersihan, kenyamanan, dan keamanan.',
      icon: SparklesIcon,
    },
  ]

  const testimonials = [
    {
      name: 'Rian Pratama',
      role: 'Mahasiswa Telkom University',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80',
      comment: 'Cari kos di Bojongsoang jadi gampang banget! Bisa langsung filter yang ada AC dan kamar mandi dalam. Kontak WA owner juga langsung tersambung.',
      rating: 5,
    },
    {
      name: 'Sarah Nabila',
      role: 'Mahasiswi Dayeuhkolot',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80',
      comment: 'Senang banget ada label ketersediaan kamar yang jelas. Nggak perlu buang waktu tanya ke kos yang ternyata udah penuh.',
      rating: 5,
    },
    {
      name: 'Dimas Anggara',
      role: 'Alumni Telkom / Software Engineer',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&q=80',
      comment: 'Tampilan websitenya sangat rapi dan estetik, warnanya adem dan nggak bikin pusing. Sangat recommended buat anak rantau Bandung!',
      rating: 5,
    },
  ]

  return (
    <div className="space-y-16 md:space-y-24 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-background to-background pt-8 pb-16 md:py-20 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                <SparklesIcon className="w-4 h-4" />
                #1 Platform Kos Kawasan Bojongsoang & Telkom University
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary-text leading-tight tracking-tight">
                Temukan Kos Nyaman yang <span className="text-primary underline decoration-secondary underline-offset-4">Cocok Buat Kamu.</span>
              </h1>
              <p className="text-secondary-text text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Temukan tempat tinggal yang sesuai dengan kebutuhan, budget, dan gaya hidupmu. Cari kos jadi lebih mudah bersama NgekosYuk.
              </p>

              {/* Search Bar Card */}
              <div className="pt-2">
                <SearchBar />
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-2xl font-bold text-primary">50+</p>
                  <p className="text-xs text-secondary-text">Kos Terdaftar</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">10+</p>
                  <p className="text-xs text-secondary-text">Kawasan Bojongsoang</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">100%</p>
                  <p className="text-xs text-secondary-text">Bebas Biaya Booking</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-hover border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=900&q=80"
                    alt="Kos Modern Bojongsoang"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating badge 1 */}
                <div className="absolute -bottom-6 -left-4 bg-white rounded-2xl p-4 shadow-soft border border-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs text-secondary-text">Status Kamar</p>
                    <p className="text-sm font-bold text-primary-text">Terupdate & Real-Time</p>
                  </div>
                </div>
                {/* Floating badge 2 */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-soft border border-border flex items-center gap-2">
                  <span className="text-xl">📍</span>
                  <span className="text-xs font-semibold text-primary">Dekat Telkom Univ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pilihan Kategori Kos */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="section-title">Pilihan Kategori Kos</h2>
          <p className="section-subtitle">
            Cari kos sesuai kenyamanan preferensi gender kamu dengan filter otomatis satu klik
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map(cat => (
            <div
              key={cat.gender}
              onClick={() => navigate(`/search?gender=${cat.gender}`)}
              className={`card p-6 border-2 transition-all duration-300 cursor-pointer hover:shadow-hover hover:-translate-y-1 ${cat.bg}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{cat.icon}</span>
                <span className={cat.badge}>{cat.title}</span>
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-2">{cat.title}</h3>
              <p className="text-sm text-secondary-text mb-6 leading-relaxed">{cat.desc}</p>
              <div className="flex items-center gap-2 text-sm font-semibold text-primary group">
                <span>Lihat Kos {cat.title}</span>
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rekomendasi Kos Populer */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="section-title">Rekomendasi Kos Pilihan</h2>
            <p className="section-subtitle">Kos dengan rating tertinggi dan fasilitas terlengkap di Bojongsoang</p>
          </div>
          <Link to="/search?sort=rating" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            Lihat Semua Kos Populer →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map(prop => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>

      {/* Kos dengan Kamar Tersedia */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200 mb-2">
              <CheckCircleIcon className="w-3.5 h-3.5" />
              Siap Huni
            </div>
            <h2 className="section-title">Kos dengan Kamar Tersedia</h2>
            <p className="section-subtitle">Kamar kosong yang sudah terkonfirmasi pemilik kos, siap disewa</p>
          </div>
          <Link to="/search" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            Jelajahi Semua Kamar Kosong →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {available.map(prop => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>

      {/* Keunggulan NgekosYuk */}
      <section className="bg-white py-16 border-y border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="section-title">Kenapa Pilih NgekosYuk?</h2>
            <p className="section-subtitle">
              Solusi cerdas bagi mahasiswa dan masyarakat dalam menemukan hunian terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(f => {
              const Icon = f.icon
              return (
                <div key={f.title} className="text-center space-y-3 p-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-primary-text text-base">{f.title}</h3>
                  <p className="text-sm text-secondary-text leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimoni Penghuni */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="section-title">Apa Kata Mereka?</h2>
          <p className="section-subtitle">Pengalaman nyata para penghuni yang menemukan kos melalui NgekosYuk</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(item => (
            <div key={item.name} className="card p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-sm text-primary-text leading-relaxed italic">"{item.comment}"</p>
              </div>
              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-border">
                <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-sm text-primary-text">{item.name}</p>
                  <p className="text-xs text-secondary-text">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action for Owner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-primary rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-hover">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold text-white">
              Untuk Pemilik Kos
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Punya Kos di Kawasan Bojongsoang? Pasarkan Bersama Kami!
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Jangkau ribuan calon penghuni dan mahasiswa Telkom University. Kelola kamar, atur ketersediaan, dan terima calon penghuni dengan mudah.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link to="/register" className="btn-accent text-sm py-3 px-6">
                Daftar sebagai Pemilik Kos
              </Link>
              <Link to="/search" className="btn-secondary text-sm py-3 px-6 !bg-white/10 !text-white !border-white/30 hover:!bg-white/20">
                Lihat Listing Lainnya
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
