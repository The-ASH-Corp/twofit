import BaseTable from '@/components/table/BaseTable'
import React from 'react'
import { therapyListColumns } from './TherapyListColumns'

export default function TherapyList() {
  
    
  return (
    <div>
      <BaseTable columns={therapyListColumns}/>

    </div>
  )
}
