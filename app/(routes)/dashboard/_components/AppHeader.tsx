import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

const menuOptions = [
  { id: 1, name: 'Home', path: '/home' },
  { id: 2, name: 'History', path: '/history' },
  { id: 3, name: 'Pricing', path: '/pricing' },
  { id: 4, name: 'Profile', path: '/home' },
]

function AppHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="flex items-center justify-between px-4 py-3 md:px-10">
        {/* Logo */}
        <Image src="/logo.png" alt="logo" width={110} height={50} />

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-10 items-center">
          {menuOptions.map((option) => (
            <h2
              key={option.id}
              className="cursor-pointer text-sm hover:font-semibold transition-all"
            >
              {option.name}
            </h2>
          ))}
        </nav>

        {/* User */}
        <UserButton />
      </div>
    </header>
  )
}

export default AppHeader
