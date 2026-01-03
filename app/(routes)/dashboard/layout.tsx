import React from 'react'
import AppHeader from './_components/AppHeader';

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AppHeader />
      <main className="px-4 sm:px-6 md:px-10">
        {children}
      </main>
    </div>
  )
}


export default DashboardLayout
