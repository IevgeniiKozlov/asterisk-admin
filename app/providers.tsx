'use client'

import { NextUIProvider } from '@nextui-org/react'
import { TrpcProvider } from './(utils)/trpc/trpc-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TrpcProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </TrpcProvider>
  )
}
