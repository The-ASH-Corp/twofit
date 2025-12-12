import React from 'react'
import BaseTable from '../../components/table/BaseTable'
 
import { clientsData } from './clientsData'
import { ClientColumns } from './ClientColumns'

export default function ClientsTable() {
  return (
    <div>
      <BaseTable columns={ClientColumns} data={clientsData} actionLabel="Add Client" actionPath="/addclient"/>
    </div>
  )
}
