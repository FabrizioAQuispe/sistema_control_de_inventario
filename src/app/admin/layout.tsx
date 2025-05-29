import React from 'react'
import { Dashboard } from '../components/Dashboard'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Dashboard />
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  )
}
