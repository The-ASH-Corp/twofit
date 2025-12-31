import BaseTable from '@/components/table/BaseTable'
import React from 'react'
import { FinanceColumns } from './FinanceColumns'
import { financeData } from './financeData'
import KpiCard from '@/components/cards/KpiCard'
import FinanceKpi from './FinanceKpi'

export default function FinanceTable() {
  return (
    <div>
        <FinanceKpi/>
      <BaseTable columns={FinanceColumns} data={financeData} pageLabel={"Finance List"}/>
    </div>
  )
}
