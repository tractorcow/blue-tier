'use client'

import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { Session } from "next-auth";

type AuthProviderProps = {
  children: React.ReactNode
  session: Session | null
}

export default function AuthProvider({ children, session }: AuthProviderProps): React.ReactNode {
  return <SessionProvider session={ session }>{ children }</SessionProvider>
}
