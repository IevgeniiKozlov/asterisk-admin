import MainTable from './(components)/MainTable'
import { serverClient } from './(utils)/trpc/serverClient'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const callsData = await serverClient.cdr.getList()
  console.log(callsData)

  return (
    <main className='relative flex-auto'>
      <MainTable />
    </main>
  )
}
