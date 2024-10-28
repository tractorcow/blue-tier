'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import discordIcon from './discord-mark-white.png'
import { useState } from 'react'
import SharingWindow from '@/components/Social/SharingWindow'
import ClickOutside from '@/components/ClickOutside/ClickOutside'

export default function AuthComponent() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Toggle dropdown when button is clicked
  const toggleDropdown = () => {
    setIsOpen((isOpen) => !isOpen)
  }

  return (
    <div>
      {session && session.user ? (
        <ClickOutside
          onClickOutside={() => setIsOpen(false)}
          className='relative'
        >
          <button
            onClick={toggleDropdown}
            className='flex items-center space-x-2 rounded-md bg-green-500 px-4 py-2 text-black transition hover:bg-green-600 dark:bg-green-700 dark:text-white dark:hover:bg-green-800'
          >
            <span>Logged in as {session.user.name}</span>
            <svg
              className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M19 9l-7 7-7-7'
              ></path>
            </svg>
          </button>

          {isOpen && (
            <div className='absolute right-0 z-10 mt-2 w-48 rounded-md border-[1px] border-black bg-white py-2 shadow-lg dark:border-white dark:bg-gray-800'>
              <button
                onClick={() => setIsModalOpen(true)}
                className='block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
              >
                Share my rankings
              </button>
              <button
                onClick={() => signOut()}
                className='block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
              >
                Log out
              </button>
              {/*<button className='block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'>*/}
              {/*  Help*/}
              {/*</button>*/}
            </div>
          )}
        </ClickOutside>
      ) : (
        <button
          className='flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600'
          onClick={() => signIn('discord')}
        >
          <Image src={discordIcon} alt='Discord Icon' width={24} height={24} />
          Login with Discord
        </button>
      )}
      {isModalOpen && <SharingWindow onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}
