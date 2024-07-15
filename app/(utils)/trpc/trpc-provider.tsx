'use client'

import { SERVER_TRPC_URL } from '@/app/(lib)/constants'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { httpBatchLink, loggerLink } from '@trpc/client'
import type { Session } from 'next-auth'
import { useState } from 'react'
import superjson from 'superjson'
import queryClient from './query-client'
import { trpc } from './trpc'

interface ITrpcProviderProps {
  children: React.ReactNode
  session: Session | null
}

export const TrpcProvider = ({ children }: ITrpcProviderProps) => {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: () => true,
        }),
        httpBatchLink({
          url: SERVER_TRPC_URL,
        }),
      ],
      transformer: superjson,
    }),
  )
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </trpc.Provider>
  )
}
