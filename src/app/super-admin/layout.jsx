'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SuperAdminLayout({ children }) {
  const router = useRouter()

  useEffect(() => {
    // Check if super-admin is authenticated
    const isSuperAdmin = localStorage.getItem('admin-auth') === 'super-admin'
    if (!isSuperAdmin) router.push('/admin-login')
  }, [])

  return <>{children}</>
}