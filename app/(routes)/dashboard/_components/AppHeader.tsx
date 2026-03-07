"use client"

import { UserButton } from '@clerk/nextjs'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

const menuOptions = [
  { id: 1, name: 'Home', path: '/dashboard' },
  { id: 2, name: 'History', path: '/dashboard/history' },
  { id: 3, name: 'Pricing', path: '/dashboard/billing' },
  { id: 4, name: 'Profile', path: '/dashboard/profile' },
]

function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className='relative'>
      <div className='p-4 md:p-5 shadow-sm flex justify-between items-center bg-white z-50 relative'>
        <div className='flex items-center gap-2'>
          <button
            className='md:hidden p-2 hover:bg-gray-100 rounded-md'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Image src='/logo.png' alt='logo' width={120} height={120} className='w-[100px] md:w-[150px]' />
        </div>

        <ul className='hidden md:flex gap-10'>
          {menuOptions.map((item, index) => (
            <Link href={item.path} key={index}>
              <li className='hover:text-primary cursor-pointer hover:font-bold transition-all'>
                {item.name}
              </li>
            </Link>
          ))}
        </ul>

        <UserButton />
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className='absolute top-full left-0 w-full bg-white shadow-md z-40 md:hidden border-t animate-in fade-in slide-in-from-top-4 duration-300'>
          <ul className='flex flex-col p-4'>
            {menuOptions.map((item, index) => (
              <Link
                href={item.path}
                key={index}
                onClick={() => setIsMenuOpen(false)}
              >
                <li className='py-3 border-b last:border-0 hover:text-primary transition-all'>
                  {item.name}
                </li>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default AppHeader
