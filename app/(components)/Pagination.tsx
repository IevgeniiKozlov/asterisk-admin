'use client'

import { Button, Pagination } from '@nextui-org/react'
import { useMemo } from 'react'

interface IPaginationProps {
  page: number
  pages: number
  setPage: (page: number) => void
  onPreviousPage: () => void
  onNextPage: () => void
}

const PaginationTable: React.FC<IPaginationProps> = ({
  page,
  pages,
  setPage,
  onPreviousPage,
  onNextPage,
}) => {
  return useMemo(
    () => (
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
          onChange={(page: number) => setPage(page)}
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
    ),
    [pages, onPreviousPage, page, onNextPage, setPage],
  )
}

export default PaginationTable
