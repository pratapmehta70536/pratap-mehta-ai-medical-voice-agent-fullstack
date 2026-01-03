"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useState } from 'react'

function HistoryList() {
  const [historyList, setHistoryList] = useState([])

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

          <Button className="mt-2 w-full sm:w-auto">
            + Start a Consultation
          </Button>
        </div>
      ) : (
        <div>List</div>
      )}
    </div>
  )
}

export default HistoryList
