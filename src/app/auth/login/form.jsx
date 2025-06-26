'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Shield, Lock, Mail } from 'lucide-react'

export default function AdminLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('admin')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      })

      if (res.ok) {
        router.push(role === 'super-admin' ? '/super-admin' : '/admin')
      } else {
        setError('Invalid credentials. Please try again.')
      }
    } catch (err) {
      setError('Login failed. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-red-50 transition-all duration-300 hover:shadow-red-100">
      {/* Header with animated icon */}
      <div className="text-center mb-8">
        <div className="w-22 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform ">
          <img src="/logo.png" alt="" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-500">Select your access level</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role selection - modern toggle */}
        <div className="relative bg-gray-50 p-1 rounded-xl">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`relative z-10 py-3 px-4 rounded-lg transition-all duration-300 ${
                role === 'admin' 
                  ? 'text-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setRole('super-admin')}
              className={`relative z-10 py-3 px-4 rounded-lg transition-all duration-300 ${
                role === 'super-admin' 
                  ? 'text-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Super Admin
            </button>
          </div>
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-0.25rem)] bg-gradient-to-r from-red-500 to-red-600 rounded-lg transition-all duration-300 ${
              role === 'admin' ? 'left-1' : 'left-[calc(50%+0.25rem)]'
            }`}
          />
        </div>

        {/* Email field with icon */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
              placeholder="admin@example.com"
              required
            />
          </div>
        </div>

        {/* Password field with icon */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {/* Error message with animation */}
        {error && (
          <div className="animate-fade-in p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
            {error}
          </div>
        )}

        {/* Submit button with loading state */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full group relative flex justify-center py-3 px-4 border border-transparent rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-lg hover:shadow-red-400/30 transition-all duration-300 overflow-hidden"
        >
          <span className={`relative z-10 flex items-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
            Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
          <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </form>

      {/* Subtle footer */}
      <div className="mt-6 text-center text-sm text-gray-400">
        Secure admin portal • v2.4.1
      </div>
    </div>
  )
}