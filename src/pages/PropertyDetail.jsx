import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getPropertyById } from '../services/propertyService'
import { getPropertyReviews } from '../services/reviewService'
import { toggleFavorite, isFavorite } from '../services/favoriteService'
import { getOrCreateConversation } from '../services/chatService'
import { useAuth } from '../hooks/useAuth'
import { generateWhatsAppLink } from '../utils/whatsappLink'
import { formatCurrency } from '../utils/formatCurrency'
import { getAvailabilityStatus } from '../utils/propertySorting'
import PropertyGallery from '../components/PropertyGallery'
import RatingStars from '../components/RatingStars'
import ReviewCard from '../components/ReviewCard'
import RoomCard from '../components/RoomCard'
import Loading from '../components/Loading'
import toast from 'react-hot-toast'
import {
  MapPinIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  StarIcon,
  CheckIcon,
  XMarkIcon,
  InformationCircleIcon,
  ClockIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'

const FACILITY_ICONS = {
  'WiFi': '📶', 'AC': '❄️', 'Kamar Mandi Dalam': '🚿', 'Kamar Mandi Luar': '🚽',
  'Kasur': '🛏️', 'Lemari': '🗄️', 'Meja Belajar': '📚', 'Parkir': '🅿️',
  'Dapur': '🍳', 'Laundry': '👕',
}

const GENDER_INFO = {
  PUTRA: { label: 'Kos Putra', desc: 'Khusus penghuni laki-laki', emoji: '👨', className: 'badge-putra' },
  PUTRI: { label: 'Kos Putri', desc: 'Khusus penghuni perempuan', emoji: '👩', className: 'badge-putri' },
  CAMPUR: { label: 'Kos Campur', desc: 'Dapat dihuni laki-laki maupun perempuan', emoji: '👥', className: 'badge-campur' },
}

export default function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { profile, isAuthenticated } = useAuth()

  const [property, setProperty] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [favLoading, setFavLoading] = useState(false)
  const [isFav, setIsFav] = useState(false)
  const [contactLoading, setContactLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [prop, revs] = await Promise.all([
        getPropertyById(id),
        getPropertyReviews(id),
      ])
      setProperty(prop)
      setReviews(revs || [])
      
      if (isAuthenticated && profile?.role === 'customer') {
        const favStatus = await isFavorite(profile.id, id)
        setIsFav(favStatus)
      }
    } catch (err) {
      toast.error('Gagal memuat data properti')
      navigate('/search')
    } finally {
      setLoading(false)
    }
  }

  const handleFavorite = async () => {
    if (!isAuthenticated || profile?.role !== 'customer') {
      toast.error('Login sebagai customer untuk menyimpan favorit')
      return
    }
    setFavLoading(true)
    try {
      const result = await toggleFavorite(profile.id, id)
      setIsFav(result)
      toast.success(result ? 'Ditambahkan ke favorit' : 'Dihapus dari favorit')
    } catch (err) {
      toast.error('Gagal memperbarui favorit')
    } finally {
      setFavLoading(false)
    }
  }

  const handleChat = async () => {
    if (!isAuthenticated || profile?.role !== 'customer') {
      toast.error('Login sebagai customer untuk menghubungi pemilik')
      navigate('/login')
      return
    }
    setContactLoading(true)
    try {
      const conv = await getOrCreateConversation(profile.id, property.owner_id || 'owner-demo-1', id)
      navigate(`/customer/messages?conv=${conv.id}`)
    } catch (err) {
      toast.error('Gagal membuka chat')
    } finally {
      setContactLoading(false)
    }
  }

  const handleWhatsApp = () => {
    const phone = property.users?.phone || '081223344556'
    const url = generateWhatsAppLink(phone, property.name)
    window.open(url, '_blank')
  }

  if (loading) return <Loading fullScreen message="Memuat detail kos..." />
  if (!property) return null

  const availability = getAvailabilityStatus(property)
  const genderInfo = GENDER_INFO[property.gender_type] || GENDER_INFO.CAMPUR
  const facilities = property.property_facilities?.map(pf => pf.facilities?.name).filter(Boolean) || []
  const owner = property.users || { full_name: 'Pemilik Kos', phone: '081223344556' }

  const ratingBreakdown = {
    cleanliness: reviews.length ? reviews.reduce((s, r) => s + (r.cleanliness_rating || 0), 0) / reviews.length : 5,
    comfort: reviews.length ? reviews.reduce((s, r) => s + (r.comfort_rating || 0), 0) / reviews.length : 5,
    security: reviews.length ? reviews.reduce((s, r) => s + (r.security_rating || 0), 0) / reviews.length : 5,
    facilities: reviews.length ? reviews.reduce((s, r) => s + (r.facilities_rating || 0), 0) / reviews.length : 4.8,
    environment: reviews.length ? reviews.reduce((s, r) => s + (r.environment_rating || 0), 0) / reviews.length : 4.9,
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-secondary-text mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-primary">Beranda</Link>
        <span>/</span>
        <Link to="/search" className="hover:text-primary">Cari Kos</Link>
        <span>/</span>
        <span className="text-primary-text font-medium truncate">{property.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-2xl md:text-3xl font-bold text-primary-text">{property.name}</h1>
              <button
                onClick={handleFavorite}
                disabled={favLoading}
                className="flex-shrink-0 w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-background transition-colors"
                title={isFav ? "Hapus dari favorit" : "Simpan ke favorit"}
              >
                {isFav
                  ? <HeartSolid className="w-5 h-5 text-red-500" />
                  : <HeartIcon className="w-5 h-5 text-secondary-text" />}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={genderInfo.className}>
                {genderInfo.emoji} {genderInfo.label}
              </span>
              <span className={
                availability.type === 'available' ? 'badge-available' :
                availability.type === 'full' ? 'badge-full' : 'badge-unconfirmed'
              }>
                {availability.label}
              </span>
              {property.is_demo && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                  DEMO DATA
                </span>
              )}
            </div>

            <div className="flex items-start gap-1.5 text-secondary-text text-sm mb-3">
              <MapPinIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{property.address}</span>
            </div>

            <div className="flex items-center gap-3">
              {property.rating_average > 0 ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <StarIcon className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-primary-text text-lg">{property.rating_average?.toFixed(1)}</span>
                  </div>
                  <span className="text-secondary-text text-sm">({property.review_count} ulasan)</span>
                </>
              ) : (
                <span className="text-sm text-secondary-text">Belum ada ulasan</span>
              )}
            </div>
          </div>

          {/* Gallery */}
          <div>
            <h2 className="text-xl font-bold text-primary-text mb-4">Foto Properti & Lingkungan</h2>
            <PropertyGallery images={property.property_images || []} />
          </div>

          {/* Description */}
          {property.description && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-primary-text mb-3">Tentang Kos Ini</h2>
              <p className="text-secondary-text leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>
          )}

          {/* Facilities */}
          {facilities.length > 0 && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-primary-text mb-4">Fasilitas Properti</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {facilities.map(fac => (
                  <div key={fac} className="flex items-center gap-2 text-sm text-primary-text p-2.5 rounded-xl bg-background border border-border">
                    <span className="text-lg">{FACILITY_ICONS[fac] || '✓'}</span>
                    <span className="font-medium">{fac}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rooms */}
          {property.rooms && property.rooms.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-primary-text mb-4">Pilihan Tipe Kamar & Ketersediaan</h2>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { label: 'Total Kamar', value: property.rooms.reduce((s, r) => s + (r.total_rooms || 0), 0) },
                  { label: 'Tersedia', value: property.rooms.reduce((s, r) => s + (r.available_rooms || 0), 0), highlight: true },
                  { label: 'Terisi', value: property.rooms.reduce((s, r) => s + (r.occupied_rooms || 0), 0) },
                ].map(item => (
                  <div key={item.label} className={`card p-4 text-center ${item.highlight ? 'border-green-200 bg-green-50/50' : ''}`}>
                    <p className={`text-2xl font-bold ${item.highlight ? 'text-green-700' : 'text-primary-text'}`}>
                      {item.value}
                    </p>
                    <p className="text-xs text-secondary-text mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {property.rooms.map(room => <RoomCard key={room.id} room={room} />)}
              </div>
            </div>
          )}

          {/* Kos rules */}
          {(property.rules_description || property.curfew_time || property.guest_policy) && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-primary-text mb-4 flex items-center gap-2">
                <InformationCircleIcon className="w-5 h-5 text-primary" />
                Aturan & Ketentuan Kos
              </h2>
              <div className="space-y-4">
                {property.curfew_time && (
                  <div className="flex items-start gap-3 text-sm">
                    <ClockIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-primary-text">Jam Malam</p>
                      <p className="text-secondary-text">{property.curfew_time}</p>
                    </div>
                  </div>
                )}
                {property.guest_policy && (
                  <div className="flex items-start gap-3 text-sm">
                    <UserGroupIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-primary-text">Kebijakan Tamu</p>
                      <p className="text-secondary-text">{property.guest_policy}</p>
                    </div>
                  </div>
                )}
                {property.rules_description && (
                  <div className="text-sm text-secondary-text leading-relaxed whitespace-pre-line border-t border-border pt-3">
                    {property.rules_description}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rating breakdown */}
          <div>
            <h2 className="text-xl font-bold text-primary-text mb-4">Rating & Ulasan Penghuni</h2>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                <div className="card p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6 mb-5">
                    <div className="text-center sm:border-r sm:border-border sm:pr-8">
                      <p className="text-5xl font-extrabold text-primary">{property.rating_average?.toFixed(1)}</p>
                      <div className="mt-1">
                        <RatingStars rating={property.rating_average} size="md" showValue={false} />
                      </div>
                      <p className="text-xs text-secondary-text mt-1">{property.review_count} ulasan terverifikasi</p>
                    </div>
                    <div className="flex-1 w-full space-y-2">
                      {[
                        { label: 'Kebersihan', value: ratingBreakdown.cleanliness },
                        { label: 'Kenyamanan', value: ratingBreakdown.comfort },
                        { label: 'Keamanan', value: ratingBreakdown.security },
                        { label: 'Fasilitas', value: ratingBreakdown.facilities },
                        { label: 'Lingkungan', value: ratingBreakdown.environment },
                      ].map(item => (
                        <div key={item.label} className="flex items-center gap-3">
                          <span className="text-xs text-secondary-text w-24 flex-shrink-0">{item.label}</span>
                          <div className="flex-1 bg-border rounded-full h-2">
                            <div className="bg-primary rounded-full h-2 transition-all"
                              style={{ width: `${(item.value / 5) * 100}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-primary-text w-6">{item.value.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
                </div>
              </div>
            ) : (
              <div className="card p-8 text-center">
                <StarIcon className="w-10 h-10 text-secondary mx-auto mb-3" />
                <p className="font-semibold text-primary-text">Belum ada ulasan</p>
                <p className="text-sm text-secondary-text mt-1">
                  Ulasan dapat diberikan oleh penghuni yang telah diverifikasi masa huniannya.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Booking & WhatsApp action */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="card p-6 shadow-hover">
              <div className="mb-4">
                <p className="text-xs text-secondary-text">Harga Sewa Mulai</p>
                <p className="text-3xl font-extrabold text-primary">
                  {property.price_min ? formatCurrency(property.price_min) : 'Hubungi Pemilik'}
                </p>
                {property.price_min && <p className="text-secondary-text text-xs mt-0.5">/bulan</p>}
              </div>

              <div className={`flex items-center gap-2 text-sm font-semibold mb-5 p-3 rounded-xl ${
                availability.type === 'available' ? 'bg-green-50 text-green-700 border border-green-200' :
                availability.type === 'full' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
              }`}>
                {availability.type === 'available' && <CheckIcon className="w-5 h-5 flex-shrink-0" />}
                {availability.type === 'full' && <XMarkIcon className="w-5 h-5 flex-shrink-0" />}
                <span>{availability.label}</span>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold bg-[#25D366] text-white hover:bg-[#20ba5a] transition-all duration-200 shadow-soft"
                >
                  <PhoneIcon className="w-5 h-5" />
                  Hubungi via WhatsApp
                </button>

                <button
                  onClick={handleChat}
                  disabled={contactLoading}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  Chat Internal Website
                </button>

                <button
                  onClick={handleFavorite}
                  disabled={favLoading}
                  className="w-full btn-secondary flex items-center justify-center gap-2"
                >
                  {isFav
                    ? <><HeartSolid className="w-5 h-5 text-red-500" /> Tersimpan di Favorit</>
                    : <><HeartIcon className="w-5 h-5" /> Simpan ke Favorit</>}
                </button>
              </div>
            </div>

            {/* Owner card */}
            <div className="card p-5">
              <h3 className="font-semibold text-primary-text mb-3 text-sm">Informasi Pemilik Kos</h3>
              <div className="flex items-center gap-3">
                {owner.profile_image ? (
                  <img src={owner.profile_image} alt={owner.full_name}
                    className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">
                      {owner.full_name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-primary-text text-sm">{owner.full_name}</p>
                  <p className="text-xs text-secondary-text">Pemilik Terverifikasi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
