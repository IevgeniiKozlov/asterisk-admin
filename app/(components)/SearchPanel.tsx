'use client'

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from '@nextui-org/react'
import { useMemo } from 'react'
import { ICdr } from '../(server)/schemas/cdr.schema'

interface ISearchPanelProps {
  filterValue: string
  onSearchChange: ((value: string) => void) | undefined
  statusFilter: any
  dataCdrs: ICdr[]
  onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onClear: (() => void) | undefined
  setStatusFilter: any
  statusOptions: any
  // onDateRangeChange: (range: {
  //   startDate: Date | null
  //   endDate: Date | null
  // }) => void
  // dateRange: { startDate: Date | null; endDate: Date | null }
}

const SearchPanel: React.FC<ISearchPanelProps> = ({
  filterValue,
  onSearchChange,
  statusFilter,
  dataCdrs,
  onRowsPerPageChange,
  onClear,
  setStatusFilter,
  statusOptions,
  // onDateRangeChange,
  // dateRange,
}) => {
  return useMemo(
    () => (
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between gap-3 items-end'>
          <Input
            isClearable
            className='w-full sm:max-w-[25%]'
            placeholder='Кто звонил'
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          {/* <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onChange={onDateRangeChange}
            label='Stay duration'
            labelPlacement='outside'
          /> */}
          {/* <Button onClick={onClear}>Выбор даты</Button> */}
          <div className='flex gap-3'>
            <Dropdown>
              <DropdownTrigger className='hidden sm:flex'>
                <Button variant='flat'>Статус звонка</Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label='Table Columns'
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode='multiple'
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status: any) => (
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
            Всего {dataCdrs?.length} звонков
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
    ),
    [filterValue, onClear, onSearchChange, statusFilter, setStatusFilter, statusOptions, dataCdrs?.length, onRowsPerPageChange],
  )
}

export default SearchPanel
