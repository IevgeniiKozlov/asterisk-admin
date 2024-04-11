'use client'

import { trpc } from '@/app/(utils)/trpc/trpc'
import {
  Button,
  Chip,
  ChipProps,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'

import { normalizeString } from '@/app/(helpers)/normalizeString'
import { useCallback, useMemo, useState } from 'react'
import { formatDate } from '../(helpers)/formatDate'
import { timeCall } from '../(helpers)/formatTimeCall'
import { Call, columns, statusOptions } from '../(lib)/data'

// import {PlusIcon} from "./PlusIcon";
// import {VerticalDotsIcon} from "./VerticalDotsIcon";
// import {ChevronDownIcon} from "./ChevronDownIcon";
// import {SearchIcon} from "./SearchIcon";
// import {capitalize} from "./utils";

export interface ICallData {
  id: number
  calldate: string
  clid: string
  src: string
  dst: string
  realdst: string
  dcontext: string
  channel: string
  dstchannel: string
  lastapp: string
  lastdata: string
  start: string
  answer: string
  end: string
  duration: number
  billsec: number
  disposition: string
  amaflags: number
  remoteip: string
  accountcode: string
  peeraccount: string
  uniqueid: string
  userfield: string
  did: string
  linkedid: string
  sequence: number
  filename: string | null
}

const statusColorMap: Record<string, ChipProps['color']> = {
  answered: 'success',
  noanswer: 'danger',
  busy: 'warning',
  failed: 'secondary',
}

const MainTable = () => {
  const cdr = trpc.getListCdr.useQuery(undefined)

  const [filterValue, setFilterValue] = useState('')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [statusFilter, setStatusFilter] = useState<Selection>('all')
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'calldate',
    direction: 'ascending',
  })

  const hasSearchFilter = Boolean(filterValue)

  const filteredItems = useMemo(() => {
    let filteredCdr = [...cdr.data]

    if (hasSearchFilter) {
      filteredCdr = filteredCdr.filter(
        cdr => cdr.dst.includes(filterValue) || cdr.src.includes(filterValue),
      )
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
  }, [cdr.data, filterValue, hasSearchFilter, statusFilter])

  const pages = Math.ceil(filteredItems.length / rowsPerPage)

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const sortedItems = useMemo(() => {
    return [...items].sort((a: Call, b: Call) => {
      const first = a[sortDescriptor.column as keyof Call] as number
      const second = b[sortDescriptor.column as keyof Call] as number
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, items])

  const renderCell = useCallback((call: Call, columnKey: React.Key) => {
    const cellValue = call[columnKey as keyof Call]

    switch (columnKey) {
      case 'calldate':
        return (
          <div className='flex flex-col'>
            <p className='text-bold text-sm capitalize'>
              {formatDate(call.calldate)}
            </p>
          </div>
        )
      case 'operator':
        return (
          <div className='flex flex-col'>
            <p className='text-bold text-sm capitalize'>{call.src}</p>
          </div>
        )
      case 'disposition':
        return (
          <Chip
            className='capitalize'
            color={statusColorMap[normalizeString(call.disposition)]}
            size='sm'
            variant='flat'
          >
            {cellValue}
          </Chip>
        )
      case 'duration':
        return (
          <div className='flex flex-col'>
            <p className='text-bold text-sm capitalize'>
              {timeCall(call.duration)}
            </p>
          </div>
        )
      case 'billsec':
        return (
          <div className='flex flex-col'>
            <p className='text-bold text-sm capitalize'>{call.billsec}</p>
          </div>
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

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value))
      setPage(1)
    },
    [],
  )

  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between gap-3 items-end'>
          <Input
            isClearable
            className='w-full sm:max-w-[25%]'
            placeholder='Кто звонил'
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
              className='bg-transparent outline-none text-default-400 text-small'
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
  }, [
    filterValue,
    onSearchChange,
    statusFilter,
    cdr.data.length,
    onRowsPerPageChange,
    onClear,
  ])

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1)
    }
  }, [page, pages])

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1)
    }
  }, [page])

  const bottomContent = useMemo(() => {
    return (
      <div className='py-2 px-2 flex gap-8 justify-center items-center'>
        <Button
          isDisabled={pages === 1}
          size='sm'
          variant='flat'
          onPress={onPreviousPage}
        >
          Предыдущая
        </Button>
        <Pagination
          isCompact
          showControls
          showShadow
          color='primary'
          page={page}
          total={pages}
          onChange={setPage}
        />
        <Button
          isDisabled={pages === 1}
          size='sm'
          variant='flat'
          onPress={onNextPage}
        >
          Следующая
        </Button>
      </div>
    )
  }, [page, pages, onPreviousPage, onNextPage])

  return (
    <section className='h-screen w-full'>
      <div className='container mx-auto h-full flex flex-col xs:pt-[30px] sm:pt-[70px] items-start justify-start md:justify-start'>
        <Table
          aria-label='Example table with custom cells, pagination and sorting'
          isHeaderSticky
          bottomContent={bottomContent}
          bottomContentPlacement='outside'
          classNames={{
            wrapper: 'h-[600px]',
          }}
          selectedKeys={selectedKeys}
          // selectionMode='multiple'
          sortDescriptor={sortDescriptor}
          // topContent={Filter({ callsData })}
          topContent={topContent}
          topContentPlacement='outside'
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={columns}>
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
          <TableBody emptyContent={'No users found'} items={sortedItems}>
            {item => (
              <TableRow key={item.id}>
                {columnKey => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}

export default MainTable
