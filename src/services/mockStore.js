import { SEED_PROPERTIES, INITIAL_FACILITIES, DEMO_OWNER, DEMO_CUSTOMER } from '../data/seedProperties'

const STORAGE_KEYS = {
  PROPERTIES: 'ngekosyuk_properties',
  USERS: 'ngekosyuk_users',
  REVIEWS: 'ngekosyuk_reviews',
  FAVORITES: 'ngekosyuk_favorites',
  CONVERSATIONS: 'ngekosyuk_conversations',
  MESSAGES: 'ngekosyuk_messages',
  CURRENT_USER: 'ngekosyuk_current_user',
}

function getStored(key, defaultVal) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultVal
  } catch (e) {
    return defaultVal
  }
}

function setStored(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch (e) {
    console.error(e)
  }
}

export function initMockStore() {
  if (!getStored(STORAGE_KEYS.PROPERTIES, null)) {
    setStored(STORAGE_KEYS.PROPERTIES, SEED_PROPERTIES)
  }
  if (!getStored(STORAGE_KEYS.USERS, null)) {
    setStored(STORAGE_KEYS.USERS, [DEMO_OWNER, DEMO_CUSTOMER])
  }
  if (!getStored(STORAGE_KEYS.FAVORITES, null)) {
    setStored(STORAGE_KEYS.FAVORITES, [])
  }
  if (!getStored(STORAGE_KEYS.REVIEWS, null)) {
    // Initial sample reviews for properties
    const initialReviews = [
      {
        id: 'rev-1',
        property_id: 'kos-1',
        customer_id: DEMO_CUSTOMER.id,
        rating: 5,
        cleanliness_rating: 5,
        comfort_rating: 5,
        security_rating: 5,
        facilities_rating: 4,
        environment_rating: 5,
        comment: 'Kos sangat bersih, bapak dan ibu pengelola ramah. Sangat dekat dengan kampus Telkom University, jalan kaki tidak sampai 5 menit!',
        verification_status: 'verified',
        created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
        users: DEMO_CUSTOMER,
      },
      {
        id: 'rev-2',
        property_id: 'kos-2',
        customer_id: DEMO_CUSTOMER.id,
        rating: 5,
        cleanliness_rating: 5,
        comfort_rating: 5,
        security_rating: 5,
        facilities_rating: 5,
        environment_rating: 4,
        comment: 'Fasilitas premium, WiFi kencang buat tugas dan gaming. Lingkungan tenang dan parkir motor mobil aman.',
        verification_status: 'verified',
        created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
        users: DEMO_CUSTOMER,
      },
      {
        id: 'rev-3',
        property_id: 'kos-3',
        customer_id: DEMO_CUSTOMER.id,
        rating: 4.8,
        cleanliness_rating: 5,
        comfort_rating: 5,
        security_rating: 5,
        facilities_rating: 4,
        environment_rating: 5,
        comment: 'Kos putri paling aman dan terjaga di Bojongsoang. Suasana sejuk dan nyaman buat belajar.',
        verification_status: 'verified',
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        users: DEMO_CUSTOMER,
      }
    ]
    setStored(STORAGE_KEYS.REVIEWS, initialReviews)
  }
  if (!getStored(STORAGE_KEYS.CONVERSATIONS, null)) {
    setStored(STORAGE_KEYS.CONVERSATIONS, [
      {
        id: 'conv-demo-1',
        customer_id: DEMO_CUSTOMER.id,
        owner_id: DEMO_OWNER.id,
        property_id: 'kos-1',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        properties: SEED_PROPERTIES[0],
        customer: DEMO_CUSTOMER,
        owner: DEMO_OWNER,
        messages: [
          {
            id: 'msg-1',
            conversation_id: 'conv-demo-1',
            sender_id: DEMO_CUSTOMER.id,
            message: 'Halo, saya tertarik untuk menyewa kamar di Griya Orange Telkom Buah Batu. Apakah kamar masih tersedia?',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            is_read: true,
          },
          {
            id: 'msg-2',
            conversation_id: 'conv-demo-1',
            sender_id: DEMO_OWNER.id,
            message: 'Halo mas Farhan, ya kamar tipe AC Superior masih tersedia 2 kamar kosong. Bisa survey langsung ke lokasi ya.',
            created_at: new Date(Date.now() - 80000000).toISOString(),
            is_read: true,
          }
        ]
      }
    ])
  }
}

// Auto init on import
initMockStore()

export const mockDb = {
  getProperties() {
    return getStored(STORAGE_KEYS.PROPERTIES, SEED_PROPERTIES)
  },
  saveProperties(props) {
    setStored(STORAGE_KEYS.PROPERTIES, props)
  },
  getUsers() {
    return getStored(STORAGE_KEYS.USERS, [DEMO_OWNER, DEMO_CUSTOMER])
  },
  saveUsers(users) {
    setStored(STORAGE_KEYS.USERS, users)
  },
  getCurrentUser() {
    return getStored(STORAGE_KEYS.CURRENT_USER, null)
  },
  setCurrentUser(user) {
    setStored(STORAGE_KEYS.CURRENT_USER, user)
  },
  getReviews() {
    return getStored(STORAGE_KEYS.REVIEWS, [])
  },
  saveReviews(revs) {
    setStored(STORAGE_KEYS.REVIEWS, revs)
  },
  getFavorites() {
    return getStored(STORAGE_KEYS.FAVORITES, [])
  },
  saveFavorites(favs) {
    setStored(STORAGE_KEYS.FAVORITES, favs)
  },
  getConversations() {
    return getStored(STORAGE_KEYS.CONVERSATIONS, [])
  },
  saveConversations(convs) {
    setStored(STORAGE_KEYS.CONVERSATIONS, convs)
  },
}
