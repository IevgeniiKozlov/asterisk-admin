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

export default function CustomNavbar({ user }: { user: any }) {
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
      classNames={{
        item: [
          'flex',
          'relative',
          'h-full',
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
      <NavbarBrand>
        {/* <AcmeLogo /> */}
        <p className='font-bold text-inherit'>ACME</p>
      </NavbarBrand>
      <NavbarContent
        className='hidden sm:flex gap-4'
        justify='center'
      ></NavbarContent>
      <NavbarContent justify='end'>
        <NavbarItem>
          <Button color='primary' onClick={handleLogOut} variant='flat'>
            Выйти
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
