import React from 'react'
import BaseTable from '../../components/table/BaseTable'
 
import { clientsData } from './clientsData'
import { ClientColumns } from './ClientColumns'

export default function ClientsTable() {
  return (
    <div>
      <BaseTable
        columns={ClientColumns}
        data={clientsData}
        actionLabel="Add Client"
        actionPath="/addclient"
        profilePath="/clients/profile/69425703ceaa579bbe149425"
        pageLabel={"Clients"}
      />
    </div>
  );
}
