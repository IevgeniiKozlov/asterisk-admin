'use client'

import { NextUIProvider } from '@nextui-org/react'
import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { TrpcProvider } from './(utils)/trpc/trpc-provider'

interface IProvidersProps {
  children: React.ReactNode
  session: Session | null
}

export function Providers({ children, session }: IProvidersProps) {
  return (
    <SessionProvider session={session}>
      <TrpcProvider session={session}>
        <NextUIProvider>{children}</NextUIProvider>
      </TrpcProvider>
    </SessionProvider>
  )
}
