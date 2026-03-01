import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const menuOptions = [
  { id: 1, name: 'Home', path: '/dashboard' },
  { id: 2, name: 'History', path: '/dashboard/history'}, 
  { id: 3, name: 'Pricing', path: '/dashboard/billing' },
  { id: 4, name: 'Profile', path: '/dashboard/profile' },
]

function AppHeader() {
  return (
    <div className='p-5 shadow-sm flex justify-between items-center'>
      <Image src='/logo.png' alt='logo' width={150} height={150} />

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
  )
}

export default AppHeader
