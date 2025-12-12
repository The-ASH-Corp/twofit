import React from 'react'
import BaseTable from '../../components/table/BaseTable'
import { ExpertColumns } from './ExpertColumns'
import { expertsData } from './expertData'

export default function ExpertTable() {
  return (
    <div>
      <BaseTable columns={ExpertColumns} data={expertsData} actionLabel="Add Expert"  actionPath="/addexpert" />
    </div>
  )
}
