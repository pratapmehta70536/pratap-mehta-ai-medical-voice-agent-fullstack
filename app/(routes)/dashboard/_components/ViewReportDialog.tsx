import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { SessionDetail } from '../medical-agent/[sessionId]/page'
import moment from 'moment'

interface MedicalReport {
  sessionId: string;
  agent: string;
  user: string;
  timestamp: string;
  chiefComplaint: string;
  summary: string;
  symptoms: string[];
  duration: string;
  severity: string;
  medicationsMentioned: string[];
  recommendations: string[];
}

type Props = {
  record: SessionDetail
}

function ViewReportDialog({ record }: Props) {
  // @ts-ignore
  const report: MedicalReport = record.report;

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={'link'} size={'sm'} className="cursor-pointer">View Report</Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col p-6">
          <DialogHeader className="pb-4">
            <DialogTitle className='flex items-center justify-center gap-2 text-2xl font-bold text-blue-600'>
              🩺 Medical AI Voice Agent Report
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Session Info Section */}
            <section>
              <h3 className="text-blue-600 font-bold text-xl mb-1 flex justify-between items-end">
                Session Info
              </h3>
              <div className="border-t-2 border-blue-500 mb-4"></div>
              <div className="grid grid-cols-2 gap-y-3 text-base text-gray-700">
                <div><span className="font-bold">Doctor:</span> {record.selectedDoctor?.specialist || 'General Physician'}</div>
                <div><span className="font-bold">User:</span> {report?.user || 'Anonymous'}</div>
                <div><span className="font-bold">Consulted On:</span> {moment(record.createdOn).format('MMMM Do YYYY, h:mm a')}</div>
                <div><span className="font-bold">Agent:</span> {report?.agent || (record.selectedDoctor?.specialist + ' AI')}</div>
              </div>
            </section>

            {/* Chief Complaint */}
            <section>
              <h3 className="text-blue-600 font-bold text-xl mb-1">Chief Complaint</h3>
              <div className="border-t-2 border-blue-500 mb-2"></div>
              <p className="text-gray-700">{report?.chiefComplaint}</p>
            </section>

            {/* Summary */}
            <section>
              <h3 className="text-blue-600 font-bold text-xl mb-1">Summary</h3>
              <div className="border-t-2 border-blue-500 mb-2"></div>
              <p className="text-gray-700 leading-relaxed italic">
                {report?.summary}
              </p>
            </section>

            {/* Symptoms */}
            <section>
              <h3 className="text-blue-600 font-bold text-xl mb-1">Symptoms</h3>
              <div className="border-t-2 border-blue-500 mb-2"></div>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {report?.symptoms?.map((symptom, idx) => (
                  <li key={idx} className="capitalize">{symptom}</li>
                ))}
                {(!report?.symptoms || report?.symptoms.length === 0) && <li>No specific symptoms identified.</li>}
              </ul>
            </section>

            {/* Duration & Severity */}
            <section>
              <h3 className="text-blue-600 font-bold text-xl mb-1">Duration & Severity</h3>
              <div className="border-t-2 border-blue-500 mb-4"></div>
              <div className="grid grid-cols-2 text-base text-gray-700 border-b border-dashed border-gray-300 pb-4">
                <div><span className="font-bold">Duration:</span> {report?.duration}</div>
                <div><span className="font-bold">Severity:</span> <span className="capitalize">{report?.severity}</span></div>
              </div>
            </section>

            {/* Medications Mentioned */}
            {report?.medicationsMentioned && report.medicationsMentioned.length > 0 && (
              <section>
                <h3 className="text-blue-600 font-bold text-xl mb-1">Medications Mentioned</h3>
                <div className="border-t-2 border-blue-500 mb-2"></div>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {report.medicationsMentioned.map((med, idx) => (
                    <li key={idx} className="capitalize">{med}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Recommendations */}
            <section>
              <h3 className="text-blue-600 font-bold text-xl mb-1">Recommendations</h3>
              <div className="border-t-2 border-blue-500 mb-2"></div>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {report?.recommendations?.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
                {(!report?.recommendations || report?.recommendations.length === 0) && <li>Follow general health guidance.</li>}
              </ul>
            </section>

            {/* Footer Disclaimer */}
            <div className="mt-8 text-center text-sm text-gray-500 leading-tight py-6">
              This report was generated by an AI Medical Assistant for informational purpose.
              It is created on the basis of current chat and previous such cases scenarios.
              Real doctor is not involved. Thank you
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ViewReportDialog
