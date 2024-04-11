import SignUp from '@/app/(pages)/admin/(components)/SignUp'
import Hydrate from '@/app/(utils)/trpc/hydrate-client'
import { createSSRHelper } from '@/app/api/trpc/trpc-router'
import { dehydrate } from '@tanstack/react-query'

export const dynamic = 'force-dynamic'

const SignUpPage = () => {
  const helpers = createSSRHelper()

  return (
    <Hydrate state={dehydrate(helpers.queryClient)}>
      <main className='h-screen'>
        <section className='container h-full flex justify-center mx-auto'>
          <div className='w-full relative flex flex-col items-center justify-center'>
            <SignUp />
          </div>
        </section>
      </main>
    </Hydrate>
  )
}

export default SignUpPage