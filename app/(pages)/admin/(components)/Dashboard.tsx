'use client'

import { IOutputUser } from '@/app/(server)/schemas/user.schema'
import { trpc } from '@/app/(utils)/trpc/trpc'
import * as _ from 'lodash'
import React from 'react'
import AddUserForm from './AddUserForm'
import TableUsers from './TableUsers'

export default function Dashboard() {
  const { data: dataCdrs } = trpc.getListCdr.useQuery(undefined)
  const { data: dataUsers } = trpc.getListUsers.useQuery(undefined)
  const users = React.useMemo(
    () => (dataUsers as IOutputUser[]) || [],
    [dataUsers],
  )
  const operators = React.useMemo(() => {
    const operators = dataCdrs?.map(cdr => cdr.src).flat() || []
    return _.uniq(operators)
  }, [dataCdrs])

  return (
    <section className='container flex flex-col gap-6 my-10'>
      <AddUserForm operators={operators} />
      <TableUsers users={users} />
    </section>
  )
}
