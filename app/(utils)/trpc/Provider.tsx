// 'use client'

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { httpBatchLink } from '@trpc/client'
// import React, { useState } from 'react'
// import SuperJSON from 'superjson'

// import { SERVER_TRPC_URL } from '@/app/(lib)/constants'
// import { trpc } from './trpc'

// export const TrpcProvider = ({ children }: { children: React.ReactNode }) => {
//   const [queryClient] = useState(() => new QueryClient({}))
//   const [trpcClient] = useState(() =>
//     trpc.createClient({
//       links: [
//         httpBatchLink({
//           url: SERVER_TRPC_URL,
//         }),
//       ],
//       transformer: SuperJSON,
//     }),
//   )
//   return (
//     <trpc.Provider client={trpcClient} queryClient={queryClient}>
//       <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//     </trpc.Provider>
//   )
// }
