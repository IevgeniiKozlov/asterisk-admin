import Hydrate from '@/app/(utils)/trpc/hydrate-client'
import { dehydrate } from '@tanstack/react-query'
import Header from './(components)/Header'
import MainTable from './(components)/MainTable'
import { auth } from './(utils)/next-auth/auth'
import { createSSRHelper } from './api/trpc/trpc-router'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const session = await auth()
  const helpers = createSSRHelper(session)
  await helpers.getListCdr.fetch()

  const user = await helpers.getByIdUser.fetch({ id: Number(session!.user.id) })

  return (
    <Hydrate state={dehydrate(helpers.queryClient)}>
      <main className='relative flex-auto'>
        <Header
          signOutUrl='/authentication/signin'
          userName={session!.user.name}
        />
        <MainTable user={user} />
      </main>
    </Hydrate>
  )
}
