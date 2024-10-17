import Header from '@/app/(components)/Header'
import { auth } from '@/app/(utils)/next-auth/auth'
import Hydrate from '@/app/(utils)/trpc/hydrate-client'
import { createSSRHelper } from '@/app/api/trpc/trpc-router'
import { dehydrate } from '@tanstack/react-query'
import Dashboard from './(components)/Dashboard'

export const dynamic = 'force-dynamic'

export default async function Admin() {
  const session = await auth()
  const helpers = createSSRHelper(session)
  await helpers.getListUsers.fetch()

  return (
    <Hydrate state={dehydrate(helpers.queryClient)}>
      <main className='relative flex flex-col justify-center items-center flex-auto'>
        <Header signOutUrl='/admin/auth/signin' userName={session!.user.name} />
        <Dashboard />
      </main>
    </Hydrate>
  )
}
