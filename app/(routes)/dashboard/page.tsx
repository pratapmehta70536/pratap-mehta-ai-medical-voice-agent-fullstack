import React from 'react'
import HistoryList from './_components/HistoryList'
import { Button } from '@/components/ui/button'
import DoctorsAgentList from './_components/DoctorsAgentList'

function Dashboard() {
  return (
    <div className="mt-6">
      <div className="
        flex flex-col sm:flex-row
        sm:justify-between sm:items-center
        gap-4
      ">
        <h2 className="font-bold text-xl sm:text-2xl">
          My Dashboard
        </h2>

        <Button className="w-full sm:w-auto">
          + Consult With Doctor
        </Button>
      </div>

      <HistoryList />
      <DoctorsAgentList />
    </div>
  )
}

export default Dashboard

