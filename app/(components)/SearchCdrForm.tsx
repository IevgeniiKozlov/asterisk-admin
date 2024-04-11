'use client'

import { statusOptions } from '@/(lib)/data'
import { trpc } from '@/(utils)/trpc/client'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  SortDescriptor,
} from '@nextui-org/react'
import { useCallback, useMemo, useState } from 'react'
import { ICallData } from './MainTable'

export const SearchCdrForm = ({ callsData }: { callsData: ICallData[] }) => {
  const cdr = trpc.cdr.getList.useQuery(undefined, { initialData: callsData })

  const [filterValue, setFilterValue] = useState('')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'calldate',
    direction: 'ascending',
  })

  const hasSearchFilter = Boolean(filterValue)

  const filteredItems = useMemo(() => {
    let filteredCdr = [...cdr.data]

    if (hasSearchFilter) {
      filteredCdr = filteredCdr.filter(cdr => cdr.src)
    }
    if (
      statusFilter !== 'all' &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredCdr = filteredCdr.filter(user =>
        Array.from(statusFilter).includes(user.disposition),
      )
    }
    return filteredCdr
  }, [cdr.data, hasSearchFilter, statusFilter])

  const pages = Math.ceil(filteredItems.length / rowsPerPage)

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  // const sortedItems = useMemo(() => {
  //   return [...items].sort((a: Call, b: Call) => {
  //     const first = a[sortDescriptor.column as keyof Call] as number
  //     const second = b[sortDescriptor.column as keyof Call] as number
  //     const cmp = first < second ? -1 : first > second ? 1 : 0

  //     return sortDescriptor.direction === 'descending' ? -cmp : cmp
  //   })
  // }, [sortDescriptor, items])

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value))
      setPage(1)
    },
    [],
  )

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value)
      setPage(1)
    } else {
      setFilterValue('')
    }
  }, [])

  const onClear = useCallback(() => {
    setFilterValue('')
    setPage(1)
  }, [])
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between gap-3 items-end'>
        <Input
          isClearable
          className='w-full sm:max-w-[34%]'
          placeholder='Поиск по оператору'
          // startContent={<SearchIcon />}
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
        <div className='flex gap-3'>
          <Dropdown>
            <DropdownTrigger className='hidden sm:flex'>
              <Button
                // endContent={<ChevronDownIcon className='text-small' />}
                variant='flat'
              >
                Статус звонка
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label='Table Columns'
              closeOnSelect={false}
              selectedKeys={statusFilter}
              selectionMode='multiple'
              onSelectionChange={setStatusFilter}
            >
              {statusOptions.map(status => (
                <DropdownItem key={status.uid} className='capitalize'>
                  {status.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div className='flex justify-between items-center'>
        <span className='text-default-400 text-small'>
          Всего {cdr.data.length} звонков
        </span>
        <label className='flex items-center text-default-400 text-small'>
          Количество строк на страниице:
          <select
            className='bg-transparent outline-none text-default-600 text-small'
            onChange={onRowsPerPageChange}
          >
            <option value='50'>50</option>
            <option value='75'>75</option>
            <option value='100'>100</option>
          </select>
        </label>
      </div>
    </div>
  )
}
// , [
//   filterValue,
//   onSearchChange,
//   statusFilter,
//   cdr.data.length,
//   onRowsPerPageChange,
//   onClear,
// ]

export default SearchCdrForm
