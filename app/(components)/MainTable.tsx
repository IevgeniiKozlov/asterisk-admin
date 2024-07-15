'use client'

import { normalizeString } from '@/app/(helpers)/normalizeString'
import { trpc } from '@/app/(utils)/trpc/trpc'
import { getLocalTimeZone, parseAbsoluteToLocal } from '@internationalized/date'
import {
  Button,
  Chip,
  ChipProps,
  DateRangePicker,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  SortDescriptor,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'
import { useCallback, useMemo, useState } from 'react'
import {
  formatDate,
  formatDateForDatePicker,
  formatDateForPrisma,
} from '../(helpers)/formatDate'
import { timeCall } from '../(helpers)/formatTimeCall'
import { Cdr, columns, statusOptions } from '../(lib)/data'

const statusColorMap: Record<string, ChipProps['color']> = {
  answered: 'success',
  noanswer: 'danger',
  busy: 'warning',
  failed: 'secondary',
}

const MainTable = () => {
  const [filterValue, setFilterValue] = useState('')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [statusFilter, setStatusFilter] = useState<any>('all')
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'calldate',
    direction: 'ascending',
  })

  const dispositions =
    statusFilter === 'all'
      ? Array.from(statusOptions).map(status => status.uid)
      : Array.from(statusFilter)

  const [dateRange, setDateRange] = useState<{
    start: any
    end: any
  }>({
    start: parseAbsoluteToLocal(
      formatDateForDatePicker(
        new Date().setFullYear(new Date().getFullYear() - 1),
      ),
    ),
    end: parseAbsoluteToLocal(formatDateForDatePicker(new Date())),
  })

  const { data: dataCdrs, isFetching } = trpc.getListCdrByPagination.useQuery({
    where: {
      disposition: {
        in: [...dispositions],
      },
      OR: [
        {
          src: {
            contains: filterValue,
            lte: 'insensitive', // Optional: Makes the search case-insensitive
          },
        },
        {
          dst: {
            contains: filterValue,
            lte: 'insensitive', // Optional: Makes the search case-insensitive
          },
        },
      ],
      calldate: {
        gte: formatDateForPrisma(dateRange.start.toDate(getLocalTimeZone())),
        lte: formatDateForPrisma(dateRange.end.toDate(getLocalTimeZone())),
      },
    },
    page,
    limit: rowsPerPage,
  })

  const cdrs = useMemo(
    () => (dataCdrs?.items.length ? dataCdrs?.items : []),
    [dataCdrs?.items],
  )

  const pages = dataCdrs?.totalPages || 0

  const sortedItems = useMemo(() => {
    return [...cdrs].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof Cdr] as number
      const second = b[sortDescriptor.column as keyof Cdr] as number
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, cdrs])

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

  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between gap-3 items-end'>
          <Input
            isClearable
            className='w-full sm:max-w-[25%]'
            placeholder='Поиск...'
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <Dropdown>
            <DropdownTrigger className='hidden sm:flex'>
              <Button variant='flat'>Статус</Button>
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
          <DateRangePicker
            hideTimeZone
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-default-400 text-small'>
            Всего {dataCdrs?.totalItems} звонков
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
    dataCdrs?.totalItems,
    dateRange,
    filterValue,
    onClear,
    onRowsPerPageChange,
    onSearchChange,
    statusFilter,
  ])

  const bottomContent = useMemo(() => {
    return pages > 0 ? (
      <div className='flex w-full justify-center'>
        <Pagination
          isCompact
          showControls
          showShadow
          color='warning'
          page={page}
          total={pages}
          onChange={page => setPage(page)}
        />
      </div>
    ) : null
  }, [page, pages])

  return (
    <section className='h-screen w-full'>
      <div className='container h-[calc(100vh-80px)] mx-auto flex flex-col items-start justify-start md:justify-start gap-10'>
        <Table
          aria-label='table with custom cells, pagination and sorting'
          isHeaderSticky
          isStriped
          bottomContent={bottomContent}
          bottomContentPlacement='outside'
          classNames={{
            wrapper: 'max-h-[500px]',
          }}
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement='outside'
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
          <TableBody
            emptyContent={'No cdrs found'}
            items={sortedItems}
            isLoading={isFetching}
            loadingContent={<Spinner color='primary' />}
          >
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
