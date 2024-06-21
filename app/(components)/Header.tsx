'use client'

import { Button } from '@nextui-org/react'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'

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
    <div className='ml-auto'>
      <Button color='primary' onClick={handleLogOut} variant='flat'>
        Выйти
      </Button>
    </div>
  )
}

export default Header
