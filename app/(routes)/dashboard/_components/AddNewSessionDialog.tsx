"use client"
import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '../../../../components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Loader2 } from 'lucide-react'
import axios from 'axios'
import DoctorAgentCard, { doctorAgent } from './DoctorAgentCard'
import { index } from 'drizzle-orm/gel-core'
import SuggestedDoctorCard from './SuggestedDoctorCard'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { SessionDetail } from '../medical-agent/[sessionId]/page'

function AddNewSessionDialog() {
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>();
  const router = useRouter();
  const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>();
  const [historyList, setHistoryList] = useState<SessionDetail[]>([])

  const { has } = useAuth();
  //@ts-ignore
  const paidUser = has && has({ plan: `pro` })

  useEffect(() => {
    GetHistoryList();
  }, [])

  const GetHistoryList = async () => {
    const result = await axios.get("/api/session-chat?sessionId=all");
    console.log(result.data);
    setHistoryList(result.data);
  }

  const resetState = () => {
    setNote('');
    setSuggestedDoctors(undefined);
    setSelectedDoctor(undefined);
    setLoading(false);
  }


  const OnClickNext = async () => {
    setLoading(true);
    const result = await axios.post('/api/suggest-doctors', {
      notes: note
    });

    console.log(result.data);
    if (Array.isArray(result.data)) {
      setSuggestedDoctors(result.data);
    } else {
      console.error("Suggested doctors is not an array:", result.data);
    }
    setLoading(false);
  }

  const onStartConsultation = async () => {
    setLoading(true);
    //Save all info to database
    const result = await axios.post('/api/session-chat', {
      notes: note,
      selectedDoctor: selectedDoctor
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
    <Dialog onOpenChange={(open) => !open && resetState()}>
      <DialogTrigger asChild>
        <Button className="mt-2 w-full sm:w-auto" disabled={!paidUser && historyList?.length >= 1}>
          + Start a Consultation
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>
          <DialogDescription asChild>
            {!suggestedDoctors ? <div>
              <h2>Add Symptoms or Any Other Details</h2>
              <Textarea
                value={note}
                placeholder='Add Detail Here ...'
                className='h-[200px] mt-1'
                onChange={(e) => setNote(e.target.value)}
              />

            </div> :
              <div>
                <h2>Select the doctor</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                  {/* Suggested doctors */}
                  {suggestedDoctors.map((doctor, index) => (
                    <SuggestedDoctorCard doctorAgent={doctor} key={index}
                      setSelectedDoctor={() => setSelectedDoctor(doctor)}
                      //@ts-ignore
                      selectedDoctor={selectedDoctor} />
                  ))}
                </div>
              </div>
            }
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'}>Cancel</Button>
          </DialogClose>

          {!suggestedDoctors ? <Button disabled={!note || loading} onClick={() => OnClickNext()}>
            {loading && <Loader2 className='animate-spin' />}
            Next <ArrowRight /> </Button>
            : <Button disabled={loading || !selectedDoctor} onClick={() => onStartConsultation()}>
              {loading && <Loader2 className='animate-spin' />}
              Start Consultation <ArrowRight /> </Button>}

        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


export default AddNewSessionDialog
