import BaseTable from '@/components/table/BaseTable'
import React from 'react'
import { feedbackColumns } from './Feedbackolumns'
import { feedbackData } from './feedbackData'

export default function FeedbackList() {
  return (
    <div>
      <BaseTable columns={feedbackColumns} data={feedbackData}/>
    </div>
  )
}
