'use client'

import { IOutputUser } from '@/app/(server)/schemas/user.schema'
import {
  ButtonGroup,
  Chip,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'
import React from 'react'
import { FaSearch } from 'react-icons/fa'
import EditUserForm from './EditUserForm'
import RemoveUser from './RemoveUser'

const statusColorMap = {
  active: 'success',
  paused: 'danger',
  vacation: 'warning',
}

const sortableColumns = []

const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'ИМЯ', uid: 'name', sortable: true },
  { name: 'ЛОГИН', uid: 'login' },
  // { name: 'PASSWORD', uid: 'password' },
  { name: 'ОПЕРАТОРЫ', uid: 'operators' },
  { name: 'ДЕЙСТВИЯ', uid: 'actions' },
]

const INITIAL_VISIBLE_COLUMNS = [
  'id',
  'login',
  'name',
  'operators',
  // 'password',
  'actions',
]

interface ITableUsersProps {
  users: IOutputUser[] | []
}

const TableUsers = ({ users }: ITableUsersProps) => {
  const [filterValue, setFilterValue] = React.useState('')
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS),
  )
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [page, setPage] = React.useState(1)

  const hasSearchFilter = Boolean(filterValue)
  const headerColumns = React.useMemo(() => {
    return columns.filter(column =>
      Array.from(visibleColumns).includes(column.uid),
    )
  }, [visibleColumns])

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users]
    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(user =>
        user.login.toLowerCase().includes(filterValue.toLowerCase()),
      )
    }
    return filteredUsers
  }, [users, hasSearchFilter, filterValue])

  const pages = Math.ceil(filteredItems.length / rowsPerPage)

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage
    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const sortedItems = React.useMemo(() => {
    return [...items]
    // .sort((a, b) => {
    //   const first = a[sortDescriptor.column]
    //   const second = b[sortDescriptor.column]
    //   const cmp = first < second ? -1 : first > second ? 1 : 0
    //   return sortDescriptor.direction === 'descending' ? -cmp : cmp
    // })
  }, [items])

  const renderCell = React.useCallback((user: any, columnKey: any) => {
    const cellValue = user[columnKey]
    switch (columnKey) {
      case 'name':
        return user.name
      case 'login':
        return user.login
      case 'operators': {
        const operators = user.operators.split(' ')
        return (
          <div className='flex flex-wrap gap-2'>
            {operators.map((operator: string) => (
              <Chip key={operator}>{operator}</Chip>
            ))}
          </div>
        )
      }
      case 'actions':
        return (
          <ButtonGroup>
            <EditUserForm user={user} />
            <RemoveUser user={user} />
          </ButtonGroup>
        )
      default:
        return cellValue
    }
  }, [])
  const onRowsPerPageChange = React.useCallback((e: any) => {
    setRowsPerPage(Number(e.target.value))
    setPage(1)
  }, [])
  const onSearchChange = React.useCallback((value: any) => {
    if (value) {
      setFilterValue(value)
      setPage(1)
    } else {
      setFilterValue('')
    }
  }, [])
  const onClear = React.useCallback(() => {
    setFilterValue('')
    setPage(1)
  }, [])

  const topContent = React.useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div>
          <Input
            isClearable
            className='w-full sm:max-w-[44%]'
            placeholder='Поиск по логину...'
            startContent={<FaSearch />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-default-400 text-small'>
            Всего пользователей: {users.length}
          </span>
          <label className='flex items-center text-default-400 text-small'>
            Строк на странице:
            <select
              className='bg-transparent outline-none text-default-400 text-small'
              onChange={onRowsPerPageChange}
            >
              <option value='5'>5</option>
              <option value='10'>10</option>
              <option value='15'>15</option>
            </select>
          </label>
        </div>
      </div>
    )
  }, [filterValue, onSearchChange, users.length, onRowsPerPageChange, onClear])

  const bottomContent = React.useMemo(() => {
    return (
      <div className='py-2 px-2 flex justify-center items-center'>
        <Pagination
          isCompact
          showControls
          showShadow
          color='primary'
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    )
  }, [page, pages])

  return (
    <Table
      aria-label='Example table with custom cells, pagination and sorting'
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement='outside'
      classNames={{
        wrapper: 'max-h-[382px]',
      }}
      topContent={topContent}
      topContentPlacement='outside'
    >
      <TableHeader columns={headerColumns}>
        {column => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={'Пользователи не найдены'} items={sortedItems}>
        {item => (
          <TableRow key={item.id}>
            {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default TableUsers
