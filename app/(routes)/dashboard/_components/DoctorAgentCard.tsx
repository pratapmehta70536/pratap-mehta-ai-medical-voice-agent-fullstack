"use client"

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { IconArrowRight } from '@tabler/icons-react'
import React, { useState } from 'react'
import { Loader2, Loader2Icon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'
import { useRouter } from "next/navigation";

export type doctorAgent = {
  id: number,
  specialist: string,
  description: string,
  image: string,
  agentPrompt: string,
  voiceId?: string,
  subscriptionRequired: boolean
}

type Props = {
  doctorAgent: doctorAgent
}

function DoctorAgentCard({ doctorAgent }: Props) {

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { has } = useAuth();
  //@ts-ignore
  const paidUser = has && has({ plan: `pro` })
  console.log(paidUser)

  const onStartConsultation = async () => {
    setLoading(true);
    //Save all info to database
    const result = await axios.post('/api/session-chat', {
      notes: 'New Query',
      selectedDoctor: doctorAgent
    });

    console.log(result.data);
    if (result.data?.sessionId) {
      console.log(result.data.sessionId);
      //Route new Conversation Screen
      router.push('/dashboard/medical-agent/' + result.data.sessionId);
    }
    setLoading(false);
  }

  return (
    <div className="border rounded-2xl p-3 hover:shadow-md transition relative">
      {doctorAgent.subscriptionRequired && !paidUser && <Badge className='absolute m-3 right-0'>
        Premium
      </Badge>}
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

      <Button className='w-full mt-2' onClick={onStartConsultation} disabled={!paidUser && doctorAgent.subscriptionRequired}>

        Start Consultation{loading ? <Loader2Icon className='animate-spin' /> : <IconArrowRight />}</Button>
    </div>
  )
}

export default DoctorAgentCard
