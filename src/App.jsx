import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './hooks/useAuth'

// Layouts
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import CustomerLayout from './layouts/CustomerLayout'
import OwnerLayout from './layouts/OwnerLayout'

// Public Pages
import Home from './pages/Home'
import SearchProperty from './pages/SearchProperty'
import PropertyDetail from './pages/PropertyDetail'
import Favorites from './pages/Favorites'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard'
import CustomerProfile from './pages/customer/CustomerProfile'
import CustomerReviews from './pages/customer/CustomerReviews'
import CustomerMessages from './pages/customer/CustomerMessages'
import CustomerSettings from './pages/customer/CustomerSettings'

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard'
import ManageProperty from './pages/owner/ManageProperty'
import AddProperty from './pages/owner/AddProperty'
import EditProperty from './pages/owner/EditProperty'
import ManageRooms from './pages/owner/ManageRooms'
import OwnerReviews from './pages/owner/OwnerReviews'
import OwnerMessages from './pages/owner/OwnerMessages'
import OwnerProfile from './pages/owner/OwnerProfile'

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#244C3B',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
      <Routes>
        {/* Public & Browsing routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchProperty />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Customer Dashboard routes */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<CustomerDashboard />} />
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="reviews" element={<CustomerReviews />} />
          <Route path="messages" element={<CustomerMessages />} />
          <Route path="settings" element={<CustomerSettings />} />
        </Route>

        {/* Owner Dashboard routes */}
        <Route path="/owner" element={<OwnerLayout />}>
          <Route index element={<OwnerDashboard />} />
          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route path="properties" element={<ManageProperty />} />
          <Route path="properties/add" element={<AddProperty />} />
          <Route path="properties/:id/edit" element={<EditProperty />} />
          <Route path="properties/:id/rooms" element={<ManageRooms />} />
          <Route path="reviews" element={<OwnerReviews />} />
          <Route path="messages" element={<OwnerMessages />} />
          <Route path="profile" element={<OwnerProfile />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
