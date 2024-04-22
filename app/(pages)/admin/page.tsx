import Hydrate from '@/app/(utils)/trpc/hydrate-client'
import { createSSRHelper } from '@/app/api/trpc/trpc-router'
import { dehydrate } from '@tanstack/react-query'
import Dashboard from './(components)/Dashboard'
import Nav from './(components)/Nav'

export const dynamic = 'force-dynamic'

export default async function Admin() {
  const helpers = createSSRHelper()
  await helpers.getListUsers.fetch()

  return (
    <Hydrate state={dehydrate(helpers.queryClient)}>
      <Nav />
      <main className='relative flex justify-center flex-auto'>
        <Dashboard />
      </main>
    </Hydrate>
  )
}
