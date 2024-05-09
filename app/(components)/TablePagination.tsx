'use client'

import { trpc } from '@/app/(utils)/trpc/trpc'
import { Button, Pagination } from '@nextui-org/react'
import { useCallback, useMemo, useState } from 'react'

const cdrPaginations = trpc.getListCdrByPagination.useQuery({
  page: 1,
  limit: 50,
})
console.log(cdrPaginations)

const TablePagination = ({ page, limit }: {}) => {
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(50)

  let cdrData = [...cdrPaginations.data]

  const pages = Math.ceil(cdrData.length / rowsPerPage)

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return cdrData.slice(start, end)
  }, [page, cdrData, rowsPerPage])

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
}

export default TablePagination
