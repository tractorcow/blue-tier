'use client' // Ensure you have "use client" at the top for React hooks to work in the component

import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import discordIcon from './discord-mark-white.png'

export const signInWithDiscord = () => {
  signIn('discord')
}

export default function AuthComponent() {
  const { data: session } = useSession()

  return (
    <div>
      {session && session.user ? (
        <div className='flex items-center space-x-4'>
          <span className='text-white'>Hello, {session.user.name}</span>
          <button
            className='rounded-md bg-red-500 px-4 py-2 text-white transition hover:bg-red-600'
            onClick={() => signOut()}
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          className='flex items-center rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600'
          onClick={() => signIn('discord')}
        >
          <Image src={discordIcon} alt='Discord Icon' width={24} height={24} />
          Login with Discord
        </button>
      )}
    </div>
  )
}
