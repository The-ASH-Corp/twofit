import BaseTable from '@/components/table/BaseTable'
import React from 'react'
import { therapyListColumns } from './TherapyListColumns'

export default function TherapyList() {
  const data=[
    {
      name:"Therapy",
      description:"Description",
      status:"Status",
      actions:"Actions"
    }
  ]
    
  return (
    <div>
      <BaseTable columns={therapyListColumns} data={data}/>

    </div>
  )
}
