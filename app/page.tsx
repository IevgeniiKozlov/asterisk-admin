import MainTable from './(components)/MainTable'

export const dynamic = 'force-dynamic'

export default async function Home() {
  // const CallsDataInit = await ...

  return (
    <main className='relative flex-auto'>
      <MainTable />
    </main>
  )
}
