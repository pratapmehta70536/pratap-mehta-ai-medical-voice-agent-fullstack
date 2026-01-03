import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { IconArrowRight } from '@tabler/icons-react'
import React from 'react'

type doctorAgent = {
  id: number
  specialist: string
  description: string
  image: string
  agentPrompt: string
}

type Props = {
  doctorAgent: doctorAgent
}

function DoctorAgentCard({ doctorAgent }: Props) {
  return (
    <div className="border rounded-2xl p-3 hover:shadow-md transition">
      <Image
        src={doctorAgent.image}
        alt={doctorAgent.specialist}
        width={300}
        height={300}
        className="w-full h-[180px] sm:h-[220px] object-cover rounded-xl"
      />

      <h2 className="font-bold mt-2 text-sm sm:text-base">
        {doctorAgent.specialist}
      </h2>

      <p className="line-clamp-2 text-xs sm:text-sm text-gray-500">
        {doctorAgent.description}
      </p>

      <Button className="w-full mt-3 flex items-center justify-center gap-2 text-sm">
        Start Consultation
        <IconArrowRight size={16} />
      </Button>
    </div>
  )
}

export default DoctorAgentCard
