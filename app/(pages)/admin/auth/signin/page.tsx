import SignIn from '@/app/(pages)/admin/(components)/SignIn'
import Hydrate from '@/app/(utils)/trpc/hydrate-client'
import { createSSRHelper } from '@/app/api/trpc/trpc-router'
import { dehydrate } from '@tanstack/react-query'

export const dynamic = 'force-dynamic'

const SignInPage = () => {
  const helpers = createSSRHelper()

  return (
    <Hydrate state={dehydrate(helpers.queryClient)}>
      <main className='h-screen bg-main-gradient'>
        <section className='container h-full flex justify-center mx-auto'>
          <div className='w-full relative flex flex-col items-center justify-center'>
            <SignIn />
          </div>
        </section>
      </main>
    </Hydrate>
  )
}

export default SignInPage
