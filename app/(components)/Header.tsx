'use client'

import { Button, Image } from '@nextui-org/react'
import { signOut } from 'next-auth/react'
import NextImage from 'next/image'
import toast from 'react-hot-toast'
import { FiLogIn } from 'react-icons/fi'

const Header = () => {
  const handleLogOut = async () => {
    await signOut({ callbackUrl: '/authentication/signin', redirect: true })
    toast.success('Вы успешно вылогонились!', {
      style: {
        borderRadius: '10px',
        background: 'grey',
        color: '#fff',
      },
    })
  }
  return (
    <section className='container h-[80px] flex flex-wrap content-center align-center mx-auto'>
      <div className='w-full flex justify-between flex-wrap content-center items-center align-center'>
        <Image
          as={NextImage}
          src='/Asterisk_logo.png'
          width={100}
          height={90}
          alt='asterisk info'
        />
        <Button
          className='w-[140px] bg-[#E48700] py-2 rounded-xl text-center text-white text-lg font-semibold'
          onClick={handleLogOut}
          variant='flat'
        >
          Выйти
          <FiLogIn className='text-xl' />
        </Button>
      </div>
    </section>
  )
}

export default Header
