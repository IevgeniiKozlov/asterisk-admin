import Hydrate from '@/app/(utils)/trpc/hydrate-client'
import { dehydrate } from '@tanstack/react-query'
import Header from './(components)/Header'
import MainTable from './(components)/MainTable'
import { createSSRHelper } from './api/trpc/trpc-router'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const helpers = createSSRHelper()
  await helpers.getListCdr.fetch()

  return (
    <Hydrate state={dehydrate(helpers.queryClient)}>
      <main className='relative flex-auto'>
        <Header />
        <MainTable />
      </main>
    </Hydrate>
  )
}
