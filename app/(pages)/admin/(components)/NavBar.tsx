'use client'

import { Button } from '@nextui-org/react'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import { FiLogIn } from 'react-icons/fi'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'

export default function CustomNavbar() {
  const handleLogOut = async () => {
    await signOut({ callbackUrl: '/admin/auth/signin', redirect: true })
    toast.success('Вы успешно вылогонились!', {
      style: {
        borderRadius: '10px',
        background: 'grey',
        color: '#fff',
      },
    })
  }
  return (
    <header className='container h-[80px] flex flex-wrap content-center align-center mx-auto'>
      <div className='w-full flex justify-between flex-wrap content-center items-center align-center'>
        <div className='flex flex-row flex-wrap items-end gap-1'>
          <MdOutlineAdminPanelSettings
            size={45}
            className='text-[#E48700] flex'
          />
          <p className='font-bold text-stone-600'>Admin Panel</p>
        </div>
        <Button
          variant='bordered'
          className='border-stone-600 bg-[#ECBC76] py-4 rounded-xl text-center text-white text-md font-semibold'
          onClick={handleLogOut}
        >
          Выйти
          <FiLogIn className='text-xl' />
        </Button>
      </div>
    </header>
  )
}
