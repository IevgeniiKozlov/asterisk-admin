import Hydrate from '@/app/(utils)/trpc/hydrate-client'
import { createSSRHelper } from '@/app/api/trpc/trpc-router'
import { dehydrate } from '@tanstack/react-query'
import Dashboard from './(components)/Dashboard'

export const dynamic = 'force-dynamic'

export default async function Admin() {
  const helpers = createSSRHelper()
  await helpers.getListUsers.fetch()

  return (
    <Hydrate state={dehydrate(helpers.queryClient)}>
      <main className='relative flex-auto'>
        <Dashboard />
      </main>
    </Hydrate>
  )
}
