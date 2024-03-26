import Dashboard from './(components)/Dashboard'

export const dynamic = 'force-dynamic'

export default async function Home() {
  // const CallsDataInit = await ...

  return (
    <main className='relative flex-auto'>
      <Dashboard />
    </main>
  )
}
