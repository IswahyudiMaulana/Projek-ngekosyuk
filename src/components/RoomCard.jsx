import { formatCurrency } from '../utils/formatCurrency'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'

export default function RoomCard({ room }) {
  const isAvailable = room.availability_status === 'available' && room.available_rooms > 0

  return (
    <div className="border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-primary-text mb-1">{room.room_name}</h4>
          <p className="text-xl font-bold text-primary">
            {formatCurrency(room.price)}
            <span className="text-sm font-normal text-secondary-text">/bulan</span>
          </p>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 flex-shrink-0 ${
          isAvailable
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {isAvailable
            ? <><CheckCircleIcon className="w-3.5 h-3.5" />Tersedia</>
            : <><XCircleIcon className="w-3.5 h-3.5" />Penuh</>}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-xs text-secondary-text">
        <span>Total: <strong className="text-primary-text">{room.total_rooms} kamar</strong></span>
        <span>Tersedia: <strong className={isAvailable ? 'text-green-700' : 'text-red-700'}>{room.available_rooms} kamar</strong></span>
        <span>Terisi: <strong className="text-primary-text">{room.occupied_rooms} kamar</strong></span>
      </div>
    </div>
  )
}
