'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Lock, Mail, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
export default function EmployeeLoginForm() {
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('employee')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

 const handleSubmit = async (e) => {
  e.preventDefault()
  setIsLoading(true)
  setError('')
  
  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    })

    const data = await res.json()

    if (res.ok) {
      login(data.user) // Store user in context
      // Redirect based on role
      if (data.role === 'Admin' || data.role === 'Manager') {
        router.push('/admin-dashboard')
      } else {
        router.push('/admin-dashboard')
      }
    } else {
      setError(data.message || 'Invalid credentials. Please try again.')
    }
  } catch (err) {
    setError('Login failed. Please check your connection.')
  } finally {
    setIsLoading(false)
  }
}

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-blue-50 transition-all duration-300 hover:shadow-blue-100">
      {/* Header with animated icon */}
      <div className="text-center mb-8">
        <div className="w-22 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform ">
          <User className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Employee Portal</h2>
        <p className="text-gray-500">Select your access level</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role selection - modern toggle */}
        <div className="relative bg-gray-50 p-1 rounded-xl">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setRole('employee')}
              className={`relative z-10 py-3 px-4 rounded-lg transition-all duration-300 ${
                role === 'employee' 
                  ? 'text-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Employee
            </button>
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
          </div>
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-0.25rem)] bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all duration-300 ${
              role === 'employee' ? 'left-1' : 'left-[calc(50%+0.25rem)]'
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
              className="block w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
              placeholder="employee@example.com"
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
              className="block w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
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
          className="w-full group relative flex justify-center py-3 px-4 border border-transparent rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-blue-400/30 transition-all duration-300 overflow-hidden"
        >
          <span className={`relative z-10 flex items-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
            Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
          <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </form>

      {/* Subtle footer */}
      <div className="mt-6 text-center text-sm text-gray-400">
        Secure employee portal • v2.4.1
      </div>
    </div>
  )
}