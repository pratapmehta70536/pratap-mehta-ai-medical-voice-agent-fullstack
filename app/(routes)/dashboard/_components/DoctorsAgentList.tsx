import { AIDoctorAgents } from '@/shared/list'
import React from 'react'
import DoctorAgentCard from './DoctorAgentCard'

function DoctorsAgentList() {
  return (
    <div className="mt-12">
      <h2 className="font-bold text-lg sm:text-xl mb-4">
        AI Specialist Doctors Agent
      </h2>

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        gap-6
      ">
        {AIDoctorAgents.map((doctor: any, index) => (
          <DoctorAgentCard key={index} doctorAgent={doctor} />
        ))}
      </div>
    </div>
  )
}


export default DoctorsAgentList
