import { SERVER_TRPC_URL } from '@/(lib)/constants'
import { createCaller } from '@/(server)/routers/_app'
import { httpBatchLink } from '@trpc/client'

const trpcUrl = SERVER_TRPC_URL

export const serverClient = createCaller({
  links: [
    httpBatchLink({
      url: trpcUrl,
    }),
  ],
})
