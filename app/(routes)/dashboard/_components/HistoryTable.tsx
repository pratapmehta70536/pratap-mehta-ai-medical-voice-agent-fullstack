import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SessionDetail } from '../medical-agent/[sessionId]/page'
import { Button } from '@/components/ui/button'
import moment from 'moment'
import ViewReportDialog from './ViewReportDialog'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  historyList: SessionDetail[]
}

const ITEMS_PER_PAGE = 4;

function HistoryTable({ historyList }: Props) {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(historyList.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const selectedHistory = historyList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableCaption>Previous Consultation Reports</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead >AI Medical Specialist</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedHistory.map((record: SessionDetail, index: number) => (
            <TableRow key={record.id || index}>
              <TableCell className="font-medium">{record.selectedDoctor.specialist}</TableCell>
              <TableCell>{record.notes}</TableCell>
              <TableCell>{moment(new Date(record.createdOn)).fromNow()}</TableCell>
              <TableCell className="text-right"><ViewReportDialog record={record} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-sm text-gray-500 mr-4">
            Page {currentPage + 1} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPage === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default HistoryTable
