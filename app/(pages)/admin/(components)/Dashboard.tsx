'use client'

import { Button } from '@nextui-org/react'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'

export default function Dashboard() {
  return (
    <>
      Admin Page
      <Button
        color='primary'
        onClick={async () => {
          await signOut({ callbackUrl: '/admin/auth/signin', redirect: true })
          toast.success('Вы успешно вылогонились!', {
            style: {
              borderRadius: '10px',
              background: 'grey',
              color: '#fff',
            },
          })
        }}
      >
        Button
      </Button>
    </>
  )
}
