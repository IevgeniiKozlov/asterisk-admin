import Hydrate from '@/app/(utils)/trpc/hydrate-client'
import { dehydrate } from '@tanstack/react-query'
import MainTable from './(components)/MainTable'
import { serverClient } from './(utils)/trpc/serverClient'
import { createSSRHelper } from './api/trpc/trpc-router'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const helpers = createSSRHelper()
  await helpers.getListCdr.fetch()

  const cdrPaginationData = await serverClient.getListCdrByPagination({
    page: 1,
    limit: 50,
  })

  console.log(cdrPaginationData)

  return (
    <Hydrate state={dehydrate(helpers.queryClient)}>
      <main className='relative flex-auto'>
        <MainTable cdrPaginationData={cdrPaginationData} />
      </main>
    </Hydrate>
  )
}
