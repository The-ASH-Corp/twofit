import React from 'react'
import BaseTable from '../../components/table/BaseTable'
import { ProgramListColumns } from './ProgramListColumns'
import { programListData } from './programListData'

export default function ProgramTable() {
  return (
    <div>
      <BaseTable columns={ProgramListColumns} data={programListData} />
    </div>
  )
}
