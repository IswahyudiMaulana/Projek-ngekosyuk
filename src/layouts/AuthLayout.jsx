import { Outlet, Link } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Simple auth header */}
      <header className="py-4 px-6 border-b border-border bg-white">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">NK</span>
          </div>
          <span className="font-bold text-primary text-lg">NgekosYuk</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-secondary-text">
        © 2024 NgekosYuk. Semua hak dilindungi.
      </footer>
    </div>
  )
}
