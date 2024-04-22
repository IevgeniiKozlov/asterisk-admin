'use client'

import { IOutputUser } from '@/app/(server)/schemas/user.schema'
import { trpc } from '@/app/(utils)/trpc/trpc'
import {
  Button,
  ButtonGroup,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { FaCheck } from 'react-icons/fa'
import { MdCancel, MdDelete } from 'react-icons/md'

interface IRemoveUserProps {
  user: IOutputUser
}

const RemoveUser = ({ user }: IRemoveUserProps) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const removeUser = trpc.removeUser.useMutation({
    onSuccess: () => {
      toast.success('Пользователь был упешно удален!', {
        style: {
          borderRadius: '10px',
          background: 'grey',
          color: '#fff',
        },
      })
      setIsOpen(false)
      router.refresh()
    },

    onError: () => {
      toast.error('Возникла ошибка при удалении', {
        style: {
          borderRadius: '10px',
          background: 'red',
          color: '#fff',
        },
      })
    },
  })

  const handleDeleteUser = async (userId: number) => {
    await removeUser.mutateAsync({ id: userId })
  }

  return (
    <Popover
      placement='right'
      showArrow
      isOpen={isOpen}
      onOpenChange={open => setIsOpen(open)}
    >
      <PopoverTrigger>
        <Button isIconOnly aria-label='Delete user'>
          <MdDelete
            size='1.5rem'
            className='transition-colors hover:fill-[red] focus:fill-[red]'
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0'>
        <ButtonGroup>
          <Button
            isIconOnly
            className='transition-colors [&>svg]:hover:fill-[green] [&>svg]:focus:fill-[green]'
            onClick={() => handleDeleteUser(user.id)}
          >
            <FaCheck size='1.5rem' />
          </Button>
          <Button
            isIconOnly
            className='transition-colors [&>svg]:hover:fill-[red] [&>svg]:focus:fill-[red]'
            onClick={() => setIsOpen(false)}
          >
            <MdCancel size='1.5rem' />
          </Button>
        </ButtonGroup>
      </PopoverContent>
    </Popover>
  )
}

export default RemoveUser
