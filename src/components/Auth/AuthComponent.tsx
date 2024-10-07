'use client' // Ensure you have "use client" at the top for React hooks to work in the component

import { useSession, signIn, signOut } from 'next-auth/react'

export const signInWithDiscord = () => {
  signIn('discord')
}

export default function AuthComponent() {
  const { data: session } = useSession()

  return (
    <div>
      {session && session.user ? (
        <>
          <p>Signed in as {session.user.name}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <>
          <p>Not signed in</p>
          <button onClick={signInWithDiscord}>Sign in with Discord</button>
        </>
      )}
    </div>
  )
}
