'use client'

import {
  Button,
  Chip,
  ChipProps,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from '@nextui-org/react'
import { signOut } from 'next-auth/react'
import React from 'react'
import { columns, users } from '../(lib)/data'

const statusColorMap: Record<string, ChipProps['color']> = {
  answer: 'success',
  // answer: 'danger',
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

type User = (typeof users)[0]

export default function MainTable() {
  const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User]

    switch (columnKey) {
      case 'calldate':
        return (
          <div className='flex flex-col'>
            <p className='text-bold text-sm capitalize'>
              {formatDate(user.calldate)}
            </p>
          </div>
        )
      case 'operator':
        return (
          <div className='flex flex-col'>
            <p className='text-bold text-sm capitalize'>{user.operator}</p>
          </div>
        )
      case 'disposition':
        return (
          <Chip
            className='capitalize'
            color={statusColorMap[user.disposition]}
            size='sm'
            variant='flat'
          >
            {cellValue}
          </Chip>
        )
      case 'actions':
        return (
          <div className='relative flex items-center gap-2'>
            <p>Icons</p>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  return (
    <>
      <Button
        color='primary'
        onClick={async () =>
          await signOut({ callbackUrl: '/authentication/signin' })
        }
      >
        Button
      </Button>
      <Table aria-label='Example table with custom cells'>
        <TableHeader columns={columns}>
          {column => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={users}>
          {item => (
            <TableRow key={item.id}>
              {columnKey => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}
