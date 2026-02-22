"use client"
import AddNewSessionDialog from '@/app/(routes)/dashboard/_components/AddNewSessionDialog'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import Image from 'next/image'
import React, { use, useEffect, useState } from 'react'
import HistoryTable from './HistoryTable'
import { Session } from 'inspector/promises'
import { SessionDetail } from '../medical-agent/[sessionId]/page'

function HistoryList() {
  const [historyList, setHistoryList] = useState<SessionDetail[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    GetHistoryList();
  }, [])

  const GetHistoryList = async () => {
    const result = await axios.get("/api/session-chat?sessionId=all");
    console.log(result.data);
    setHistoryList(result.data);
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="mt-10">
      {historyList.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 p-6 border-2 border-dashed rounded-2xl text-center">
          <Image
            src="/medical-assistance.png"
            alt="empty"
            width={120}
            height={120}
          />

          <h2 className="font-bold text-lg sm:text-xl">
            No Recent Consultations
          </h2>

          <p className="text-sm text-gray-500 max-w-md">
            It looks like you haven't consulted with any doctors yet.
          </p>
          <AddNewSessionDialog />
        </div>
      ) : (
        <div>
          <HistoryTable historyList={historyList} />
        </div>
      )}
    </div>
  )
}

export default HistoryList
