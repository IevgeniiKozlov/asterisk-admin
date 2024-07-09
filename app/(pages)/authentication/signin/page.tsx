import { Image } from '@nextui-org/react'
import NextImage from 'next/image'
import SignIn from '../(components)/SignIn'

export const dynamic = 'force-dynamic'

const SignInPage = () => {
  return (
    <main className='h-screen flex xs:bg-[#ECBC76] lg:bg-gray-200'>
      <section className='flex mx-auto container-2xl h-full w-full justify-center '>
        <div className='w-1/2 bg-[#ECBC76] hidden lg:flex lg:bg-[#ECBC76] flex-wrap content-center justify-center'>
          <Image
            as={NextImage}
            src='/bgsignin.png'
            width={600}
            height={940}
            alt='asterisk info'
          />
        </div>
        <div className='w-full lg:w-1/2 flex flex-wrap content-center justify-center'>
          <SignIn />
        </div>
      </section>
    </main>
  )
}

export default SignInPage
