'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminLayout({ children }) {
  const router = useRouter()

  useEffect(() => {
    // Check if admin is authenticated
    const isAdmin = localStorage.getItem('admin-auth') === 'admin'
    if (!isAdmin) router.push('/admin-login')
  }, [])

  return <>{children}</>
}