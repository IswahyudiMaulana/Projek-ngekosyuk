import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getPropertyById } from '../../services/propertyService'
import { getRoomsByProperty, createRoom, updateRoom, deleteRoom } from '../../services/roomService'
import { formatCurrency } from '../../utils/formatCurrency'
import Loading from '../../components/Loading'
import toast from 'react-hot-toast'
import { PlusIcon, PencilIcon, TrashIcon, ArrowLeftIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function ManageRooms() {
  const { id: propertyId } = useParams()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [roomForm, setRoomForm] = useState({ room_name: '', price: '', total_rooms: '5', available_rooms: '2' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [propertyId])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [prop, roomsData] = await Promise.all([
        getPropertyById(propertyId),
        getRoomsByProperty(propertyId),
      ])
      setProperty(prop)
      setRooms(roomsData || [])
    } catch (e) {
      toast.error('Gagal memuat data kamar')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setRoomForm({ room_name: '', price: '', total_rooms: '5', available_rooms: '2' })
    setShowAdd(false)
    setEditingRoom(null)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!roomForm.room_name.trim() || !roomForm.price) {
      toast.error('Nama tipe kamar dan harga wajib diisi')
      return
    }
    setSaving(true)
    try {
      const data = {
        room_name: roomForm.room_name,
        price: Number(roomForm.price),
        total_rooms: Number(roomForm.total_rooms) || 1,
        available_rooms: Number(roomForm.available_rooms) || 0,
      }
      if (editingRoom) {
        await updateRoom(editingRoom.id, data)
        toast.success('Kamar berhasil diperbarui!')
      } else {
        await createRoom(propertyId, data)
        toast.success('Tipe kamar berhasil ditambahkan!')
      }
      await fetchData()
      resetForm()
    } catch (err) {
      toast.error(err.message || 'Gagal menyimpan kamar')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (room) => {
    setEditingRoom(room)
    setRoomForm({
      room_name: room.room_name,
      price: room.price,
      total_rooms: room.total_rooms,
      available_rooms: room.available_rooms,
    })
    setShowAdd(true)
  }

  const handleDelete = async (roomId, roomName) => {
    if (!confirm(`Hapus tipe kamar "${roomName}"?`)) return
    try {
      await deleteRoom(roomId)
      toast.success('Kamar dihapus')
      await fetchData()
    } catch (err) {
      toast.error('Gagal menghapus kamar')
    }
  }

  const handleQuickAvailability = async (room, newAvail) => {
    try {
      await updateRoom(room.id, { available_rooms: Math.max(0, Math.min(room.total_rooms, newAvail)) })
      toast.success('Ketersediaan kamar langsung diperbarui ke pencarian customer!')
      await fetchData()
    } catch (err) {
      toast.error('Gagal memperbarui ketersediaan')
    }
  }

  if (loading) return <Loading message="Memuat informasi kamar..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/owner/properties" className="p-2 rounded-xl hover:bg-background border border-border">
          <ArrowLeftIcon className="w-5 h-5 text-secondary-text" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-primary-text">Manajemen Kamar & Ketersediaan</h1>
          <p className="text-secondary-text text-sm">Listing: {property?.name}</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-extrabold text-primary-text">{rooms.reduce((s, r) => s + (r.total_rooms || 0), 0)}</p>
          <p className="text-xs text-secondary-text mt-1">Total Unit Kamar</p>
        </div>
        <div className="card p-4 text-center border-green-200 bg-green-50/40">
          <p className="text-2xl font-extrabold text-green-700">{rooms.reduce((s, r) => s + (r.available_rooms || 0), 0)}</p>
          <p className="text-xs text-green-700 font-semibold mt-1">Kamar Kosong (Tersedia)</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-extrabold text-red-600">{rooms.reduce((s, r) => s + (r.occupied_rooms || 0), 0)}</p>
          <p className="text-xs text-secondary-text mt-1">Kamar Terisi Penghuni</p>
        </div>
      </div>

      {/* Add / Edit Form */}
      {showAdd ? (
        <form onSubmit={handleSave} className="card p-6 space-y-4 border-2 border-primary/30">
          <h3 className="font-bold text-primary-text text-base">
            {editingRoom ? 'Edit Tipe Kamar' : 'Tambah Tipe Kamar Baru'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-secondary-text mb-1">
                Nama / Tipe Kamar *
              </label>
              <input
                type="text"
                required
                value={roomForm.room_name}
                onChange={e => setRoomForm({ ...roomForm, room_name: e.target.value })}
                placeholder="Contoh: Kamar Mandi Dalam AC"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary-text mb-1">
                Harga Sewa / Bulan (Rp) *
              </label>
              <input
                type="number"
                required
                value={roomForm.price}
                onChange={e => setRoomForm({ ...roomForm, price: e.target.value })}
                placeholder="Contoh: 1200000"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary-text mb-1">
                Total Jumlah Kamar Tipe Ini
              </label>
              <input
                type="number"
                min="1"
                required
                value={roomForm.total_rooms}
                onChange={e => setRoomForm({ ...roomForm, total_rooms: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary-text mb-1">
                Kamar Kosong / Siap Huni
              </label>
              <input
                type="number"
                min="0"
                required
                value={roomForm.available_rooms}
                onChange={e => setRoomForm({ ...roomForm, available_rooms: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={resetForm} className="btn-secondary text-sm py-2 px-4">
              Batal
            </button>
            <button type="submit" disabled={saving} className="btn-primary text-sm py-2 px-5">
              {saving ? 'Menyimpan...' : 'Simpan Tipe Kamar'}
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => { resetForm(); setShowAdd(true) }}
          className="btn-primary inline-flex items-center gap-2 text-sm py-2.5 px-4"
        >
          <PlusIcon className="w-4 h-4" />
          Tambah Tipe Kamar
        </button>
      )}

      {/* Rooms List */}
      <div className="space-y-4">
        {rooms.length === 0 ? (
          <div className="card p-8 text-center text-secondary-text text-sm">
            Belum ada tipe kamar ditambahkan. Silakan klik tombol di atas.
          </div>
        ) : (
          rooms.map(room => {
            const isAvail = room.available_rooms > 0
            return (
              <div key={room.id} className="card p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-primary-text text-base">{room.room_name}</h3>
                    <p className="text-primary font-extrabold text-lg mt-0.5">
                      {formatCurrency(room.price)} <span className="text-xs font-normal text-secondary-text">/bulan</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(room)}
                      className="p-2 rounded-lg border border-border hover:bg-background text-secondary-text"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(room.id, room.room_name)}
                      className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-background rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border/80">
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-xs text-secondary-text block">Total Kamar:</span>
                      <span className="font-bold text-primary-text">{room.total_rooms}</span>
                    </div>
                    <div>
                      <span className="text-xs text-secondary-text block">Kamar Terisi:</span>
                      <span className="font-bold text-primary-text">{room.occupied_rooms || (room.total_rooms - room.available_rooms)}</span>
                    </div>
                    <div>
                      <span className="text-xs text-secondary-text block">Kamar Kosong:</span>
                      <span className={`font-bold ${isAvail ? 'text-green-700' : 'text-red-600'}`}>{room.available_rooms}</span>
                    </div>
                  </div>

                  {/* Fast update stepper */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-secondary-text mr-1">Ubah Ketersediaan:</span>
                    <button
                      type="button"
                      onClick={() => handleQuickAvailability(room, room.available_rooms - 1)}
                      disabled={room.available_rooms <= 0}
                      className="w-8 h-8 rounded-lg bg-white border border-border font-bold text-sm hover:bg-background disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{room.available_rooms}</span>
                    <button
                      type="button"
                      onClick={() => handleQuickAvailability(room, room.available_rooms + 1)}
                      disabled={room.available_rooms >= room.total_rooms}
                      className="w-8 h-8 rounded-lg bg-white border border-border font-bold text-sm hover:bg-background disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
