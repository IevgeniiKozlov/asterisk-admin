import SignIn from '../(components)/SignIn'

export const dynamic = 'force-dynamic'

const SignInPage = () => {
  return (
    <main className='h-screen'>
      <section className='container h-full flex justify-center mx-auto'>
        <div className='w-full relative flex flex-col items-center justify-center'>
          <SignIn />
        </div>
      </section>
    </main>
  )
}

export default SignInPage
