import MainTable from './(components)/MainTable'
import { serverClient } from './(utils)/trpc/serverClient'
export const dynamic = 'force-dynamic'

const App = async () => {
  const callsData = await serverClient.cdr.getList()
  // console.log(callsData)
  return (
    <main className='relative flex-auto'>
      <MainTable callsData={callsData} />
    </main>
  )
}

export default App
