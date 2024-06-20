'use client'

import { normalizeString } from '@/app/(helpers)/normalizeString'
import { ICdr, ICdrWithPagination } from '@/app/(server)/schemas/cdr.schema'
import { trpc } from '@/app/(utils)/trpc/trpc'
import {
  Button,
  Chip,
  ChipProps,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'
import { signOut } from 'next-auth/react'
import { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { formatDate } from '../(helpers)/formatDate'
import { timeCall } from '../(helpers)/formatTimeCall'
import { Cdr, columns, statusOptions } from '../(lib)/data'
import PaginationTable from './Pagination'
import SearchPanel from './SearchPanel'

const statusColorMap: Record<string, ChipProps['color']> = {
  answered: 'success',
  noanswer: 'danger',
  busy: 'warning',
  failed: 'secondary',
}

const MainTable = ({
  cdrPaginationData,
}: {
  cdrPaginationData: ICdrWithPagination
}) => {
  const [filterValue, setFilterValue] = useState('')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [statusFilter, setStatusFilter] = useState<Selection>('all')
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'calldate',
    direction: 'ascending',
  })
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null
    endDate: Date | null
  }>({
    startDate: null,
    endDate: null,
  })

  const { data: dataCdrs } = trpc.getListCdr.useQuery(undefined)
  const cdr = useMemo(() => (dataCdrs as ICdr[]) || [], [dataCdrs])

  const pages = cdrPaginationData.totalPages

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

  const hasSearchFilter = Boolean(filterValue)

  const filteredItems = useMemo(() => {
    let filteredCdr: ICdr[] = [...cdr]

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
    // if (dateRange.startDate && dateRange.endDate) {
    //   filteredCdr = filteredCdr.filter(cdr => {
    //     const callDate = formatDate(cdr.calldate)
    //     return (
    //       callDate,
    //       {
    //         start: formatDate(dateRange.startDate),
    //         end: dateRange.endDate,
    //       }
    //     )
    //   })
    // }
    return filteredCdr
  }, [cdr, filterValue, hasSearchFilter, statusFilter])

  // const onDateRangeChange = useCallback(
  //   (range: { startDate: Date | null; endDate: Date | null }) => {
  //     setDateRange(range)
  //     setPage(1)
  //   },
  //   [],
  // )

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof Cdr] as number
      const second = b[sortDescriptor.column as keyof Cdr] as number
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, items])

  const renderCell = useCallback((call: Cdr, columnKey: React.Key) => {
    const cellValue = call[columnKey as keyof Cdr]
    switch (columnKey) {
      case 'calldate':
        return (
          <div className='flex flex-col'>
            <p className='text-bold text-sm capitalize'>
              {formatDate(call.calldate)}
            </p>
          </div>
        )
      case 'src':
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
              {timeCall(call.duration - call.billsec)}
            </p>
          </div>
        )
      case 'billsec':
        return (
          <div className='flex flex-col'>
            <p className='text-bold text-sm capitalize'>
              {timeCall(call.billsec)}
            </p>
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

  return (
    <section className='h-screen w-full'>
      <div className='container h-full mx-auto flex flex-col pt-[30px] items-start justify-start md:justify-start gap-10'>
        <div className='ml-auto'>
          <Button color='primary' onClick={handleLogOut} variant='flat'>
            Выйти
          </Button>
        </div>
        {/* <DateRangePicker
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
        /> */}
        <Table
          aria-label='Example table with custom cells, pagination and sorting'
          isHeaderSticky
          bottomContent={
            <PaginationTable
              page={page}
              pages={pages}
              setPage={setPage}
              onPreviousPage={onPreviousPage}
              onNextPage={onNextPage}
            />
          }
          bottomContentPlacement='outside'
          classNames={{
            wrapper: 'h-[600px]',
          }}
          selectedKeys={selectedKeys}
          // selectionMode='multiple'
          sortDescriptor={sortDescriptor}
          topContent={
            <SearchPanel
              filterValue={filterValue}
              onSearchChange={onSearchChange}
              statusFilter={statusFilter}
              dataCdrs={cdr}
              onRowsPerPageChange={onRowsPerPageChange}
              onClear={onClear}
              setStatusFilter={setStatusFilter}
              statusOptions={statusOptions}
              // onDateRangeChange={onDateRangeChange}
              // dateRange={dateRange}
            />
          }
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
            {(item: any) => (
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
