'use client'

import { Button, Image } from '@nextui-org/react'
import { signOut } from 'next-auth/react'
import NextImage from 'next/image'
import { usePathname } from 'next/navigation'
import toast from 'react-hot-toast'
import { FiLogIn } from 'react-icons/fi'

interface IHeaderProps {
  signOutUrl: string
  userName: string
}

const Header = ({ signOutUrl, userName }: IHeaderProps) => {
  const pathname = usePathname()

  const handleLogOut = async () => {
    await signOut({ callbackUrl: signOutUrl, redirect: true })
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
        <div className='flex gap-1 items-end'>
          <Image
            as={NextImage}
            src='/Asterisk_logo.png'
            width={100}
            height={90}
            alt='asterisk info'
          />
          {pathname === '/admin' && (
            <span className='text-2xl leading-6 text-primary-orange font-bold'>
              Admin
            </span>
          )}
        </div>
        <div className='flex gap-8 items-center'>
          {pathname !== '/admin' && (
            <span className='text-xl leading-6 text-gray-600'>{userName}</span>
          )}
          <Button
            className='w-[140px] bg-primary-orange py-2 rounded-xl text-center text-white text-lg font-semibold'
            onClick={handleLogOut}
            variant='flat'
          >
            Выйти
            <FiLogIn className='text-xl' />
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Header
