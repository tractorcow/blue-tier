import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { ReactNode } from 'react'
import localFont from 'next/font/local'
import authOptions from "@/lib/authoptions";
import './globals.css'
import AuthProvider from "@/context/Auth.context";

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Blue Tier',
  description: 'Blue Archive Community Tier List',
}

interface RootLayoutProps {
  children: ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession(authOptions)
  return (
    <html lang='en'>
    <body
      className={ `${ geistSans.variable } ${ geistMono.variable } antialiased` }
    >
    <AuthProvider session={ session }>{ children }</AuthProvider>
    </body>
    </html>
  )
}
