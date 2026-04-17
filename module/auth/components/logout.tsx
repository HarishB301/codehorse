'use client'
import { signOut } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import React from 'react'

const Logout = ({
  children,
  className
}: {
  children: React.ReactNode,
  className?: string
}) => {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()   // ✅ no arguments
    router.push("/login")
  }

  return (
    <span className={className} onClick={handleLogout}>
      {children}
    </span>
  )
}

export default Logout