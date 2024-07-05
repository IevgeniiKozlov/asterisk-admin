'use client'

import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react'
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
    <Navbar
      maxWidth={'2xl'}
      classNames={{
        item: [
          'flex',
          'relative',
          'h-full',
          'justify-between',
          'items-center',
          "data-[active=true]:after:content-['']",
          'data-[active=true]:after:absolute',
          'data-[active=true]:after:bottom-0',
          'data-[active=true]:after:left-0',
          'data-[active=true]:after:right-0',
          'data-[active=true]:after:h-[2px]',
          'data-[active=true]:after:rounded-[2px]',
          'data-[active=true]:after:bg-primary',
        ],
      }}
    >
      <NavbarBrand className='gap-1 items-end'>
        <MdOutlineAdminPanelSettings
          size={45}
          className='text-[#E48700] flex'
        />
        <p className='font-bold text-stone-600'>Admin Panel</p>
      </NavbarBrand>
      {/* <NavbarContent
        className='hidden sm:flex gap-4'
        justify='center'
      ></NavbarContent> */}
      <NavbarContent justify='end'>
        <NavbarItem>
          <Button
            variant='bordered'
            className='border-stone-600 bg-[#E48700] py-4 rounded-xl text-center text-white text-lg font-semibold'
            onClick={handleLogOut}
          >
            Выйти
            <FiLogIn className='text-xl' />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
